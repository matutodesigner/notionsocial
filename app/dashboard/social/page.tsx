"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Instagram,
  Facebook,
  TwitterIcon as TikTok,
  RefreshCw,
  Check,
  X,
  Search,
  ExternalLink,
  Link2,
} from "lucide-react"
import { AddAccountDialog } from "@/components/add-account-dialog"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
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
import { Loading } from "@/components/loading"

// Type definition for social accounts
type SocialAccount = {
  id: string
  name: string
  platform: string
  accountId: string
  status: string
  lastSync: string | null
}

export default function SocialAccountsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [activePlatform, setActivePlatform] = useState("all")
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const searchParams = useSearchParams()

  const observer = useRef<IntersectionObserver | null>(null)
  const lastAccountElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreAccounts()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoadingMore, hasMore],
  )

  // Check for success or error messages in URL parameters
  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success) {
      toast({
        title: "Conta conectada com sucesso!",
        description: `Sua conta do ${success.charAt(0).toUpperCase() + success.slice(1)} foi conectada.`,
        variant: "default",
      })
    }

    if (error) {
      toast({
        title: "Erro ao conectar conta",
        description: "Ocorreu um erro durante o processo de conexão.",
        variant: "destructive",
      })
    }

    // Refresh accounts list when returning from OAuth flow
    if (success || error) {
      loadAccounts(true)
    }
  }, [searchParams, toast])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load accounts when search term or active platform changes
  useEffect(() => {
    loadAccounts(true)
  }, [debouncedSearchTerm, activePlatform])

  // Initial load
  useEffect(() => {
    loadAccounts(true)
  }, [])

  // Load accounts from API
  const loadAccounts = async (reset = false) => {
    if (reset) {
      setIsLoading(true)
      setNextCursor(null)
    }

    try {
      let url = `/api/social/accounts?limit=9`

      if (debouncedSearchTerm) {
        url += `&search=${encodeURIComponent(debouncedSearchTerm)}`
      }

      if (activePlatform !== "all") {
        url += `&platform=${activePlatform}`
      }

      if (!reset && nextCursor) {
        url += `&cursor=${nextCursor}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load accounts")
      }

      setAccounts((prev) => (reset ? data.accounts : [...prev, ...data.accounts]))
      setHasMore(data.hasMore)
      setNextCursor(data.nextCursor)
    } catch (error) {
      console.error("Error loading accounts:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar contas",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Load more accounts for infinite scrolling
  const loadMoreAccounts = () => {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    loadAccounts(false)
  }

  // Delete an account
  const deleteAccount = async (id: string) => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/social/accounts?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account")
      }

      // Remove the deleted account from the list
      setAccounts((prev) => prev.filter((account) => account.id !== id))

      toast({
        title: "Conta removida com sucesso",
        description: "A conta foi desconectada permanentemente.",
      })
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        variant: "destructive",
        title: "Erro ao remover conta",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsDeleting(false)
      setAccountToDelete(null)
    }
  }

  // Get platform icon component
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-6 w-6 text-pink-500" />
      case "facebook":
        return <Facebook className="h-6 w-6 text-blue-600" />
      case "tiktok":
        return <TikTok className="h-6 w-6" />
      default:
        return <Link2 className="h-6 w-6" />
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
            Contas de Redes Sociais
          </h2>
          <p className="text-muted-foreground/70 text-sm">
            Gerencie suas contas conectadas para publicação automática
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
          <AddAccountDialog />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActivePlatform}>
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

        <TabsContent value={activePlatform} className="mt-4">
          {isLoading ? (
            <Loading />
          ) : accounts.length > 0 ? (
            <motion.div
              className="grid gap-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {accounts.map((account, i) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  variants={fadeInUp}
                  ref={i === accounts.length - 1 ? lastAccountElementRef : undefined}
                >
                  <Card className="border-purple-200 dark:border-purple-900 hover:border-purple-200 dark:hover:border-purple-800 transition-all shadow-soft hover:shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Última sincronização:{" "}
                            {account.lastSync ? new Date(account.lastSync).toLocaleString() : "Nunca"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            account.status === "connected"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {account.status === "connected" ? (
                            <>
                              <Check className="h-3 w-3" />
                              Conectado
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3" />
                              Desconectado
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Abrir</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => setAccountToDelete(account.id)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remover</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover conta</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover esta conta? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAccount(account.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isDeleting && accountToDelete === account.id ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Removendo...
                                    </>
                                  ) : (
                                    "Remover"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {isLoadingMore && (
                <Loading />
              )}
            </motion.div>
          ) : (
            <Card className="bg-muted/40 shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full blur-xl"></div>
                  <div className="relative bg-background border-2 border-muted p-6 rounded-full">
                    {activePlatform === "all" ? (
                      <Link2 className="h-14 w-14 text-muted-foreground" />
                    ) : (
                      getPlatformIcon(activePlatform)
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Nenhuma conta encontrada
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {debouncedSearchTerm
                      ? `Não encontramos nenhuma conta com o termo "${debouncedSearchTerm}"`
                      : activePlatform !== "all"
                        ? `Você ainda não conectou nenhuma conta do ${activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)}`
                        : "Você ainda não conectou nenhuma conta de rede social"}
                  </p>
                </div>

                <div className="mt-8">
                  <AddAccountDialog />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
