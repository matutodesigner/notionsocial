"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { LayoutDashboard, Database, Instagram, FileText, Settings, HelpCircle, Plus } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Bancos de Dados",
      href: "/dashboard/notion",
      icon: Database,
    },
    {
      title: "Redes Sociais",
      href: "/dashboard/social",
      icon: Instagram,
    },
    {
      title: "Publicações",
      href: "/dashboard/posts",
      icon: FileText,
    },
    {
      title: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex flex-col h-full space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Menu</h2>
          <div className="grid gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link key={index} href={item.href} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-0 h-full w-1 rounded-r-sm bg-gradient-to-b from-purple-500 to-blue-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 transition-all",
                      isActive
                        ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 font-medium dark:bg-gradient-to-r dark:from-purple-950/50 dark:to-blue-950/50 dark:text-purple-300"
                        : "hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400",
                      )}
                    />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="space-y-1">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Ações Rápidas</h2>
          <div className="grid gap-1">
            <Link href="/dashboard/notion/connect">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300"
              >
                <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                Conectar Notion
              </Button>
            </Link>
            <Link href="/dashboard/social/connect">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300"
              >
                <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                Conectar Rede Social
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-auto px-3 py-2">
        <div className="space-y-1">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Suporte</h2>
          <div className="grid gap-1">
            <Link href="/dashboard/help">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300"
              >
                <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                Ajuda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

