"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Loader2,
  ArrowDown,
  ArrowUp,
  Filter,
  Search,
  Instagram,
  Facebook,
  TwitterIcon as TikTok,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PageHeader } from "@/components/page-header"
import { getPosts, getNotionDatabases, deletePost } from "./actions"
import type { PostType, DatabaseType } from "./types"

// Import the extracted components
import { RefreshSpin } from "./_components/refresh-spin"
import { LoadingPosts } from "./_components/loading-posts"
import { PostsList } from "./_components/posts-list"
import { EmptyState } from "./_components/empty-state"
import { PostDetailsDialog } from "./_components/post-details-dialog"

export default function PostsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<PostType[]>([])
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [databaseFilter, setDatabaseFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [databases, setDatabases] = useState<DatabaseType[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [totalPosts, setTotalPosts] = useState(0)

  // For infinite scroll
  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoadingMore, hasMore],
  )

  // Initial data load
  useEffect(() => {
    loadPosts()
    loadDatabases()
  }, [])

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters()
  }, [searchTerm, statusFilter, platformFilter, databaseFilter, sortField, sortDirection, posts])

  async function loadPosts() {
    setIsLoading(true)

    try {
      const response = await getPosts({
        page: 1,
        limit: 10,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
        platform: platformFilter !== "all" ? platformFilter : undefined,
        database: databaseFilter !== "all" ? databaseFilter : undefined,
        sort: sortField,
        direction: sortDirection,
      })

      setPosts(response.posts)
      setTotalPosts(response.pagination.total)
      setHasMore(response.pagination.hasMore)
    } catch (error) {
      console.error("Error loading posts:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar publicações",
        description: "Não foi possível carregar as publicações. Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function loadDatabases() {
    try {
      const databases = await getNotionDatabases()
      setDatabases(databases)
    } catch (error) {
      console.error("Error loading databases:", error)
    }
  }

  function applyFilters() {
    let filtered = [...posts]

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (post) => post.title.toLowerCase().includes(searchLower) || post.content.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter)
    }

    // Apply platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((post) => post.platform === platformFilter)
    }

    // Apply database filter
    if (databaseFilter !== "all") {
      filtered = filtered.filter((post) => post.database.id === databaseFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB

      switch (sortField) {
        case "title":
          valueA = a.title
          valueB = b.title
          break
        case "publishedAt":
          valueA = a.publishedAt || "9999" // Push nulls to the end
          valueB = b.publishedAt || "9999"
          break
        case "scheduledFor":
          valueA = a.scheduledFor || "9999"
          valueB = b.scheduledFor || "9999"
          break
        default: // createdAt
          valueA = a.createdAt
          valueB = b.createdAt
      }

      if (sortDirection === "asc") {
        return valueA < valueB ? -1 : 1
      } else {
        return valueA > valueB ? -1 : 1
      }
    })

    setFilteredPosts(filtered)
  }

  // For infinite scroll
  async function loadMorePosts() {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    const nextPage = page + 1

    try {
      const response = await getPosts({
        page: nextPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
        platform: platformFilter !== "all" ? platformFilter : undefined,
        database: databaseFilter !== "all" ? databaseFilter : undefined,
        sort: sortField,
        direction: sortDirection,
      })

      setPosts((prevPosts) => [...prevPosts, ...response.posts])
      setHasMore(response.pagination.hasMore)
      setPage(nextPage)
    } catch (error) {
      console.error("Error loading more posts:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar mais publicações",
        description: "Não foi possível carregar mais publicações. Tente novamente mais tarde.",
      })
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Toggle sort direction
  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc") // Default to descending for new field
    }
  }

  // View post details
  function viewPostDetails(post: PostType) {
    setSelectedPost(post)
    setIsDialogOpen(true)
  }

  // Delete post
  async function handleDeletePost(postId: string) {
    setIsDeleting(true)

    try {
      const result = await deletePost(postId)

      if (result.success) {
        setPosts(posts.filter((post) => post.id !== postId))

        toast({
          title: "Publicação excluída",
          description: "A publicação foi excluída com sucesso.",
        })

        // Close dialog if the deleted post is currently selected
        if (selectedPost?.id === postId) {
          setIsDialogOpen(false)
        }
      } else {
        throw new Error(result.error || "Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir publicação",
        description: "Não foi possível excluir a publicação. Tente novamente mais tarde.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Publicações" description="Gerencie todas as suas publicações em um só lugar">
        <Button onClick={loadPosts} variant="outline" className="gap-2">
          <RefreshSpin isLoading={isLoading} />
          Atualizar
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar publicações..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs" variant="secondary">
                  {statusFilter !== "all" || platformFilter !== "all" || databaseFilter !== "all" ? "!" : ""}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="failed">Falhou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Plataforma</h4>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as plataformas</SelectItem>
                      <SelectItem value="instagram">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-500" />
                          Instagram
                        </div>
                      </SelectItem>
                      <SelectItem value="facebook">
                        <div className="flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          Facebook
                        </div>
                      </SelectItem>
                      <SelectItem value="tiktok">
                        <div className="flex items-center gap-2">
                          <TikTok className="h-4 w-4" />
                          TikTok
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Banco de Dados</h4>
                  <Select value={databaseFilter} onValueChange={setDatabaseFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar banco de dados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os bancos</SelectItem>
                      {databases.map((db) => (
                        <SelectItem key={db.id} value={db.id}>
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            {db.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Ordenar por</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={sortField} onValueChange={setSortField}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Data de criação</SelectItem>
                        <SelectItem value="publishedAt">Data de publicação</SelectItem>
                        <SelectItem value="scheduledFor">Data agendada</SelectItem>
                        <SelectItem value="title">Título</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                    >
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={() => setIsFilterOpen(false)}>Aplicar Filtros</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="flex items-center gap-2">
            <TikTok className="h-4 w-4" />
            TikTok
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {isLoading ? (
            <LoadingPosts />
          ) : filteredPosts.length > 0 ? (
            <PostsList
              posts={filteredPosts}
              lastPostRef={lastPostElementRef}
              onViewDetails={viewPostDetails}
              onDelete={handleDeletePost}
            />
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}

          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="instagram" className="space-y-4 mt-4">
          {isLoading ? (
            <LoadingPosts />
          ) : filteredPosts.filter((post) => post.platform === "instagram").length > 0 ? (
            <PostsList
              posts={filteredPosts.filter((post) => post.platform === "instagram")}
              lastPostRef={lastPostElementRef}
              onViewDetails={viewPostDetails}
              onDelete={handleDeletePost}
            />
          ) : (
            <EmptyState platform="instagram" />
          )}
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4 mt-4">
          {isLoading ? (
            <LoadingPosts />
          ) : filteredPosts.filter((post) => post.platform === "facebook").length > 0 ? (
            <PostsList
              posts={filteredPosts.filter((post) => post.platform === "facebook")}
              lastPostRef={lastPostElementRef}
              onViewDetails={viewPostDetails}
              onDelete={handleDeletePost}
            />
          ) : (
            <EmptyState platform="facebook" />
          )}
        </TabsContent>

        <TabsContent value="tiktok" className="space-y-4 mt-4">
          {isLoading ? (
            <LoadingPosts />
          ) : filteredPosts.filter((post) => post.platform === "tiktok").length > 0 ? (
            <PostsList
              posts={filteredPosts.filter((post) => post.platform === "tiktok")}
              lastPostRef={lastPostElementRef}
              onViewDetails={viewPostDetails}
              onDelete={handleDeletePost}
            />
          ) : (
            <EmptyState platform="tiktok" />
          )}
        </TabsContent>
      </Tabs>

      {selectedPost && (
        <PostDetailsDialog
          post={selectedPost}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          handleDelete={handleDeletePost}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}

