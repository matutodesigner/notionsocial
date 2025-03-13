import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@notionhq/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const databaseId = searchParams.get("databaseId")

  if (!databaseId) {
    return NextResponse.json({ error: "Database ID are required" }, { status: 400 })
  }

  try {
    // Get the workspace
    const database = await prisma.notionDatabase.findFirst({
      where: {
        id: databaseId,
        userId: session.user.id,
      },
      include: {
        workspace: true,
        config: true,
      }
    })

    if (!database) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Initialize Notion client
    const notion = new Client({ auth: database.workspace.accessToken })

    // Fetch database properties
    const databaseNotion = await notion.databases.retrieve({
      database_id: database.notionId,
    })

    // Format properties for response
    const properties = Object.entries(databaseNotion.properties).map(([key, value]) => ({
      id: value.id,
      name: key,
      type: value.type,
      options: value.type === 'select' ? value.select?.options : null
    }))

    return NextResponse.json({ database, properties })
  } catch (error) {
    console.error("Error fetching database properties:", error)
    return NextResponse.json({ error: "Failed to fetch database properties" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  // Verifica se o método da requisição é POST
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: "Método não permitido. Use POST." },
      { status: 405 } // 405 Method Not Allowed
    );
  }

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Recupera o `id` da query string (URL)
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
  }

  // Recupera o corpo da requisição
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  // Valida se o corpo é um objeto válido
  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "Corpo da requisição inválido ou vazio." }, { status: 400 });
  }

  try {
    // Atualiza o registro no banco de dados
    const save = await prisma.notionDatabaseConfig.update({
      where: {
        id: id, // Usa o `id` recuperado da query string
      },
      data: body, // Usa o corpo da requisição diretamente
    });

    // Retorna uma resposta de sucesso
    return NextResponse.json(
      { success: "Dados salvos com sucesso.", data: save },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao salvar dados:", error); // Log para depuração
    return NextResponse.json(
      { error: "Erro ao salvar dados.", details: error.message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}