"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simulação de banco de dados para usuários
const users = new Map([
  [
    "alissondesign0@gmail.com",
    {
      name: "Alisson Design",
      email: "alissondesign0@gmail.com",
      password: "ali96133",
    },
  ],
])

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validações
  if (!name || !email || !password || !confirmPassword) {
    return { success: false, error: "Todos os campos são obrigatórios" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "As senhas não coincidem" }
  }

  if (password.length < 6) {
    return { success: false, error: "A senha deve ter pelo menos 6 caracteres" }
  }

  // Verificar se o email já está em uso
  if (users.has(email)) {
    return { success: false, error: "Este email já está em uso" }
  }

  // Em um ambiente real, você deve criptografar a senha
  // Aqui estamos apenas simulando o registro
  users.set(email, { name, email, password })

  // Criar sessão
  const sessionId = Math.random().toString(36).substring(2)
  cookies().set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
  })

  // Aguardar um pouco para simular o processamento
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validações
  if (!email || !password) {
    return { success: false, error: "Email e senha são obrigatórios" }
  }

  // Verificar se o usuário existe
  const user = users.get(email)
  if (!user) {
    return { success: false, error: "Email ou senha incorretos" }
  }

  // Verificar se a senha está correta
  if (user.password !== password) {
    return { success: false, error: "Email ou senha incorretos" }
  }

  // Criar sessão
  const sessionId = Math.random().toString(36).substring(2)
  cookies().set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: "/",
  })

  // Aguardar um pouco para simular o processamento
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}

export async function logoutUser() {
  cookies().delete("session")
  redirect("/")
}

export async function checkAuth() {
  const session = cookies().get("session")
  return !!session
}

export async function getCurrentUser() {
  // Em um ambiente real, você buscaria o usuário pelo ID da sessão
  // Aqui estamos apenas simulando
  return {
    name: "Alisson Design",
    email: "alissondesign0@gmail.com",
    avatar: "/placeholder.svg?height=32&width=32&text=AD",
  }
}

