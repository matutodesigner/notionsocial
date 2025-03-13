"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Database, RefreshCw, ExternalLink, Check, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { APP_NAME } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

type Workspace = {
  id: string
  name: string
  icon: string | null
}

type NotionDatabase = {
  id: string
  title: string
  icon: string | null
  lastEdited: string
}

export function AddDatabaseDialog({ defaultOpen = false, onOpenChange }: { defaultOpen?: boolean, onOpenChange?: (open: boolean) => void }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(defaultOpen)
  const [isLoading, setIsLoading] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [databases, setDatabases] = useState<NotionDatabase[]>([])
  const [filteredDatabases, setFilteredDatabases] = useState<NotionDatabase[]>([])
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (open) {
      fetchWorkspaces()
    } else {
      // Reset state when dialog closes
      setSelectedWorkspace(null)
      setSelectedDatabase(null)
      setDatabases([])
      setFilteredDatabases([])
      setSearchTerm("")
      onOpenChange?.(false)
    }
  }, [open])

  useEffect(() => {
    if (selectedWorkspace) {
      fetchDatabases(selectedWorkspace)
    }
  }, [selectedWorkspace])

  useEffect(() => {
    const filtered = databases.filter(db => 
      db.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDatabases(filtered)
  }, [searchTerm, databases])

  const fetchWorkspaces = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/notion/workspaces")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch workspaces")
      }

      setWorkspaces(data.workspaces)
    } catch (error) {
      console.error("Error fetching workspaces:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar workspaces",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDatabases = async (workspaceId: string) => {
    setIsLoadingDatabases(true)
    setDatabases([]) // Clear previous databases
    setFilteredDatabases([])
    try {
      const response = await fetch(`/api/notion/workspace/databases?workspaceId=${workspaceId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch databases")
      }

      setDatabases(data.databases)
      setFilteredDatabases(data.databases)
    } catch (error) {
      console.error("Error fetching databases:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar bancos de dados",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsLoadingDatabases(false)
    }
  }

  const connectDatabase = async () => {
    if (!selectedWorkspace || !selectedDatabase) {
      return
    }

    setIsLoading(true)
    try {
      const database = databases.find((db) => db.id === selectedDatabase)
      if (!database) {
        throw new Error("Database not found")
      }

      const response = await fetch("/api/notion/workspace/databases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId: selectedWorkspace,
          databaseId: selectedDatabase,
          databaseName: database.title,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect database")
      }

      toast({
        title: "Banco de dados conectado com sucesso!",
        description: "Você pode configurá-lo agora.",
      })

      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("Error connecting database:", error)
      toast({
        variant: "destructive",
        title: "Erro ao conectar banco de dados",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const connectToNotion = () => {
    window.location.href = "/api/notion/auth"
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value)
      onOpenChange?.(value)
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2" size={"sm"}>
          <Plus className="h-4 w-4" />
          Conectar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Conectar ao Notion</DialogTitle>
          <DialogDescription>
            Conecte um banco de dados do Notion para automatizar suas publicações nas redes sociais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {workspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Database className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Conecte-se ao Notion</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Para começar, você precisa autorizar o {APP_NAME} a acessar seus workspaces do Notion.
              </p>
              <Button onClick={connectToNotion} className="gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    Conectar ao Notion
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Seus Workspaces</h3>
                <div className="grid grid-cols-2 gap-4">
                  {workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedWorkspace === workspace.id
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "hover:border-purple-200 hover:bg-purple-50/50 dark:hover:border-purple-800 dark:hover:bg-purple-900/10"
                      }`}
                      onClick={() => setSelectedWorkspace(workspace.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {workspace.icon ? (
                          <img className="w-8 h-8 flex items-center justify-center text-lg rounded-full" src={workspace.icon} alt="" />
                        ) : (
                          <Database className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="font-medium truncate">{workspace.name}</div>
                      </div>
                      {selectedWorkspace === workspace.id && <Check className="h-5 w-5 text-purple-600" />}
                    </div>
                  ))}
                </div>
              </div>

              {selectedWorkspace && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Bancos de Dados Disponíveis</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchDatabases(selectedWorkspace)}
                      disabled={isLoadingDatabases}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingDatabases ? "animate-spin" : ""}`} />
                      Atualizar
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Filtrar bancos de dados..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {isLoadingDatabases ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 rounded-lg border">
                          <Skeleton className="h-6 w-6 rounded-full mr-3" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredDatabases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
                      <Database className="h-8 w-8 text-muted-foreground" />
                      <h4 className="font-medium">Nenhum banco de dados disponível</h4>
                      <p className="text-sm text-muted-foreground max-w-md">
                        {searchTerm ? "Nenhum banco de dados encontrado com este termo." : "Não encontramos bancos de dados disponíveis neste workspace ou todos já estão conectados."}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open("https://notion.so/new/database", "_blank")}
                        className="mt-2"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Criar banco de dados no Notion
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {filteredDatabases.map((database) => (
                          <motion.div
                            key={database.id}
                            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedDatabase === database.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "hover:border-purple-200 hover:bg-purple-50/50 dark:hover:border-purple-800 dark:hover:bg-purple-900/10"
                            }`}
                            onClick={() => setSelectedDatabase(database.id)}
                            whileHover={{ y: -2 }}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {database.icon ? (
                                <div className="w-8 h-8 flex items-center justify-center text-lg">
                                  {database.icon}
                                </div>
                              ) : (
                                <Database className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <div className="font-medium">{database.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  Editado em {new Date(database.lastEdited).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {selectedDatabase === database.id && <Check className="h-5 w-5 text-purple-600" />}
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {workspaces.length > 0 && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={connectDatabase}
              disabled={!selectedWorkspace || !selectedDatabase || isLoading}
              className={!selectedWorkspace || !selectedDatabase ? "opacity-50" : ""}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                "Conectar Banco de Dados"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
