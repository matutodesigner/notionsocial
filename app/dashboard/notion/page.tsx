"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Database, Search } from "lucide-react"
import { AddDatabaseDialog } from "@/components/database/add-database-dialog"
import { useSearchParams } from "next/navigation"
import { Loading } from "@/components/loading"
import { CardDatabase } from "@/components/database/card-database"

// Types for the database data
type NotionWorkspace = {
  id: string
  name: string
  icon: string | null
}

type NotionDatabase = {
  id: string
  name: string
  notionId: string
  active: boolean
  lastSync: string | null
  createdAt: string
  updatedAt: string
  workspace: NotionWorkspace
  stats: {
    posts: number
    configured: boolean
  }
}

export default function NotionDatabasesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [connections, setConnections] = useState<NotionDatabase[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [databaseToDelete, setDatabaseToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAddDatabaseOpen, setIsAddDatabaseOpen] = useState(false)
  const searchParams = useSearchParams()

  const observer = useRef<IntersectionObserver | null>(null)
  const lastDatabaseElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreDatabases()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoadingMore, hasMore],
  )

  // Check for success param and open dialog
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setIsAddDatabaseOpen(true)
      // Remove success param from URL after opening dialog
      const url = new URL(window.location.href)
      url.searchParams.delete("success")
      window.history.replaceState({}, "", url)
    }
  }, [searchParams])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load databases when search term changes
  useEffect(() => {
    loadDatabases(true)
  }, [debouncedSearchTerm, activeTab])

  // Load databases on initial render
  useEffect(() => {
    loadDatabases(true)
  }, [])

  // Load databases from API
  const loadDatabases = async (reset = false) => {
    if (reset) {
      setIsLoading(true)
      setNextCursor(null)
    }

    try {
      let url = `/api/notion/databases?limit=9`

      if (debouncedSearchTerm) {
        url += `&search=${encodeURIComponent(debouncedSearchTerm)}`
      }

      if (!reset && nextCursor) {
        url += `&cursor=${nextCursor}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load databases")
      }

      // Filter by active status if needed
      let filteredDatabases = data.databases
      if (activeTab === "active") {
        filteredDatabases = filteredDatabases.filter((db: NotionDatabase) => db.active)
      } else if (activeTab === "inactive") {
        filteredDatabases = filteredDatabases.filter((db: NotionDatabase) => !db.active)
      }

      setConnections((prev) => (reset ? filteredDatabases : [...prev, ...filteredDatabases]))
      setHasMore(data.hasMore)
      setNextCursor(data.nextCursor)
    } catch (error) {
      console.error("Error loading databases:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar bancos de dados",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Load more databases for infinite scrolling
  const loadMoreDatabases = () => {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    loadDatabases(false)
  }

  // Delete a database
  const handleDeleteDatabase = async (id: string) => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/notion/databases?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete database")
      }

      // Remove the deleted database from the list
      setConnections((prev) => prev.filter((db) => db.id !== id))

      toast({
        title: "Banco de dados excluído com sucesso",
        description: "A conexão foi removida permanentemente.",
      })
    } catch (error) {
      console.error("Error deleting database:", error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir banco de dados",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsDeleting(false)
      setDatabaseToDelete(null)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-lg">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Bancos de Dados do Notion
          </h2>
          <p className="text-muted-foreground/70 text-sm">
            Gerencie suas conexões com bancos de dados do Notion
          </p>
        </div>
        <div className="md:flex md:items-center md:gap-4">
          <div className="relative flex-1 mb-4 md:mb-0 md:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 bg-white dark:bg-gray-950 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <AddDatabaseDialog defaultOpen={isAddDatabaseOpen} onOpenChange={setIsAddDatabaseOpen} />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <Loading/>
          ) : connections.length > 0 ? (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {connections.map((connection, i) => (
                <motion.div
                  key={connection.id}
                  variants={fadeInUp}
                  ref={i === connections.length - 1 ? lastDatabaseElementRef : undefined}
                >
                  <CardDatabase
                    connection={connection}
                    onDelete={handleDeleteDatabase}
                    isDeleting={isDeleting}
                    databaseToDelete={databaseToDelete}
                    setDatabaseToDelete={setDatabaseToDelete}
                  />
                </motion.div>
              ))}

              {isLoadingMore && (
                <div className="col-span-full flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </motion.div>
          ) : (
            <Card className="bg-muted/40 shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full blur-xl"></div>
                  <div className="relative bg-background border-2 border-muted p-6 rounded-full">
                    <Database className="h-14 w-14 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Nenhum banco de dados encontrado
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {debouncedSearchTerm
                      ? `Não encontramos nenhum banco de dados com o termo "${debouncedSearchTerm}"`
                      : "Você ainda não conectou nenhum banco de dados do Notion. Conecte agora para começar a automatizar suas publicações nas redes sociais."}
                  </p>
                </div>

                <div className="mt-8">
                  <AddDatabaseDialog defaultOpen={isAddDatabaseOpen} onOpenChange={setIsAddDatabaseOpen} />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

    </div>
  )
}
