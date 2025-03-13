import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DEFAULT_DATABASE_CONFIG, NotionSetting } from "@/lib/database"

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const workspaceId = searchParams.get("workspaceId")

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 })
  }

  try {
    // Get the workspace
    const workspace = await prisma.notionWorkspace.findFirst({
      where: {
        id: workspaceId,
        userId: session.user.id,
      },
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Initialize Notion client
    const notion = new Client({ auth: workspace.accessToken })

    // Fetch databases from Notion API
    const response = await notion.search({
      filter: {
        value: "database",
        property: "object"
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time"
      }
    })

    // Get already connected databases to filter them out
    const connectedDatabases = await prisma.notionDatabase.findMany({
      where: {
        userId: session.user.id,
        workspaceId: workspace.id,
      },
      select: {
        notionId: true,
      },
    })

    const connectedIds = new Set(connectedDatabases.map((db) => db.notionId))

    // Format the response
    const databases = response.results
      .filter((db) => {
        return 'id' in db && !connectedIds.has(db.id)
      })
      .map((db) => {
        if ('title' in db && 'icon' in db && 'last_edited_time' in db) {
          return {
            id: db.id,
            title: db.title[0]?.plain_text || "Untitled",
            icon: db.icon?.type === "emoji" ? db.icon.emoji : null,
            lastEdited: db.last_edited_time,
          }
        }
        return null
      })
      .filter((db): db is NonNullable<typeof db> => db !== null)

    return NextResponse.json({ databases })
  } catch (error) {
    console.error("Error fetching Notion workspace databases:", error)
    return NextResponse.json({ error: "Failed to fetch databases" }, { status: 500 })
  }
}

// Connect a database from a workspace
export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { workspaceId, databaseId, databaseName } = body

    if (!workspaceId || !databaseId || !databaseName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the workspace belongs to the user
    const workspace = await prisma.notionWorkspace.findFirst({
      where: {
        id: workspaceId,
        userId: session.user.id,
      },
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Check if the database is already connected
    const existingDatabase = await prisma.notionDatabase.findFirst({
      where: {
        notionId: databaseId,
        userId: session.user.id,
      },
    })

    if (existingDatabase) {
      return NextResponse.json({ error: "Database already connected" }, { status: 409 })
    }

    // Configure the database schema and properties
    if (!await NotionSetting(databaseId, workspace.accessToken)) {
      console.error('Failed to configure Notion database')
      throw new Error("Failed to configure Notion database")
    }

    // Create the database connection with default config
    const database = await prisma.notionDatabase.create({
      data: {
        name: databaseName,
        notionId: databaseId,
        userId: session.user.id,
        workspaceId: workspace.id,
        active: true,
        config: {
          create: DEFAULT_DATABASE_CONFIG
        }
      },
      include: {
        config: true
      }
    })

    return NextResponse.json({ success: true, database})
  } catch (error) {
    console.error("Error connecting Notion database:", error)
    return NextResponse.json({ error: "Failed to connect database" }, { status: 500 })
  }
}
