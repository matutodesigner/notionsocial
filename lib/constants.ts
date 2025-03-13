export const APP_NAME = process.env.APP_NAME || "NotionSocial"

// Navigation items for dashboard
export const dashboardNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Bancos de Dados",
    href: "/dashboard/notion",
    icon: "Database",
  },
  {
    title: "Redes Sociais",
    href: "/dashboard/social",
    icon: "Instagram",
  },
  {
    title: "Publicações",
    href: "/dashboard/posts",
    icon: "FileText",
  },
]

// Quick action items for dashboard
export const quickActionItems = [
  {
    title: "Conectar Notion",
    href: "/dashboard/notion/connect",
    icon: "Plus",
  },
  {
    title: "Conectar Rede Social",
    href: "/dashboard/social/connect",
    icon: "Plus",
  },
]

