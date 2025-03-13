"use server"

// Simulação de banco de dados para armazenar as conexões do Notion
const notionConnections = new Map([
  [
    "notion1",
    {
      id: "notion1",
      notionToken: "secret_abc123",
      databaseId: "7a774b5c8c214f8a9d5e7c9b6a5b4c3d",
      databaseName: "Calendário de Conteúdo",
      createdAt: "2023-03-10T14:30:00Z",
      active: true,
      lastSync: "Hoje, 10:30",
      stats: {
        posts: 24,
        scheduled: 8,
      },
    },
  ],
  [
    "notion2",
    {
      id: "notion2",
      notionToken: "secret_def456",
      databaseId: "8b885c6d9d325f9b0e6f8d0c7b6c5d4e",
      databaseName: "Blog Posts",
      createdAt: "2023-03-05T09:15:00Z",
      active: true,
      lastSync: "Ontem, 15:45",
      stats: {
        posts: 12,
        scheduled: 3,
      },
    },
  ],
  [
    "notion3",
    {
      id: "notion3",
      notionToken: "secret_ghi789",
      databaseId: "9c996d7e0e436f0c1f7f9e1d8c7d6e5f",
      databaseName: "Campanhas de Marketing",
      createdAt: "2023-02-28T11:20:00Z",
      active: false,
      lastSync: "10/03/2023",
      stats: {
        posts: 6,
        scheduled: 0,
      },
    },
  ],
])

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
    active: true,
    lastSync: "Nunca",
    stats: {
      posts: 0,
      scheduled: 0,
    },
  })

  return {
    success: true,
    databaseId: connectionId,
  }
}

export async function getNotionConnections() {
  // Em um ambiente real, você buscaria as conexões do banco de dados
  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))
  return Array.from(notionConnections.values())
}

export async function getNotionConnection(id: string) {
  // Em um ambiente real, você buscaria a conexão do banco de dados
  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))
  return notionConnections.get(id) || null
}

export async function deleteNotionConnection(id: string) {
  // Em um ambiente real, você removeria a conexão do banco de dados
  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 800))
  notionConnections.delete(id)
  return { success: true }
}

export async function toggleNotionConnectionStatus(id: string) {
  // Em um ambiente real, você atualizaria o status da conexão no banco de dados
  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const connection = notionConnections.get(id)
  if (connection) {
    connection.active = !connection.active
    notionConnections.set(id, connection)
    return { success: true, active: connection.active }
  }

  return { success: false, error: "Conexão não encontrada" }
}

