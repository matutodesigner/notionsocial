"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Instagram, Facebook, TwitterIcon as TikTok, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { APP_NAME } from "@/lib/constants"

export function AddAccountDialog() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  const handleConnect = (platform: string) => {
    setIsConnecting(platform)
    window.location.href = `/api/social/auth?platform=${platform}`
  }

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500",
      description: "Conecte sua conta do Instagram para publicar fotos e vídeos automaticamente.",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-500",
      description: "Conecte sua página do Facebook para publicar atualizações, fotos e vídeos.",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: TikTok,
      color: "bg-black",
      description: "Conecte sua conta do TikTok para publicar vídeos curtos automaticamente.",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          
        >
          <Plus className="h-4 w-4" />
          Conectar Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Conectar Rede Social</DialogTitle>
          <DialogDescription>Escolha a plataforma que deseja conectar ao {APP_NAME}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {platforms.map((platform) => (
            <motion.div
              key={platform.id}
              className="p-4 rounded-lg border hover:border-primary cursor-pointer transition-all"
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${platform.color} text-white`}>
                    <platform.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">{platform.description}</p>
                  </div>
                </div>
                <Button
                  className="ml-auto"
                  variant="outline"
                  disabled={isConnecting === platform.id}
                  onClick={() => handleConnect(platform.id)}
                >
                  {isConnecting === platform.id ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    "Conectar"
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <p>
            Ao conectar uma conta, você autoriza o {APP_NAME} a publicar conteúdo em seu nome, de acordo com as regras
            configuradas em seu banco de dados do Notion.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

