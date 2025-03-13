"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { dashboardNavItems, quickActionItems } from "@/lib/constants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import * as Icons from "lucide-react"
import type { Session } from "next-auth"

type MobileNavProps = {
  user: Session["user"]
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleNav = () => setIsOpen(!isOpen)
  const closeNav = () => setIsOpen(false)

  // Dynamic icon component resolver
  const IconComponent = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons]
    return Icon || Icons.Circle
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleNav} className="text-gray-500 dark:text-gray-400">
        <Menu className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={closeNav}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-screen w-3/4 max-w-sm bg-white dark:bg-gray-950 shadow-lg"
            >
              <div className="flex h-16 items-center border-b px-4 dark:border-gray-800">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-9 w-9 border border-purple-100 dark:border-purple-800">
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeNav} className="absolute right-4 top-4">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">Menu</h3>
                  <div className="space-y-1">
                    {dashboardNavItems.map((item, index) => {
                      const Icon = IconComponent(item.icon)
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                      return (
                        <Link key={index} href={item.href} onClick={closeNav}>
                          <div
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 dark:bg-gradient-to-r dark:from-purple-950/50 dark:to-pink-950/50 dark:text-purple-300"
                                : "hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400",
                              )}
                            />
                            {item.title}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">Ações Rápidas</h3>
                  <div className="space-y-1">
                    {quickActionItems.map((item, index) => {
                      const Icon = IconComponent(item.icon)
                      return (
                        <Link key={index} href={item.href} onClick={closeNav}>
                          <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300">
                            <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            {item.title}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">Suporte</h3>
                  <div className="space-y-1">
                    <Link href="/dashboard/help" onClick={closeNav}>
                      <div className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300">
                        <Icons.HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        Ajuda
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-gray-800">
                  <button
                    className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/20 dark:hover:text-purple-300"
                    onClick={() => signOut()}
                  >
                    <Icons.LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    Sair
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

