import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Social media platform configurations
const PLATFORMS = {
  instagram: {
    authUrl: "https://api.instagram.com/oauth/authorize",
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/social/auth/instagram/callback`,
    scope: "instagram_business_basic,instagram_business_content_publish",
  },
  facebook: {
    authUrl: "https://www.facebook.com/v17.0/dialog/oauth",
    clientId: process.env.FACEBOOK_CLIENT_ID,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/social/auth/facebook/callback`,
    scope: "pages_show_list,pages_read_engagement,pages_manage_posts,publish_to_groups",
  },
  tiktok: {
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    clientId: process.env.TIKTOK_CLIENT_ID,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/social/auth/tiktok/callback`,
    scope: "user.info.basic,video.publish",
  },
}

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const platform = searchParams.get("platform")

  if (!platform || !PLATFORMS[platform as keyof typeof PLATFORMS]) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 })
  }

  // Generate a state parameter to prevent CSRF attacks
  const state = Math.random().toString(36).substring(2, 15)

  // Store the state in the database to verify later
  await prisma.verificationToken.create({
    data: {
      identifier: `${session.user.id}_${platform}`,
      token: state,
      expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    },
  })

  // Get platform configuration
  const config = PLATFORMS[platform as keyof typeof PLATFORMS]

  // Build the authorization URL
  const authUrl = new URL(config.authUrl)
  authUrl.searchParams.append("client_id", config.clientId as string)
  authUrl.searchParams.append("redirect_uri", config.redirectUri)
  authUrl.searchParams.append("response_type", "code")
  authUrl.searchParams.append("scope", config.scope)
  authUrl.searchParams.append("state", state)

  // Redirect to the authorization URL
  return NextResponse.redirect(authUrl.toString())
}
