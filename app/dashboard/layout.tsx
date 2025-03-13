import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardHeader } from "@/components/header"
import { DashboardSidebar } from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <DashboardHeader user={session.user} />
      <div className="container flex-1 items-start pt-6 md:grid md:grid-cols-[240px_1fr] md:gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
        <DashboardSidebar />
        <main className="flex w-full flex-col  py-6">{children}</main>
      </div>
    </div>
  )
}
