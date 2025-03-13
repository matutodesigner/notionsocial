import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Notion OAuth configuration
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/notion/auth/callback`

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth`)
  }

  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Handle errors from Notion
  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/notion?error=${error}`)
  }

  // Verify state parameter to prevent CSRF attacks
  const storedState = await prisma.verificationToken.findFirst({
    where: {
      identifier: session.user.id,
      token: state as string,
      expires: {
        gt: new Date(),
      },
    },
  })

  if (!storedState) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/notion?error=invalid_state`)
  }

  // Delete the used state token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: session.user.id,
        token: state as string,
      },
    },
  })

  // Exchange code for access token
  try {
    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("Error exchanging code for token:", tokenData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/notion?error=token_exchange_failed`)
    }

    // Save the access token and workspace info to the database
    const { access_token, workspace_id, workspace_name, workspace_icon } = tokenData

    // Create a new Notion integration record
    await prisma.notionWorkspace.create({
      data: {
        notionId: workspace_id,
        name: workspace_name,
        icon: workspace_icon || null,
        accessToken: access_token,
        userId: session.user.id,
      },
    })

    // Redirect to success page
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/notion?success=true`)
  } catch (error) {
    console.error("Error in Notion callback:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/notion?error=server_error`)
  }
}
