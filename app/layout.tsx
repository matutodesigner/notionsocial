import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { APP_NAME } from "@/lib/constants"

// Definindo fontes
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: `${APP_NAME} - Automatize suas Redes Sociais com o Notion`,
  description: "Conecte seu Notion às redes sociais e automatize suas publicações no Instagram, Facebook e TikTok",
  keywords: ["notion", "social media", "automation", "instagram", "facebook", "tiktok"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

