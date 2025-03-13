import { Search, Instagram, Facebook, TwitterIcon as TikTok } from "lucide-react"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

interface EmptyStateProps {
  platform?: string
  searchTerm?: string
}

export function EmptyState({ platform, searchTerm }: EmptyStateProps) {
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
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon>{icon}</EmptyPlaceholder.Icon>
      <EmptyPlaceholder.Title>{title}</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>{description}</EmptyPlaceholder.Description>
    </EmptyPlaceholder>
  )
}

