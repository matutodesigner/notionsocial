import { Client } from "@notionhq/client"


export const DEFAULT_DATABASE_CONFIG = {
  statusColumn: "Status",
  statusValue: "⏳ Aguardando",
  contentColumn: "Descrição",
  imageColumn: "Midia",
  platformColumn: "Status",
  dateColumn: "Publicar em",
  updateStatus: true,
  notifyOnPublish: true,
  platformConfigs: {
    create: [
      {
        platform: "instagram",
        enabled: false
      },
      {
        platform: "facebook", 
        enabled: false
      },
      {
        platform: "tiktok",
        enabled: false
      }
    ]
  }
}


export const NotionSetting = async (id: string, token: string) => {
  try {
    const notion = new Client({
      auth: token,
    })

    const response = await notion.databases.retrieve({
      database_id: id,
    })

    const properties = response.properties

    // Verifica outros campos
    const hasMedia = Object.values(properties).some(
      (property: any) => property.name === 'Midia',
    )
    const hasDescription = Object.values(properties).some(
      (property: any) => property.name === 'Descrição', 
    )
    const hasPublishDate = Object.values(properties).some(
      (property: any) => property.name === 'Publicar em',
    )

    await NotionCreateStatus(id, token)

    if (!hasMedia) {
      await NotionCreateMedia(id, token)
    }

    if (!hasDescription) {
      await NotionCreateDescription(id, token)
    }

    if (!hasPublishDate) {
      await NotionCreatePublishDate(id, token)
    }

    return {
      hasStatus: true,
      hasMedia,
      hasDescription,
      hasPublishDate,
    }
  } catch {
    console.error(error)
    throw new Error('Falha na configuração do banco de dados')
  }
}

const NotionCreateStatus = async (id: string, token: string) => {
  try {
    const notion = new Client({
      auth: token,
    })

    const database = await notion.databases.retrieve({
      database_id: id,
    })

    const hasStatus = Object.values(database.properties).some(
      (property: any) => property.name === 'Status',
    )

    let response
    if (hasStatus) {
      // Encontra o campo Status existente e suas opções atuais
      const statusProperty = Object.values(database.properties).find(
        (property: any) => property.name === 'Status',
      ) as any

      interface SelectOption {
        name: string
        color: string
      }

      const existingOptions = (statusProperty?.select?.options ||
        []) as SelectOption[]

      // Novas opções que queremos adicionar
      const newOptions: SelectOption[] = [
        {
          name: '⏳ Aguardando',
          color: 'blue',
        },
        {
          name: '📅 Agendado',
          color: 'yellow',
        },
        {
          name: '✅ Publicado',
          color: 'green',
        },
      ]

      // Combina as opções existentes com as novas, evitando duplicatas
      const combinedOptions = [...existingOptions]

      newOptions.forEach((newOption) => {
        if (
          !existingOptions.some(
            (existing: SelectOption) => existing.name === newOption.name,
          )
        ) {
          combinedOptions.push(newOption)
        }
      })

      response = await notion.databases.update({
        database_id: id,
        properties: {
          ...database.properties,
          Status: {
            type: 'select',
            select: {
              options: combinedOptions,
            },
          },
        },
      })
    } else {
      // Se não existe o campo Status, cria com as opções padrão
      response = await notion.databases.update({
        database_id: id,
        properties: {
          ...database.properties,
          Status: {
            type: 'select',
            select: {
              options: [
                {
                  name: '⏳ Aguardando',
                  color: 'blue',
                },
                {
                  name: '📅 Agendado',
                  color: 'yellow',
                },
                {
                  name: '✅ Publicado',
                  color: 'green',
                },
              ],
            },
          },
        },
      })
    }

    return response
  } catch {
    throw new Error('Falha ao criar campo de status no banco de dados')
  }
}

const NotionCreateMedia = async (id: string, token: string) => {
  try {
    const notion = new Client({
      auth: token,
    })

    const response = await notion.databases.update({
      database_id: id,
      properties: {
        Midia: {
          type: 'files',
          files: {},
        },
      },
    })

    return response
  } catch {
    throw new Error('Falha ao criar campo de mídia no banco de dados')
  }
}

const NotionCreateDescription = async (id: string, token: string) => {
  try {
    const notion = new Client({
      auth: token,
    })

    const response = await notion.databases.update({
      database_id: id,
      properties: {
        Descrição: {
          type: 'rich_text',
          rich_text: {},
        },
      },
    })

    return response
  } catch {
    throw new Error('Falha ao criar campo de descrição no banco de dados')
  }
}

const NotionCreatePublishDate = async (id: string, token: string) => {
  try {
    const notion = new Client({
      auth: token,
    })

    const response = await notion.databases.update({
      database_id: id,
      properties: {
        'Publicar em': {
          type: 'date',
          date: {},
        },
      },
    })

    return response
  } catch {
    throw new Error(
      'Falha ao criar campo de data de publicação no banco de dados',
    )
  }
}
