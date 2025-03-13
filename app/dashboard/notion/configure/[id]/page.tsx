"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, ArrowLeft, Database, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { saveNotionConfiguration, getNotionConnection, getNotionDatabaseSchema } from "./actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PropertyOption = {
  id: string;
  name: string;
  type: string;
}

export default function ConfigureNotionPage() {
  const router = useRouter()
  const params = useParams<{id: string}>()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingSchema, setIsLoadingSchema] = useState(false)
  const [connection, setConnection] = useState<any>(null)
  const [properties, setProperties] = useState<PropertyOption[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    statusColumn: "",
    statusValue: "",
    contentColumn: "",
    imageColumn: "",
    platformColumn: "",
    dateColumn: "",
    updateStatus: true,
    notifyOnPublish: true,
  })

  useEffect(() => {
    async function loadConnection() {
      try {
        const data = await getNotionConnection(params.id)
        if (data) {
          setConnection(data)
          if (data.config) {
            // If config exists, populate the form with existing values
            setFormData({
              statusColumn: data.config.statusColumn,
              statusValue: data.config.statusValue,
              contentColumn: data.config.contentColumn,
              imageColumn: data.config.imageColumn,
              platformColumn: data.config.platformColumn,
              dateColumn: data.config.dateColumn,
              updateStatus: data.config.updateStatus,
              notifyOnPublish: data.config.notifyOnPublish,
            })
          }
          
          // Load database schema
          loadDatabaseSchema(data.notionId, data.workspace.accessToken)
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao carregar conexão",
            description: "Conexão não encontrada",
          })
          router.push("/dashboard/notion")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar conexão",
          description: "Ocorreu um erro inesperado",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadConnection()
  }, [params.id, router, toast])

  async function loadDatabaseSchema(databaseId: string, accessToken: string) {
    setIsLoadingSchema(true)
    try {
      const schema = await getNotionDatabaseSchema(databaseId, accessToken)
      setProperties(schema.properties)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar esquema do banco de dados",
        description: "Não foi possível obter as propriedades do banco de dados",
      })
    } finally {
      setIsLoadingSchema(false)
    }
  }

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  async function onSubmit() {
    // Validate form
    const errors: Record<string, string> = {}
    
    if (!formData.statusColumn) errors.statusColumn = "Campo obrigatório"
    if (!formData.statusValue) errors.statusValue = "Campo obrigatório"
    if (!formData.contentColumn) errors.contentColumn = "Campo obrigatório"
    if (!formData.platformColumn) errors.platformColumn = "Campo obrigatório"
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast({
        variant: "destructive",
        title: "Formulário inválido",
        description: "Por favor, preencha todos os campos obrigatórios",
      })
      return
    }

    setIsSaving(true)

    try {
      const result = await saveNotionConfiguration(params.id, formData)

      if (result.success) {
        toast({
          title: "Configuração salva com sucesso!",
          description: "Sua integração está pronta para uso.",
        })
        router.push("/dashboard/notion")
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao salvar configuração",
          description: result.error,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configuração",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  function getPropertyTypeLabel(type: string) {
    switch (type) {
      case "select": return "Seleção"
      case "multi_select": return "Múltipla Seleção"
      case "rich_text": return "Texto"
      case "title": return "Título"
      case "date": return "Data"
      case "files": return "Arquivos"
      case "url": return "URL"
      default: return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  function filterPropertiesByType(types: string[]) {
    return properties.filter(prop => types.includes(prop.type))
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando configuração...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/notion">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Configurar Banco de Dados
        </h2>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Configurar {connection?.name}</CardTitle>
                <CardDescription>
                  Configure como o NotionSocial deve monitorar e publicar conteúdo do seu banco de dados
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <Database className="mr-1 h-3.5 w-3.5" />
                {connection?.workspace?.name}
              </Badge>
            </div>

            {!isLoadingSchema && properties.length === 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar propriedades</AlertTitle>
                <AlertDescription>
                  Não foi possível carregar as propriedades do banco de dados. Verifique se a integração com o Notion está funcionando corretamente.
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => loadDatabaseSchema(connection.notionId, connection.workspace.accessToken)}>
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statusColumn" className={cn(validationErrors.statusColumn && "text-destructive")}>
                    Coluna de Status*
                  </Label>
                  <Select 
                    name="statusColumn" 
                    value={formData.statusColumn} 
                    onValueChange={(value) => handleChange("statusColumn", value)}
                    disabled={isLoadingSchema || properties.length === 0}
                  >
                    <SelectTrigger className={cn(validationErrors.statusColumn && "border-destructive ring-destructive")}>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterPropertiesByType(["select", "status"]).map((prop) => (
                        <SelectItem key={prop.id} value={prop.name}>
                          <div className="flex items-center">
                            <span>{prop.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {getPropertyTypeLabel(prop.type)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Coluna que indica quando o conteúdo está pronto para publicação
                  </p>
                  {validationErrors.statusColumn && (
                    <p className="text-xs text-destructive">{validationErrors.statusColumn}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusValue" className={cn(validationErrors.statusValue && "text-destructive")}>
                    Valor para Publicação*
                  </Label>
                  <Input 
                    id="statusValue" 
                    name="statusValue" 
                    value={formData.statusValue}
                    onChange={(e) => handleChange("statusValue", e.target.value)}
                    placeholder="Ex: Pronto, Publicar, Aprovado"
                    className={cn(validationErrors.statusValue && "border-destructive ring-destructive")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Quando a coluna de status tiver este valor, o conteúdo será publicado
                  </p>
                  {validationErrors.statusValue && (
                    <p className="text-xs text-destructive">{validationErrors.statusValue}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentColumn" className={cn(validationErrors.contentColumn && "text-destructive")}>
                    Coluna de Conteúdo*
                  </Label>
                  <Select 
                    name="contentColumn" 
                    value={formData.contentColumn}
                    onValueChange={(value) => handleChange("contentColumn", value)}
                    disabled={isLoadingSchema || properties.length === 0}
                  >
                    <SelectTrigger className={cn(validationErrors.contentColumn && "border-destructive ring-destructive")}>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterPropertiesByType(["rich_text", "title", "url"]).map((prop) => (
                        <SelectItem key={prop.id} value={prop.name}>
                          <div className="flex items-center">
                            <span>{prop.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {getPropertyTypeLabel(prop.type)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Coluna que contém o texto a ser publicado</p>
                  {validationErrors.contentColumn && (
                    <p className="text-xs text-destructive">{validationErrors.contentColumn}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageColumn">
                    Coluna de Imagem <span className="text-muted-foreground">(opcional)</span>
                  </Label>
                  <Select 
                    name="imageColumn" 
                    value={formData.imageColumn}
                    onValueChange={(value) => handleChange("imageColumn", value)}
                    disabled={isLoadingSchema || properties.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {filterPropertiesByType(["files", "url"]).map((prop) => (
                        <SelectItem key={prop.id} value={prop.name}>
                          <div className="flex items-center">
                            <span>{prop.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {getPropertyTypeLabel(prop.type)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Coluna que contém a imagem a ser publicada</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformColumn" className={cn(validationErrors.platformColumn && "text-destructive")}>
                    Coluna de Plataforma*
                  </Label>
                  <Select 
                    name="platformColumn" 
                    value={formData.platformColumn}
                    onValueChange={(value) => handleChange("platformColumn", value)}
                    disabled={isLoadingSchema || properties.length === 0}
                  >
                    <SelectTrigger className={cn(validationErrors.platformColumn && "border-destructive ring-destructive")}>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterPropertiesByType(["select", "multi_select"]).map((prop) => (
                        <SelectItem key={prop.id} value={prop.name}>
                          <div className="flex items-center">
                            <span>{prop.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {getPropertyTypeLabel(prop.type)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Coluna que indica em qual plataforma o conteúdo deve ser publicado
                  </p>
                  {validationErrors.platformColumn && (
                    <p className="text-xs text-destructive">{validationErrors.platformColumn}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateColumn">
                    Coluna de Data <span className="text-muted-foreground">(opcional)</span>
                  </Label>
                  <Select 
                    name="dateColumn" 
                    value={formData.dateColumn}
                    onValueChange={(value) => handleChange("dateColumn", value)}
                    disabled={isLoadingSchema || properties.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {filterPropertiesByType(["date", "created_time", "last_edited_time"]).map((prop) => (
                        <SelectItem key={prop.id} value={prop.name}>
                          <div className="flex items-center">
                            <span>{prop.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {getPropertyTypeLabel(prop.type)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Coluna que indica quando o conteúdo deve ser publicado
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Configurações Adicionais</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="updateStatus">Atualizar Status após Publicação</Label>
                      <p className="text-xs text-muted-foreground">
                        Atualiza automaticamente o status no Notion após a publicação
                      </p>
                    </div>
                    <Switch 
                      id="updateStatus" 
                      checked={formData.updateStatus}
                      onCheckedChange={(checked) => handleChange("updateStatus", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnPublish">Notificar após Publicação</Label>
                      <p className="text-xs text-muted-foreground">
                        Envia uma notificação por email quando o conteúdo for publicado
                      </p>
                    </div>
                    <Switch 
                      id="notifyOnPublish" 
                      checked={formData.notifyOnPublish}
                      onCheckedChange={(checked) => handleChange("notifyOnPublish", checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/notion")}>
              Cancelar
            </Button>
            <Button onClick={onSubmit} disabled={isSaving || isLoadingSchema}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Configuração"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-4 items-center justify-center rounded-lg bg-gradient-to-r from-purple-100 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 p-6 shadow-sm"
      >
        <Sparkles className="h-10 w-10 text-primary" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">A publicação automática também requer contas sociais conectadas!</h3>
          <p className="text-muted-foreground">
            Vá para a seção de Redes Sociais no menu lateral para conectar e gerenciar suas contas sociais.
          </p>
        </div>
        <Link href="/dashboard/social">
          <Button>Gerenciar Contas</Button>
        </Link>
      </motion.div>
    </div>
  )
}
