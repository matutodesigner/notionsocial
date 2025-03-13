import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// List accounts with pagination and search
export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get("cursor")
  const limit = Number.parseInt(searchParams.get("limit") || "9")
  const search = searchParams.get("search") || ""
  const platform = searchParams.get("platform")

  try {
    // Build the query
    const query = {
      where: {
        userId: session.user.id,
        name: {
          contains: search,
        },
      },
      orderBy: {
        lastSync: "desc",
      },
      take: limit + 1, // Take one more to check if there are more results
    } as const

    // Filter by platform if specified
    if (platform && platform !== "all") {
      query.where = {
        ...query.where,
        platform
      }
    }

    // Add cursor-based pagination if cursor is provided
    if (cursor) {
      query.cursor = {
        id: cursor
      }
      query.skip = 1 // Skip the cursor item
    }

    // Execute the query
    const accounts = await prisma.socialAccount.findMany(query)

    // Check if there are more results
    const hasMore = accounts.length > limit
    const results = hasMore ? accounts.slice(0, limit) : accounts

    // Format the response
    const formattedResults = results.map((account) => ({
      id: account.id,
      name: account.name,
      platform: account.platform,
      accountId: account.accountId,
      status: account.status,
      lastSync: account.lastSync,
    }))

    return NextResponse.json({
      accounts: formattedResults,
      hasMore,
      nextCursor: hasMore ? results[results.length - 1].id : null,
    })
  } catch (error) {
    console.error("Error fetching social accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

// Delete a social account
export async function DELETE(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Account ID is required" }, { status: 400 })
  }

  try {
    // Check if the account belongs to the user
    const account = await prisma.socialAccount.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Delete the account
    await prisma.socialAccount.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting social account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
