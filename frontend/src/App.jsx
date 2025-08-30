import { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl">ProdMail</h1>
        </div>
        <p className="text-muted-foreground">
          Analise seus e-mails e ganhe + produtividade
        </p>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Conteúdo do E-mail</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Cole o e-mail abaixo ou arraste o arquivo com e-mail para ser analisado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Textarea
              placeholder="Digite o e-mail que recebeu aqui..."
              className="resize-none h-40 "
            />
            <Button className="pt-5 ">Analise o E-mail</Button>
          </CardContent>
      </Card>
    </div>
  )
}

export default App