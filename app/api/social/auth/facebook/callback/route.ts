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

  // Handle errors from Facebook
  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=${error}`)
  }

  // Verify state parameter to prevent CSRF attacks
  const storedState = await prisma.verificationToken.findFirst({
    where: {
      identifier: `${session.user.id}_facebook`,
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
        identifier: `${session.user.id}_facebook`,
        token: state as string,
      },
    },
  })

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/social/auth/facebook/callback`)}&code=${code}`,
    )

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("Error exchanging code for token:", tokenData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=token_exchange_failed`)
    }

    // Get long-lived access token
    const longLivedTokenResponse = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${tokenData.access_token}`,
    )

    const longLivedTokenData = await longLivedTokenResponse.json()
    const accessToken = longLivedTokenData.access_token

    // Get pages information
    const pagesResponse = await fetch(`https://graph.facebook.com/v17.0/me/accounts?access_token=${accessToken}`)
    const pagesData = await pagesResponse.json()

    if (pagesData.data && pagesData.data.length > 0) {
      // Use the first page for simplicity
      // In a real app, you'd want to let the user choose which page to connect
      const page = pagesData.data[0]

      // Check if account already exists
      const existingAccount = await prisma.socialAccount.findFirst({
        where: {
          userId: session.user.id,
          platform: "facebook",
          accountId: page.id,
        },
      })

      if (existingAccount) {
        // Update the existing account
        await prisma.socialAccount.update({
          where: {
            id: existingAccount.id,
          },
          data: {
            name: page.name,
            token: page.access_token,
            status: "connected",
            lastSync: new Date(),
          },
        })
      } else {
        // Create a new account
        await prisma.socialAccount.create({
          data: {
            platform: "facebook",
            name: page.name,
            accountId: page.id,
            token: page.access_token,
            status: "connected",
            lastSync: new Date(),
            userId: session.user.id,
          },
        })
      }
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?success=facebook`)
  } catch (error) {
    console.error("Error in Facebook callback:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=server_error`)
  }
}
