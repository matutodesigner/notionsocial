'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import GoogleIcon from '@/images/icone-google.svg'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { getUrl } from '@/lib/utils'
import { useState } from 'react'
import { Calendar, Database, Instagram, Loader2, Star, Users } from 'lucide-react'
import {motion} from "framer-motion"

export default function SignIn() {
  const [pending, setPending] = useState(false)

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-white via-blue-100 to-purple-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="mx-auto container max-w-6xl flex items-center">
        <div className="flex-1  flex items-center">
          <div className="max-w-[500px]">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200 text-balance"
          >
            Transforme seu <span className="inline-block bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded">conteúdo</span> em posts <span className="inline-block bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded">incríveis</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 text-balance mx-auto text-xl"
          >
            <span className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-purple-600" />
              Gerencie todo seu conteúdo em um só lugar.
            </span>
            <span className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Agende suas postagens com antecedência.
            </span>
            <span className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-purple-600" />
              Publique de forma profissional e automatizada.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex gap-4"
          >
            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">+1000 usuários</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">4.9/5 avaliação</span>
            </div>
          </motion.div>

          
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="flex m-0 max-w-[400px] shadow-none rounded-lg border-0 bg-white/80 dark:bg-slate-900/80 p-8 items-center">
            <CardContent className="flex flex-col items-center p-6 text-center">
              
              <h2 className="mb-8 text-balance text-3xl font-bold">
                Conecte-se
              </h2>
              <p className="mb-8 text-balance text-muted-foreground">
                Automatize suas postagens do Instagram direto do Notion de forma simples e profissional.
              </p>

              <Button
                onClick={() => {
                  setPending(true)
                  signIn('google', { callbackUrl: getUrl('dashboard') })
                }}
                disabled={pending}
                className="w-full gap-2"
                variant={'outline'}
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Image src={GoogleIcon} width={14} height={14} alt="" />
                    Entrar com Google
                  </>
                )}
              </Button>
              <p className="mt-8 text-xs text-muted-foreground">
                Ao entrar você concorda com nossos{' '}
                <a href="#" className="text-violet-500 hover:underline">
                  termos de uso.
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
