'use client'
import { MessageCircleWarning } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog,DialogDescription, DialogTitle, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,  
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
const formSchema = z.object({
  username: z.string().min(2).max(50),
})


export function RequestAppeal(){
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    console.log(values)
    
  }

  return (
      
            <Dialog>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <DialogTrigger asChild>
      <Button 
              variant={'ghost'}
              className="w-full justify-start gap-4  rounded-lg px-4 py-3 transition-all duration-200 hover:bg-purple-50/70 hover:text-purple-700 dark:hover:bg-purple-950/30 dark:hover:text-purple-200"
              >
               <MessageCircleWarning className="h-5 w-5 text-slate-400 dark:text-slate-600"/> Solicitar Recurso
            </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Solicitar Recurso</DialogTitle>
          <DialogDescription>
            Solicite o recurso que você sente falta em nossa plataforma.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        
        <FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormControl>
      <Textarea rows={7} {...field} placeholder="Descreva o recurso que você quer." />
      </FormControl>
      <FormMessage />
    </FormItem>
    
  )}
/>

          
        </div>
        <DialogFooter>
          <Button type="submit">Solicitar</Button>
        </DialogFooter>
      </DialogContent>
      </form>
    </Form>
    </Dialog>
  )
}