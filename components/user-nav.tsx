"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, HelpCircle, LogOut, Bell, Moon, Sun, Laptop, BellRing } from "lucide-react"
import type { Session } from "next-auth"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import { saveUserSettings } from "@/app/dashboard/settings/actions"

type UserNavProps = {
  user: Session["user"]
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnreadNotifications] = useState(true)
  const [settingsDialog, setSettingsDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [settings, setSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "",
    emailNotifications: true,
    publishNotifications: true,
    errorNotifications: true,
    weeklyDigest: true,
    twoFactorAuth: false,
    language: "pt-BR",
  })

  const handleSettingsChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      await saveUserSettings(settings)
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso.",
      })
      setSettingsDialog(false)
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações",
        description: "Ocorreu um erro ao salvar suas configurações.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-500 hover:text-purple-600 transition-colors dark:text-gray-400 dark:hover:text-purple-400"
        onClick={() => router.push("/dashboard/notifications")}
      >
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500" />}
      </Button>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden">
            <Avatar className="h-9 w-9 border border-purple-100 dark:border-purple-800">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {user?.name
                  ? user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <AnimatePresence>
          {isOpen && (
            <DropdownMenuContent forceMount align="end" className="w-60 p-0" asChild>
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="shadow-md rounded-lg overflow-hidden border border-purple-100 bg-white dark:bg-gray-950 dark:border-purple-800"
              >
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-purple-100 dark:border-purple-800">
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {user?.name
                          ? user?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <DropdownMenuGroup className="py-1">
                  <DropdownMenuItem
                    className="px-4 py-2.5 focus:bg-purple-50 cursor-pointer dark:focus:bg-purple-950/20"
                    onSelect={() => {
                      setSettingsDialog(true)
                      setIsOpen(false)
                    }}
                  >
                    <User className="mr-3 h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span>Perfil</span>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="px-4 py-2.5 focus:bg-purple-50 cursor-pointer dark:focus:bg-purple-950/20">
                      <Settings className="mr-3 h-4 w-4 text-purple-500 dark:text-purple-400" />
                      <span>Aparência</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="min-w-[180px] mr-1">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Claro</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Escuro</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          <Laptop className="mr-2 h-4 w-4" />
                          <span>Sistema</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="px-4 py-2.5 focus:bg-purple-50 cursor-pointer dark:focus:bg-purple-950/20">
                      <BellRing className="mr-3 h-4 w-4 text-purple-500 dark:text-purple-400" />
                      <span>Notificações</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="min-w-[220px] mr-1">
                        <DropdownMenuLabel>Preferências</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          <div className="flex items-center justify-between my-1">
                            <Label htmlFor="notif-email" className="text-xs flex-1 cursor-pointer">
                              Email
                            </Label>
                            <Switch
                              id="notif-email"
                              checked={settings.emailNotifications}
                              onCheckedChange={(checked) => handleSettingsChange("emailNotifications", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between my-1">
                            <Label htmlFor="notif-publish" className="text-xs flex-1 cursor-pointer">
                              Publicações
                            </Label>
                            <Switch
                              id="notif-publish"
                              checked={settings.publishNotifications}
                              onCheckedChange={(checked) => handleSettingsChange("publishNotifications", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between my-1">
                            <Label htmlFor="notif-error" className="text-xs flex-1 cursor-pointer">
                              Erros
                            </Label>
                            <Switch
                              id="notif-error"
                              checked={settings.errorNotifications}
                              onCheckedChange={(checked) => handleSettingsChange("errorNotifications", checked)}
                            />
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => router.push("/dashboard/notifications")}>
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Ver todas</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  

                  <DropdownMenuItem className="px-4 py-2.5 focus:bg-purple-50 cursor-pointer dark:focus:bg-purple-950/20">
                    <HelpCircle className="mr-3 h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span>Ajuda</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-purple-100 dark:bg-purple-800" />

                <DropdownMenuItem
                  asChild
                  className="px-4 py-2.5 focus:bg-purple-50 cursor-pointer dark:focus:bg-purple-950/20"
                >
                  <button className="flex w-full items-center" onClick={() => signOut()}>
                    <LogOut className="mr-3 h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span>Sair</span>
                  </button>
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>

      {/* Settings Dialog */}
      <Dialog open={settingsDialog} onOpenChange={setSettingsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configurações de Perfil</DialogTitle>
            <DialogDescription>Atualize suas informações pessoais e preferências</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={settings.name} onChange={(e) => handleSettingsChange("name", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingsChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={settings.company}
                  onChange={(e) => handleSettingsChange("company", e.target.value)}
                />
              </div>

            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notificações por Email</Label>
                    <p className="text-xs text-muted-foreground">
                      Receba notificações por email sobre atualizações importantes
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingsChange("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publishNotifications">Publicações realizadas</Label>
                    <Switch
                      id="publishNotifications"
                      checked={settings.publishNotifications}
                      onCheckedChange={(checked) => handleSettingsChange("publishNotifications", checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receba notificações quando uma publicação for realizada com sucesso
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="errorNotifications">Erros de publicação</Label>
                    <Switch
                      id="errorNotifications"
                      checked={settings.errorNotifications}
                      onCheckedChange={(checked) => handleSettingsChange("errorNotifications", checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receba notificações quando ocorrer um erro ao publicar conteúdo
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weeklyDigest">Resumo semanal</Label>
                    <Switch
                      id="weeklyDigest"
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => handleSettingsChange("weeklyDigest", checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receba um resumo semanal das suas publicações e desempenho
                  </p>
                </div>
              </div>
            </TabsContent>

          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={saveSettings} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

