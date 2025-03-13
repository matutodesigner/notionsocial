"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { dashboardNavItems, quickActionItems } from "@/lib/constants"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"
import { RequestAppeal } from "./request-appeal"

export function DashboardSidebar() {
  const pathname = usePathname()

  // Dynamic icon component resolver
  const IconComponent = (iconName: string): LucideIcon => {
    const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon
    return Icon || Icons.Circle
  }

  return (
    <div className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
      <div className="flex h-full flex-col gap-8 py-6">
        {/* Menu Principal */}
        <div className="mx-4">
          <nav className="grid gap-1.5">
            {dashboardNavItems.map((item, index) => {
              const Icon = IconComponent(item.icon)
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link key={index} href={item.href} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-0 h-full w-1 rounded-r-lg bg-gradient-to-b from-purple-600 to-pink-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-4 rounded-lg px-4 py-3 transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 font-medium text-purple-800 dark:from-purple-950/50 dark:to-pink-950/50 dark:text-purple-200"
                        : "hover:bg-purple-50/70 hover:text-purple-700 dark:hover:bg-purple-950/30 dark:hover:text-purple-200"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-purple-700 dark:text-purple-300" : "text-slate-400 dark:text-slate-600"
                      )}
                    />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Ações Rápidas */}
        <div className=" mx-4 pt-4 border-t">
          
          <nav className="grid gap-1.5">
            {quickActionItems.map((item, index) => {
              const Icon = IconComponent(item.icon)
              return (
                <Link key={index} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 rounded-lg px-4 py-3 transition-all duration-200 hover:bg-purple-50/70 hover:text-purple-700 dark:hover:bg-purple-950/30 dark:hover:text-purple-200"
                  >
                    <Icon className="h-5 w-5 text-slate-400 dark:text-slate-600" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Suporte - Fixado na parte inferior */}
        <div className=" mx-4 pt-4 border-t">
          <nav className="grid gap-1.5">
            
            <RequestAppeal />

            <Link href="/dashboard/help">
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 rounded-lg px-4 py-3 transition-all duration-200 hover:bg-purple-50/70 hover:text-purple-700 dark:hover:bg-purple-950/30 dark:hover:text-purple-200"
              >
                <Icons.HelpCircle className="h-5 w-5 text-slate-400 dark:text-slate-600" />
                Ajuda
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
