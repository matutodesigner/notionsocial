"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, Trash, Database } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
import type { PostType } from "../types"
import { getPlatformIcon, getStatusBadge } from "../utils"

interface PostDetailsDialogProps {
  post: PostType
  open: boolean
  onOpenChange: (open: boolean) => void
  handleDelete: (postId: string) => void
  isDeleting: boolean
}

export function PostDetailsDialog({ post, open, onOpenChange, handleDelete, isDeleting }: PostDetailsDialogProps) {
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
                {post.database.name}
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
                <AlertDialogAction onClick={() => handleDelete(post.id)} disabled={isDeleting}>
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

