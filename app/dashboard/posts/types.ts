export type PostType = {
  id: string
  title: string
  content: string
  imageUrl: string | null
  status: "published" | "scheduled" | "draft" | "failed"
  platform: "instagram" | "facebook" | "tiktok"
  publishedAt: string | null
  scheduledFor: string | null
  createdAt: string
  database: {
    id: string
    name: string
  }
  error?: string
}

export type DatabaseType = {
  id: string
  name: string
}

export type PaginationResult = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export type PostsResponse = {
  posts: PostType[]
  pagination: PaginationResult
}

