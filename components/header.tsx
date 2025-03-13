"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { APP_NAME } from "@/lib/constants"
import type { Session } from "next-auth"

interface DashboardHeaderProps {
  user: Session["user"]
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <Link
            href="/dashboard"
            className="font-heading font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
            {APP_NAME}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <MobileNav user={user} />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}

