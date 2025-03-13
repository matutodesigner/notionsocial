"use server"

import { prisma } from "@/lib/prisma"
import { Client } from "@notionhq/client"
import { revalidatePath } from "next/cache"

// Get Notion database connection
export async function getNotionConnection(id: string) {
  try {
    // In a real app, you'd check user authorization here
    
    // Get database with its configuration and workspace
    const database = await prisma.notionDatabase.findUnique({
      where: { id },
      include: {
        workspace: true,
        config: true,
      }
    })
    
    if (!database) {
      return null
    }
    
    return database
  } catch (error) {
    console.error("Error fetching Notion connection:", error)
    throw new Error("Failed to fetch Notion connection")
  }
}

// Get Notion database schema
export async function getNotionDatabaseSchema(databaseId: string, accessToken: string) {
  try {
    const notion = new Client({ auth: accessToken })
    
    // Fetch database properties
    const response = await notion.databases.retrieve({
      database_id: databaseId
    })
    
    const properties = Object.entries(response.properties).map(([name, property]) => ({
      id: property.id,
      name,
      type: property.type,
    }))
    
    return { properties }
    
  } catch (error) {
    console.error("Error fetching Notion database schema:", error)
    throw new Error("Failed to fetch database schema")
  }
}

// Save Notion database configuration
export async function saveNotionConfiguration(databaseId: string, data: any) {
  try {
    // In a real app, you'd check user authorization here
    
    // Check if config already exists
    const existingConfig = await prisma.notionDatabaseConfig.findUnique({
      where: { databaseId },
    })
    
    if (existingConfig) {
      // Update existing config
      await prisma.notionDatabaseConfig.update({
        where: { id: existingConfig.id },
        data: {
          statusColumn: data.statusColumn,
          statusValue: data.statusValue,
          contentColumn: data.contentColumn,
          imageColumn: data.imageColumn || null,
          platformColumn: data.platformColumn,
          dateColumn: data.dateColumn || null,
          updateStatus: data.updateStatus,
          notifyOnPublish: data.notifyOnPublish,
        }
      })
    } else {
      // Create new config
      await prisma.notionDatabaseConfig.create({
        data: {
          databaseId,
          statusColumn: data.statusColumn,
          statusValue: data.statusValue,
          contentColumn: data.contentColumn,
          imageColumn: data.imageColumn || null,
          platformColumn: data.platformColumn,
          dateColumn: data.dateColumn || null,
          updateStatus: data.updateStatus,
          notifyOnPublish: data.notifyOnPublish,
        }
      })
    }
    
    // Update database status and last modified date
    await prisma.notionDatabase.update({
      where: { id: databaseId },
      data: {
        active: true,
        updatedAt: new Date(),
      }
    })
    
    // Revalidate related paths
    revalidatePath(`/dashboard/notion`)
    revalidatePath(`/dashboard/notion/configure/${databaseId}`)
    
    return { success: true }
    
  } catch (error) {
    console.error("Error saving Notion configuration:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }
  }
}
