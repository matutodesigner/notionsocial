"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Database,
  Instagram,
  Facebook,
  TwitterIcon as TikTok,
  Plus,
  Zap,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import { AddDatabaseDialog } from "@/components/database/add-database-dialog"

export default function DashboardPage() {
  // Dados simulados para o dashboard
  const stats = [
    {
      title: "Bancos de Dados Conectados",
      value: "3",
      icon: <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      change: "+1 hoje",
    },
    {
      title: "Publicações Agendadas",
      value: "12",
      icon: <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
      change: "+3 hoje",
    },
    {
      title: "Publicações Realizadas",
      value: "48",
      icon: <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />,
      change: "+5 hoje",
    },
  ]

  const recentPosts = [
    { id: 1, title: "Lançamento do Produto X", status: "Publicado", platform: "Instagram", date: "Hoje, 14:30" },
    { id: 2, title: "Promoção de Verão", status: "Agendado", platform: "Facebook", date: "Amanhã, 10:00" },
    { id: 3, title: "Tutorial de Uso", status: "Rascunho", platform: "TikTok", date: "23/03, 16:00" },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div className="space-y-8" initial="hidden" animate="visible" variants={staggerContainer}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div variants={fadeInUp}>
          <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">Bem-vindo ao seu painel de controle do {APP_NAME}</p>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <AddDatabaseDialog/>
        </motion.div>
      </div>

      <motion.div className="grid gap-4 md:grid-cols-3" variants={staggerContainer}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-purple-200 shadow-soft bg-gradient-card hover:shadow-md transition-all dark:border-purple-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{stat.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="border-purple-100 shadow-soft overflow-hidden dark:border-purple-900">
          <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 dark:border-purple-900 dark:bg-gradient-to-r dark:from-purple-950/50 dark:to-pink-950/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading">Publicações Recentes</CardTitle>
                <CardDescription>Gerencie suas publicações recentes e agendadas</CardDescription>
              </div>
              <Link href="/dashboard/posts">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/20"
                >
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <motion.div className="divide-y divide-purple-100 dark:divide-purple-900" variants={staggerContainer}>
              {recentPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  variants={fadeInUp}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 hover:bg-purple-50/30 transition-colors dark:hover:bg-purple-950/20"
                >
                  <div className="grid gap-1">
                    <div className="font-medium">{post.title}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {post.platform === "Instagram" && <Instagram className="h-4 w-4 text-pink-500" />}
                      {post.platform === "Facebook" && <Facebook className="h-4 w-4 text-purple-600" />}
                      {post.platform === "TikTok" && <TikTok className="h-4 w-4" />}
                      <span className="text-sm">{post.platform}</span>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        post.status === "Publicado"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : post.status === "Agendado"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {post.status}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/30"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-6 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -mb-20 -ml-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-heading font-bold">Descubra mais recursos</h3>
          </div>

          <p className="text-pink-100 mb-6 max-w-3xl">
            Aproveite ao máximo o {APP_NAME} conectando mais bancos de dados e configurando regras de publicação
            personalizadas.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button className="bg-white text-purple-600 hover:bg-pink-50">Explorar guias</Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
              Ver tutoriais
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

