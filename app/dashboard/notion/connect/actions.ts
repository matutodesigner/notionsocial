"use server"

// Simulação de banco de dados para armazenar as conexões do Notion
const notionConnections = new Map()

export async function connectNotionDatabase(formData: FormData) {
  const notionToken = formData.get("notionToken") as string
  const databaseId = formData.get("databaseId") as string
  const databaseName = formData.get("databaseName") as string

  // Validações
  if (!notionToken || !databaseId || !databaseName) {
    return { success: false, error: "Todos os campos são obrigatórios" }
  }

  if (!notionToken.startsWith("secret_")) {
    return { success: false, error: "Token de integração inválido" }
  }

  // Em um ambiente real, você faria uma chamada para a API do Notion
  // para verificar se o token e o ID do banco de dados são válidos

  // Simulando uma verificação
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Armazenar a conexão
  const connectionId = Math.random().toString(36).substring(2)
  notionConnections.set(connectionId, {
    id: connectionId,
    notionToken,
    databaseId,
    databaseName,
    createdAt: new Date().toISOString(),
  })

  return {
    success: true,
    databaseId: connectionId,
  }
}

export async function getNotionConnections() {
  // Em um ambiente real, você buscaria as conexões do banco de dados
  return Array.from(notionConnections.values())
}

export async function getNotionConnection(id: string) {
  // Em um ambiente real, você buscaria a conexão do banco de dados
  return notionConnections.get(id) || null
}

