"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { connectNotionDatabase } from "./actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Database, Key, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConnectNotionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    notionToken: "",
    databaseId: "",
    databaseName: "",
  })
  const [validationStatus, setValidationStatus] = useState({
    notionToken: null as null | boolean,
    databaseId: null as null | boolean,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validação básica
    if (name === "notionToken") {
      setValidationStatus((prev) => ({
        ...prev,
        notionToken: value.startsWith("secret_") && value.length > 10,
      }))
    } else if (name === "databaseId") {
      setValidationStatus((prev) => ({
        ...prev,
        databaseId: value.length > 10,
      }))
    }
  }

  async function onSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await connectNotionDatabase(formData)

      if (result.success) {
        toast({
          title: "Banco de dados conectado com sucesso!",
          description: "Você será redirecionado para a página de configuração.",
        })
        router.push(`/dashboard/notion/configure/${result.databaseId}`)
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao conectar banco de dados",
          description: result.error,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao conectar banco de dados",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/notion">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Conectar Banco de Dados do Notion
        </h2>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="manual">Conexão Manual</TabsTrigger>
          <TabsTrigger value="template">Usar Template</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Conectar ao Notion</CardTitle>
                <CardDescription>
                  Conecte um banco de dados do Notion para monitorar e publicar conteúdo nas redes sociais
                </CardDescription>
              </CardHeader>
              <form action={onSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notionToken" className="flex items-center justify-between">
                      <span>Token de Integração do Notion</span>
                      {validationStatus.notionToken !== null && (
                        <span className="text-xs flex items-center gap-1">
                          {validationStatus.notionToken ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-green-600 dark:text-green-400">Válido</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                              <span className="text-red-600 dark:text-red-400">Formato inválido</span>
                            </>
                          )}
                        </span>
                      )}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="notionToken"
                        name="notionToken"
                        placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        required
                        value={formData.notionToken}
                        onChange={handleInputChange}
                        className={validationStatus.notionToken === false ? "border-red-300 dark:border-red-700" : ""}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Você pode obter seu token de integração nas{" "}
                      <a
                        href="https://www.notion.so/my-integrations"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        configurações de integração do Notion
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="databaseId" className="flex items-center justify-between">
                      <span>ID do Banco de Dados</span>
                      {validationStatus.databaseId !== null && (
                        <span className="text-xs flex items-center gap-1">
                          {validationStatus.databaseId ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-green-600 dark:text-green-400">Válido</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                              <span className="text-red-600 dark:text-red-400">Muito curto</span>
                            </>
                          )}
                        </span>
                      )}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="databaseId"
                        name="databaseId"
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        required
                        value={formData.databaseId}
                        onChange={handleInputChange}
                        className={validationStatus.databaseId === false ? "border-red-300 dark:border-red-700" : ""}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O ID do banco de dados está na URL quando você abre o banco de dados no Notion
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="databaseName">Nome do Banco de Dados</Label>
                    <Input
                      id="databaseName"
                      name="databaseName"
                      placeholder="Ex: Calendário de Conteúdo"
                      required
                      value={formData.databaseName}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        <span>Conectando...</span>
                      </div>
                    ) : (
                      "Conectar Banco de Dados"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="template">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Usar Template do Notion</CardTitle>
                <CardDescription>Comece rapidamente com nosso template pré-configurado para o Notion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src="/placeholder.svg?height=200&width=600&text=Template+do+Notion"
                    alt="Template do Notion"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Template de Calendário de Conteúdo</h3>
                  <p className="text-muted-foreground">
                    Este template inclui todas as colunas necessárias para começar a automatizar suas publicações nas
                    redes sociais:
                  </p>

                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <span className="font-medium">Status</span>
                        <p className="text-sm text-muted-foreground">Para controlar o fluxo de publicação</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <span className="font-medium">Conteúdo e Mídia</span>
                        <p className="text-sm text-muted-foreground">Para o texto e imagens das publicações</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <span className="font-medium">Plataforma e Data</span>
                        <p className="text-sm text-muted-foreground">Para definir onde e quando publicar</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full gap-2" onClick={() => window.open("https://notion.so", "_blank")}>
                  <Database className="h-4 w-4" />
                  Duplicar Template no Notion
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Após duplicar o template, volte aqui e conecte-o usando a opção "Conexão Manual"
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como configurar seu banco de dados do Notion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">1. Crie uma integração no Notion</h3>
            <p className="text-sm text-muted-foreground">
              Acesse a página de integrações do Notion e crie uma nova integração. Dê um nome como "NotionSocial" e
              selecione as permissões necessárias.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">2. Copie o token secreto</h3>
            <p className="text-sm text-muted-foreground">
              Após criar a integração, copie o token secreto e cole no campo acima.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">3. Compartilhe seu banco de dados com a integração</h3>
            <p className="text-sm text-muted-foreground">
              Abra seu banco de dados no Notion, clique em "Compartilhar" e adicione sua integração.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">4. Copie o ID do banco de dados</h3>
            <p className="text-sm text-muted-foreground">
              O ID do banco de dados está na URL quando você abre o banco de dados no Notion. Exemplo:
              https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

