import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all workspaces for the user
    const workspaces = await prisma.notionWorkspace.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Format the response
    const formattedWorkspaces = workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      icon: workspace.icon,
      createdAt: workspace.createdAt,
    }))

    return NextResponse.json({ workspaces: formattedWorkspaces })
  } catch (error) {
    console.error("Error fetching Notion workspaces:", error)
    return NextResponse.json({ error: "Failed to fetch workspaces" }, { status: 500 })
  }
}
