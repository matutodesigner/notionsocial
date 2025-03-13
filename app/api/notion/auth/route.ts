import {  NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Notion OAuth configuration
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/notion/auth/callback`

// Initiate OAuth flow
export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Generate a state parameter to prevent CSRF attacks
  const state = Math.random().toString(36).substring(2, 15)

  // Store the state in the database to verify later
  await prisma.verificationToken.create({
    data: {
      identifier: session.user.id,
      token: state,
      expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    },
  })

  // Redirect to Notion OAuth page
  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${state}`

  return NextResponse.redirect(notionAuthUrl)
}
