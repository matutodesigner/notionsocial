"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Get paginated posts with filters
export async function getPosts({
  page = 1,
  limit = 10,
  search = "",
  status = "all",
  platform = "all",
  database = "all",
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
}) {
  try {
    // Build the query filters
    const filters: any = {}

    // Add status filter
    if (status !== "all") {
      filters.status = status
    }

    // Add platform filter
    if (platform !== "all") {
      filters.socialAccount = {
        platform,
      }
    }

    // Add database filter
    if (database !== "all") {
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
        database: true,
        socialAccount: true,
      },
      orderBy: {
        [sort]: direction,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return {
      posts,
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
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        database: true,
        socialAccount: true,
      },
    })

    if (!post) {
      return null
    }

    return post
  } catch (error) {
    console.error("Error fetching post:", error)
    throw new Error("Failed to fetch post")
  }
}

// Delete post
export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    })

    revalidatePath("/dashboard/publicacoes")

    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { success: false, error: "Failed to delete post" }
  }
}

// Get user's Notion databases
export async function getNotionDatabases(userId: string) {
  try {
    const databases = await prisma.notionDatabase.findMany({
      where: {
        userId,
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

