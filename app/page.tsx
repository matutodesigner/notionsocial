"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Database,
  Instagram,
  Facebook,
  Sparkles,
  Check,
  Star,
  TwitterIcon,
  ChevronDown,
  Play,
  Pause,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { APP_NAME } from "@/lib/constants"

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const features = [
    {
      title: "Conecte seu Notion",
      description: "Integre qualquer banco de dados do Notion em minutos, sem código.",
      icon: Database,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      title: "Publique Automaticamente",
      description: "Quando seu conteúdo estiver pronto, ele será publicado automaticamente.",
      icon: Sparkles,
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
    },
    {
      title: "Múltiplas Redes Sociais",
      description: "Publique no Instagram, Facebook e TikTok com um único fluxo.",
      icon: Instagram,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
  ]

  const testimonials = [
    {
      quote: `O ${APP_NAME} revolucionou nosso fluxo de trabalho. Economizamos horas toda semana!`,
      author: "Ana Silva",
      role: "Marketing Manager",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote: "Finalmente posso gerenciar todo meu conteúdo em um só lugar. Melhor investimento que fiz este ano.",
      author: "Carlos Mendes",
      role: "Content Creator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote: "A integração com o Notion é perfeita. Exatamente o que eu precisava para minha agência.",
      author: "Juliana Costa",
      role: "Agency Owner",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const plans = [
    {
      name: "Starter",
      price: "R$49",
      description: "Perfeito para criadores de conteúdo individuais",
      features: [
        "1 banco de dados do Notion",
        "2 contas de redes sociais",
        "Até 30 publicações por mês",
        "Suporte por email",
      ],
      cta: "Começar Grátis",
      popular: false,
    },
    {
      name: "Pro",
      price: "R$99",
      description: "Ideal para profissionais e pequenas equipes",
      features: [
        "5 bancos de dados do Notion",
        "10 contas de redes sociais",
        "Publicações ilimitadas",
        "Analytics básico",
        "Suporte prioritário",
      ],
      cta: "Começar Agora",
      popular: true,
    },
    {
      name: "Business",
      price: "R$249",
      description: "Para agências e empresas",
      features: [
        "Bancos de dados ilimitados",
        "Contas ilimitadas",
        "Publicações ilimitadas",
        "Analytics avançado",
        "API acesso",
        "Gerente de sucesso dedicado",
      ],
      cta: "Falar com Vendas",
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "Como funciona a integração com o Notion?",
      answer:
        "Basta conectar sua conta do Notion, selecionar o banco de dados que deseja monitorar e configurar quais colunas representam o status, conteúdo e imagens. O NotionSocial fará o resto automaticamente.",
    },
    {
      question: "Quais redes sociais são suportadas?",
      answer:
        "Atualmente suportamos Instagram, Facebook e TikTok. Estamos trabalhando para adicionar LinkedIn, Twitter e Pinterest em breve.",
    },
    {
      question: "Posso agendar publicações para datas específicas?",
      answer:
        "Sim! Você pode definir uma coluna de data no seu banco de dados do Notion, e o NotionSocial respeitará essas datas para publicação.",
    },
    {
      question: "Como funciona o período de teste gratuito?",
      answer:
        "Oferecemos 14 dias de teste gratuito em todos os planos, sem necessidade de cartão de crédito. Você pode experimentar todos os recursos antes de decidir.",
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas ou penalidades.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Recursos
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Como Funciona
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Depoimentos
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Preços
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
              >
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-purple-950/20">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-4 w-fit">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Lançamento Especial - 30% OFF
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Do Notion para suas Redes Sociais em um clique
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Automatize suas publicações nas redes sociais diretamente do seu banco de dados do Notion. Sem
                    código, sem complicação.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="gap-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                    >
                      Começar Agora
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="group" onClick={toggleVideo}>
                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      {isVideoPlaying ? (
                        <Pause className="h-3 w-3 text-primary" />
                      ) : (
                        <Play className="h-3 w-3 text-primary" />
                      )}
                    </span>
                    Ver Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Avatar key={i} className="border-2 border-background">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">500+</span> profissionais já estão usando
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="mx-auto lg:mr-0 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm z-10 opacity-50" />
                  <video
                    ref={videoRef}
                    className="w-full aspect-video object-cover rounded-xl"
                    poster="/placeholder.svg?height=600&width=800&text=NotionSocial+Demo"
                    onEnded={() => setIsVideoPlaying(false)}
                    muted
                    loop
                  >
                    <source src="https://example.com/demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {!isVideoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <Button
                        onClick={toggleVideo}
                        size="lg"
                        className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-primary"
                      >
                        <Play className="h-6 w-6 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-4 shadow-lg z-20">
                  <div className="flex items-center gap-2 text-white">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">Economize 10h por semana</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-medium mb-6">Confiado por empresas de todos os tamanhos</h2>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
                  {["Company A", "Company B", "Company C", "Company D", "Company E"].map((company, i) => (
                    <div key={i} className="text-2xl font-bold text-muted-foreground">
                      {company}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <Link href="#features">
                <Button variant="ghost" size="icon" className="rounded-full animate-bounce">
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Recursos
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tudo que você precisa para{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  automatizar
                </span>{" "}
                suas publicações
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Conecte seu Notion, configure uma vez e nunca mais se preocupe com publicações manuais.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-lg border bg-background p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className={cn("inline-flex rounded-lg p-3 mb-4", feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Economize tempo", value: "10h+", unit: "por semana" },
                { title: "Aumente seu alcance", value: "3x", unit: "mais engajamento" },
                { title: "Clientes satisfeitos", value: "98%", unit: "taxa de retenção" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="rounded-lg border bg-background p-6 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-muted-foreground mb-2">{stat.title}</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.unit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950"
          ref={targetRef}
        >
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Como Funciona
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Três passos simples para automatizar suas publicações
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Comece a publicar automaticamente em minutos, não em dias.
              </p>
            </div>

            <motion.div className="relative mt-16" style={{ opacity, scale }}>
              <div className="absolute top-0 left-1/2 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-purple-500 to-blue-500" />

              {[
                {
                  step: "01",
                  title: "Conecte seu banco de dados do Notion",
                  description:
                    "Integre qualquer banco de dados do Notion em poucos cliques. Não é necessário conhecimento técnico.",
                  image: "/placeholder.svg?height=300&width=500&text=Conectar+Notion",
                },
                {
                  step: "02",
                  title: "Configure suas preferências",
                  description:
                    "Defina quais colunas representam o status, conteúdo e imagens. Configure regras para cada rede social.",
                  image: "/placeholder.svg?height=300&width=500&text=Configurar+Preferências",
                },
                {
                  step: "03",
                  title: "Publique automaticamente",
                  description:
                    "Quando seu conteúdo estiver pronto no Notion, ele será publicado automaticamente nas redes sociais configuradas.",
                  image: "/placeholder.svg?height=300&width=500&text=Publicar+Automaticamente",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`relative grid gap-8 items-center mb-12 ${i % 2 === 0 ? "md:grid-cols-[1fr_2fr]" : "md:grid-cols-[2fr_1fr]"}`}
                >
                  <div className={`relative z-10 ${i % 2 !== 0 && "md:order-2"}`}>
                    <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white mb-4">
                      <span className="text-xl font-bold">{item.step}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  <div className={`relative z-10 ${i % 2 !== 0 && "md:order-1"}`}>
                    <div className="rounded-lg overflow-hidden shadow-lg border">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={500}
                        height={300}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border-4 border-purple-500 z-20" />
                </div>
              ))}
            </motion.div>

            <div className="mt-16 text-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="gap-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                >
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Depoimentos
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                O que nossos clientes estão dizendo
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Junte-se a centenas de profissionais que já transformaram seu fluxo de trabalho.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  className="rounded-lg border bg-background p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 rounded-lg border bg-background p-8">
              <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-center">
                <div>
                  <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">
                    Caso de Sucesso
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Como a Empresa X aumentou seu alcance em 300%</h3>
                  <p className="text-muted-foreground mb-4">
                    Descubra como uma agência de marketing conseguiu triplicar seu alcance nas redes sociais e
                    economizar 15 horas por semana.
                  </p>
                  <Link href="#">
                    <Button variant="outline">Ler Caso Completo</Button>
                  </Link>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=600&text=Caso+de+Sucesso"
                    alt="Caso de Sucesso"
                    width={600}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-20 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950"
        >
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Preços
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Planos para todos os tamanhos de negócio
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Comece gratuitamente e escale conforme seu negócio cresce.
              </p>
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Mensal</span>
                  <Switch id="billing-toggle" />
                  <span className="text-sm font-medium">Anual</span>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                  >
                    Economize 20%
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "rounded-lg border bg-background p-6 relative",
                    plan.popular && "border-purple-500 shadow-lg",
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600">
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className="block">
                    <Button
                      className={cn(
                        "w-full",
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                          : "bg-primary",
                      )}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h3 className="text-xl font-bold mb-4">Tem dúvidas sobre qual plano escolher?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nossa equipe está pronta para ajudar você a encontrar a solução perfeita para o seu negócio.
              </p>
              <Button variant="outline" size="lg">
                Falar com um Especialista
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Perguntas Frequentes
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Respostas para suas dúvidas
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Tudo que você precisa saber para começar a usar o NotionSocial.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  className="rounded-lg border bg-background p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Ainda tem dúvidas?</p>
              <Button variant="outline">Entre em Contato</Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Pronto para automatizar suas publicações?
                </h2>
                <p className="text-white/80 text-xl mb-6">
                  Junte-se a centenas de profissionais que já estão economizando tempo e aumentando seu alcance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                      Começar Agora
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Agendar Demo
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg" />
                <div className="relative bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Inscreva-se para receber novidades</h3>
                  <p className="text-white/80 mb-4">
                    Fique por dentro das novidades, dicas e recursos do NotionSocial.
                  </p>
                  <form className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="seu@email.com"
                        type="email"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-white/90">
                      Inscrever-se
                    </Button>
                  </form>
                  <p className="text-xs text-white/60 mt-4">
                    Ao se inscrever, você concorda com nossos Termos de Serviço e Política de Privacidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  NotionSocial
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                Automatize suas publicações nas redes sociais diretamente do seu banco de dados do Notion.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <TwitterIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Integrações
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Termos de Serviço
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} NotionSocial. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

