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

  // Handle errors from Instagram
  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=${error}`)
  }

  // Verify state parameter to prevent CSRF attacks
  const storedState = await prisma.verificationToken.findFirst({
    where: {
      identifier: `${session.user.id}_instagram`,
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
        identifier: `${session.user.id}_instagram`,
        token: state as string,
      },
    },
  })

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID as string,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET as string,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/social/auth/instagram/callback`,
        code: code as string,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("Error exchanging code for token:", tokenData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=token_exchange_failed`)
    }

    // Get the long-lived token
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`,
    )

    const longLivedTokenData = await longLivedTokenResponse.json()

    // Get user profile information
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${longLivedTokenData.access_token}`,
    )

    const profile = await profileResponse.json()

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        platform: "instagram",
        accountId: profile.id,
      },
    })

    if (existingAccount) {
      // Update the existing account
      await prisma.socialAccount.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          name: `@${profile.username}`,
          token: longLivedTokenData.access_token,
          status: "connected",
          lastSync: new Date(),
        },
      })
    } else {
      // Create a new account
      await prisma.socialAccount.create({
        data: {
          platform: "instagram",
          name: `@${profile.username}`,
          accountId: profile.id,
          token: longLivedTokenData.access_token,
          status: "connected",
          lastSync: new Date(),
          userId: session.user.id,
        },
      })
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?success=instagram`)
  } catch (error) {
    console.error("Error in Instagram callback:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard/social?error=server_error`)
  }
}
