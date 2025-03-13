"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  Clock,
  Database,
  ExternalLink,
  Eye,
  Facebook,
  Filter,
  Instagram,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  TwitterIcon as TikTok,
  Trash,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Mock data types
type Post = {
  id: string
  title: string
  content: string
  imageUrl: string | null
  status: "published" | "scheduled" | "draft" | "failed"
  platform: "instagram" | "facebook" | "tiktok"
  publishedAt: string | null
  scheduledFor: string | null
  createdAt: string
  notionDatabase: {
    id: string
    name: string
  }
  error?: string
}

export default function PublicacoesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [databaseFilter, setDatabaseFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  
  const [sortDirection, setSortDirection]<"asc" | "desc">
  
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [databases, setDatabases] = useState<{ id: string; name: string }[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
      // In a real app, this would be an API call
      // Simulating API latency
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockPosts: Post[] = Array.from({ length: 30 }, (_, i) => ({
        id: `post-${i + 1}`,
        title: `Post ${i + 1} - ${["Lançamento Produto", "Promoção", "Dica", "Novidade"][i % 4]}`,
        content: `Conteúdo do post ${i + 1} com hashtags #notionsocial #automatizado`,
        imageUrl: i % 3 === 0 ? `/placeholder.svg?height=300&width=300&text=Post+${i + 1}` : null,
        status: ["published", "scheduled", "draft", "failed"][Math.floor(Math.random() * 4)] as any,
        platform: ["instagram", "facebook", "tiktok"][Math.floor(Math.random() * 3)] as any,
        publishedAt: i % 4 === 0 ? new Date(Date.now() - Math.random() * 10000000000).toISOString() : null,
        scheduledFor: i % 4 === 1 ? new Date(Date.now() + Math.random() * 10000000000).toISOString() : null,
        createdAt: new Date(Date.now() - Math.random() * 20000000000).toISOString(),
        notionDatabase: {
          id: `db-${Math.floor(i / 10) + 1}`,
          name: `Database ${Math.floor(i / 10) + 1}`,
        },
        error: i % 4 === 3 ? "Falha na autenticação com a API" : undefined,
      }))

      setPosts(mockPosts)
      setHasMore(false) // For mock data, we don't have more to load
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
      // In a real app, this would be an API call
      // Simulating API latency
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockDatabases = [
        { id: "db-1", name: "Database 1" },
        { id: "db-2", name: "Database 2" },
        { id: "db-3", name: "Database 3" },
        { id: "db-4", name: "Database 4" },
      ]

      setDatabases(mockDatabases)
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
      filtered = filtered.filter((post) => post.notionDatabase.id === databaseFilter)
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

  // For infinite scroll in a real app
  function loadMorePosts() {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    setPage((prev) => prev + 1)

    // In a real app, this would fetch the next page of results
    setTimeout(() => {
      setIsLoadingMore(false)
      // Append new results
    }, 1000)
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

  // Get platform icon
  function getPlatformIcon(platform: string, className = "h-4 w-4") {
    switch (platform) {
      case "instagram":
        return <Instagram className={cn(className, "text-pink-500")} />
      case "facebook":
        return <Facebook className={cn(className, "text-blue-600")} />
      case "tiktok":
        return <TikTok className={cn(className)} />
      default:
        return null
    }
  }

  // Get status badge
  function getStatusBadge(status: string) {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <Check className="mr-1 h-3 w-3" />
            Publicado
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Clock className="mr-1 h-3 w-3" />
            Agendado
          </Badge>
        )
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Falhou
          </Badge>
        )
      default:
        return null
    }
  }

  // View post details
  function viewPostDetails(post: Post) {
    setSelectedPost(post)
    setIsDialogOpen(true)
  }

  // Format date
  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A"

    return format(new Date(dateString), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })
  }

  // Delete post
  async function deletePost(postId: string) {
    setIsDeleting(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove post from state
      setPosts(posts.filter((post) => post.id !== postId))

      toast({
        title: "Publicação excluída",
        description: "A publicação foi excluída com sucesso.",
      })

      // Close dialog if the deleted post is currently selected
      if (selectedPost?.id === postId) {
        setIsDialogOpen(false)
      }
    } catch (error) {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Publicações
          </h2>
          <p className="text-muted-foreground">Gerencie todas as suas publicações em um só lugar</p>
        </div>
        <Button onClick={loadPosts} variant="outline" className="gap-2">
          <RefreshSpin isLoading={isLoading} />
          Atualizar
        </Button>
      </div>

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
              onDelete={deletePost}
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
              onDelete={deletePost}
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
              onDelete={deletePost}
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
              onDelete={deletePost}
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
          onDelete={deletePost}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}

// Refresh Spinner Component
function RefreshSpin({ isLoading }: { isLoading: boolean }) {
  return isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />
}

// Loading Posts Component
function LoadingPosts() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row gap-4 p-4">
              <div className="w-full md:w-32 h-32 bg-muted rounded-md" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Posts List Component
function PostsList({
  posts,
  lastPostRef,
  onViewDetails,
  onDelete,
}: {
  posts: Post[]
  lastPostRef: (node: HTMLDivElement | null) => void
  onViewDetails: (post: Post) => void
  onDelete: (postId: string) => void
}) {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          ref={index === posts.length - 1 ? lastPostRef : undefined}
        >
          <Card className="overflow-hidden hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {post.imageUrl && (
                  <div className="w-full md:w-32 h-32 rounded-md overflow-hidden bg-muted">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{post.title}</h3>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      {getStatusBadge(post.status)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Database className="h-3 w-3" />
                      {post.notionDatabase.name}
                      {post.publishedAt && (
                        <>
                          <span className="mx-1">•</span>
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.publishedAt), "dd MMM yyyy", { locale: ptBR })}
                        </>
                      )}
                      {post.scheduledFor && !post.publishedAt && (
                        <>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.scheduledFor), "dd MMM yyyy", { locale: ptBR })}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-1" onClick={() => onViewDetails(post)}>
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Detalhes</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onViewDetails(post)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver no Notion
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(post.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Empty State Component
function EmptyState({ platform, searchTerm }: { platform?: string; searchTerm?: string }) {
  let icon
  let title
  let description

  if (searchTerm) {
    title = "Nenhuma publicação encontrada"
    description = `Não encontramos nenhuma publicação com o termo "${searchTerm}"`
    icon = <Search className="h-12 w-12 text-muted-foreground" />
  } else if (platform) {
    switch (platform) {
      case "instagram":
        icon = <Instagram className="h-12 w-12 text-pink-500" />
        break
      case "facebook":
        icon = <Facebook className="h-12 w-12 text-blue-600" />
        break
      case "tiktok":
        icon = <TikTok className="h-12 w-12" />
        break
    }
    title = `Nenhuma publicação no ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
    description = `Você ainda não tem publicações no ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
  } else {
    icon = <Search className="h-12 w-12 text-muted-foreground" />
    title = "Nenhuma publicação encontrada"
    description = "Tente ajustar os filtros ou buscar por outros termos"
  }

  return (
    <Card className="bg-muted/40">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {icon}
        <h3 className="text-lg font-medium mt-4 mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      </CardContent>
    </Card>
  )
}

// Post Details Dialog
function PostDetailsDialog({
  post,
  open,
  onOpenChange,
  onDelete,
  isDeleting,
}: {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (postId: string) => void
  isDeleting: boolean
}) {
  const platformName =
    {
      instagram: "Instagram",
      facebook: "Facebook",
      tiktok: "TikTok",
    }[post.platform] || post.platform

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getPlatformIcon(post.platform, "h-5 w-5")}
            <span>Publicação no {platformName}</span>
          </DialogTitle>
          <DialogDescription>Detalhes completos da publicação e seu status</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <div>{getStatusBadge(post.status)}</div>
          </div>

          {post.imageUrl && (
            <div className="rounded-md overflow-hidden border">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[300px]"
              />
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Conteúdo</h4>
            <div className="p-3 rounded-md bg-muted whitespace-pre-wrap text-sm">{post.content}</div>
          </div>

          {post.error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <strong className="font-medium">Erro:</strong> {post.error}
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Banco de Dados:</span>
              <div className="font-medium flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                {post.notionDatabase.name}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Criado em:</span>
              <div className="font-medium">
                {format(new Date(post.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Publicado em:</span>
              <div className="font-medium">
                {post.publishedAt
                  ? format(new Date(post.publishedAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })
                  : "Não publicado"}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Agendado para:</span>
              <div className="font-medium">
                {post.scheduledFor
                  ? format(new Date(post.scheduledFor), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })
                  : "Não agendado"}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Esta publicação será excluída permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(post.id)} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    "Sim, excluir"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

