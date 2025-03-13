"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

// Save user settings
export async function saveUserSettings(settings: {
  name: string
  email: string
  company?: string
  emailNotifications: boolean
  publishNotifications: boolean
  errorNotifications: boolean
  weeklyDigest: boolean
  twoFactorAuth: boolean
}) {
  try {
    const session = await auth()

    if (!session) {
      throw new Error("Unauthorized")
    }

    // Update user info
    await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        name: settings.name,
        // Add other fields as needed
      },
    })

    // In a real app, you would also update notification preferences
    // and other settings in relevant tables

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error saving user settings:", error)
    throw new Error("Failed to save settings")
  }
}

