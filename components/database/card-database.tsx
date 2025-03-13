import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Settings, Trash2, Database, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"

interface CardDatabaseProps {
  connection: {
    id: string
    name: string 
    notionId: string
    active: boolean
    lastSync: string | null
    stats: {
      posts: number
      configured: boolean
    }
    workspace: {
      name: string
      icon: string | null
    }
  }
  onDelete: (id: string) => void
  isDeleting: boolean
  databaseToDelete: string | null
  setDatabaseToDelete: (id: string | null) => void
}

export function CardDatabase({ connection, onDelete, isDeleting, databaseToDelete, setDatabaseToDelete }: CardDatabaseProps) {
  return (
    <Card className="h-full shadow-soft hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-none border-purple-200 dark:border-purple-800 group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge
            variant="outline"
            className={cn(
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium",
              !connection.active && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
            )}
          >
            {connection.active ? "Ativo" : "Inativo"}
          </Badge>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link href={`/dashboard/notion/configure/${connection.id}`} className="flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-200"
                  onClick={() => setDatabaseToDelete(connection.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir banco de dados</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a conexão com este banco de dados? Esta ação não pode
                    ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(connection.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting && databaseToDelete === connection.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Excluindo...
                      </>
                    ) : (
                      "Excluir"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-1">{connection.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Database className="h-3.5 w-3.5" />
          <span className="font-mono">{connection.notionId.substring(0, 8)}...</span>
          {connection.workspace && (
            <span className="text-muted-foreground">• {connection.workspace.name}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Publicações</span>
            <span className="text-sm font-medium">{connection.stats.posts || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Configurado</span>
            <span className="text-sm font-medium">{connection.stats.configured ? "Sim" : "Não"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Última sincronização: {connection.lastSync || "Nunca"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}