"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { PostsResponse } from "./types"

// Get paginated posts with filters
export async function getPosts({
  page = 1,
  limit = 10,
  search = "",
  status,
  platform,
  database,
  sort = "createdAt",
  direction = "desc",
}: {
  page?: number
  limit?: number
  search?: string
  status?: string
  platform?: string
  database?: string
  sort?: string
  direction?: "asc" | "desc"
}): Promise<PostsResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    // Build the query filters
    const filters: any = {
      userId: session.user.id,
    }

    // Add status filter
    if (status) {
      filters.status = status
    }

    // Add platform filter
    if (platform) {
      filters.socialAccount = {
        platform,
      }
    }

    // Add database filter
    if (database) {
      filters.databaseId = database
    }

    // Add search filter
    if (search.trim() !== "") {
      filters.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    // Count total matching posts
    const total = await prisma.post.count({
      where: filters,
    })

    // Get posts
    const posts = await prisma.post.findMany({
      where: filters,
      include: {
        database: {
          select: {
            id: true,
            name: true,
          },
        },
        socialAccount: {
          select: {
            id: true,
            platform: true,
          },
        },
      },
      orderBy: {
        [sort]: direction,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Transform posts to match the expected format
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      status: post.status as "published" | "scheduled" | "draft" | "failed",
      platform: post.socialAccount?.platform as "instagram" | "facebook" | "tiktok",
      publishedAt: post.publishedAt?.toISOString() || null,
      scheduledFor: post.scheduledFor?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      database: {
        id: post.database.id,
        name: post.database.name,
      },
      error: post.error || undefined,
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return {
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw new Error("Failed to fetch posts")
  }
}

// Get post by ID
export async function getPostById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        database: {
          select: {
            id: true,
            name: true,
          },
        },
        socialAccount: {
          select: {
            id: true,
            platform: true,
          },
        },
      },
    })

    if (!post) {
      return null
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      status: post.status as "published" | "scheduled" | "draft" | "failed",
      platform: post.socialAccount?.platform as "instagram" | "facebook" | "tiktok",
      publishedAt: post.publishedAt?.toISOString() || null,
      scheduledFor: post.scheduledFor?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      database: {
        id: post.database.id,
        name: post.database.name,
      },
      error: post.error || undefined,
    }
  } catch (error) {
    console.error("Error fetching post:", error)
    throw new Error("Failed to fetch post")
  }
}

// Delete post
export async function deletePost(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    await prisma.post.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    revalidatePath("/dashboard/posts")

    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { success: false, error: "Failed to delete post" }
  }
}

// Get user's Notion databases
export async function getNotionDatabases() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const databases = await prisma.notionDatabase.findMany({
      where: {
        userId: session.user.id,
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
    })

    return databases
  } catch (error) {
    console.error("Error fetching Notion databases:", error)
    throw new Error("Failed to fetch Notion databases")
  }
}

