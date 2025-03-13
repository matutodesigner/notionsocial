import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// List databases with pagination and search
export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get("cursor")
  const limit = Number.parseInt(searchParams.get("limit") || "9")
  const search = searchParams.get("search") || ""

  try {
    // Build the query
    const query = {
      where: {
        userId: session.user.id,
        name: {
          contains: search,
        },
        ...(cursor && {
          id: {
            gt: cursor
          }
        })
      },
      include: {
        workspace: true,
        config: true,
        _count: {
          select: {
            posts: {
              where: {
                OR: [{ status: "published" }, { status: "scheduled" }],
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc" as const,
      },
      take: limit + 1, // Take one more to check if there are more results
    }

    // Execute the query
    const databases = await prisma.notionDatabase.findMany(query)

    // Check if there are more results
    const hasMore = databases.length > limit
    const results = hasMore ? databases.slice(0, limit) : databases

    // Format the response
    const formattedResults = results.map((db) => ({
      id: db.id,
      name: db.name,
      notionId: db.notionId,
      active: db.active,
      lastSync: db.lastSync,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
      workspace: db.workspace && {
        id: db.workspace.id,
        name: db.workspace.name,
        icon: db.workspace.icon,
      },
      stats: {
        posts: db._count?.posts || 0,
        configured: !!db.config,
      },
    }))

    return NextResponse.json({
      databases: formattedResults,
      hasMore,
      nextCursor: hasMore ? results[results.length - 1].id : null,
    })
  } catch (error) {
    console.error("Error fetching Notion databases:", error)
    return NextResponse.json({ error: "Failed to fetch databases" }, { status: 500 })
  }
}

// Delete a database connection
export async function DELETE(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Database ID is required" }, { status: 400 })
  }

  try {
    // Check if the database belongs to the user
    const database = await prisma.notionDatabase.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!database) {
      return NextResponse.json({ error: "Database not found" }, { status: 404 })
    }

    // Delete the database
    await prisma.notionDatabase.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting Notion database:", error)
    return NextResponse.json({ error: "Failed to delete database" }, { status: 500 })
  }
}
