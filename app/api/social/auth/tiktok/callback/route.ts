import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login`)
  }

  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Handle errors from TikTok
  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=${error}`)
  }

  // Verify state parameter to prevent CSRF attacks
  const storedState = await prisma.verificationToken.findFirst({
    where: {
      identifier: `${session.user.id}_tiktok`,
      token: state as string,
      expires: {
        gt: new Date(),
      },
    },
  })

  if (!storedState) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=invalid_state`)
  }

  // Delete the used state token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: `${session.user.id}_tiktok`,
        token: state as string,
      },
    },
  })

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://open-api.tiktok.com/oauth/access_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_key: process.env.TIKTOK_CLIENT_ID,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/social/auth/tiktok/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || tokenData.message !== "success") {
      console.error("Error exchanging code for token:", tokenData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=token_exchange_failed`)
    }

    const { access_token, open_id} = tokenData.data

    // Get user information
    const userResponse = await fetch("https://open-api.tiktok.com/oauth/userinfo/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        open_id,
        access_token,
      }),
    })

    const userData = await userResponse.json()

    if (!userResponse.ok || userData.message !== "success") {
      console.error("Error fetching user info:", userData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=user_info_failed`)
    }

    const user = userData.data

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        platform: "tiktok",
        accountId: open_id,
      },
    })

    if (existingAccount) {
      // Update the existing account
      await prisma.socialAccount.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          name: `@${user.username || user.display_name}`,
          token: access_token,
          status: "connected",
          lastSync: new Date(),
        },
      })
    } else {
      // Create a new account
      await prisma.socialAccount.create({
        data: {
          platform: "tiktok",
          name: `@${user.username || user.display_name}`,
          accountId: open_id,
          token: access_token,
          status: "connected",
          lastSync: new Date(),
          userId: session.user.id,
        },
      })
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?success=tiktok`)
  } catch (error) {
    console.error("Error in TikTok callback:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=server_error`)
  }
}
