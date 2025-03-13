"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, Database, Eye, MoreHorizontal, ExternalLink, Trash } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PostType } from "../types"
import { getPlatformIcon, getStatusBadge } from "../utils"

interface PostsListProps {
  posts: PostType[]
  lastPostRef: (node: HTMLDivElement | null) => void
  onViewDetails: (post: PostType) => void
  onDelete: (postId: string) => void
}

export function PostsList({ posts, lastPostRef, onViewDetails, onDelete }: PostsListProps) {
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
                      {post.database.name}
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

