import { Instagram, Facebook, TwitterIcon as TikTok, Check, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Get platform icon
export function getPlatformIcon(platform: string, className = "h-4 w-4") {
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
export function getStatusBadge(status: string) {
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

