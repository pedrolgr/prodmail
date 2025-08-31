import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, CircleX, CircleCheckBig } from "lucide-react"

export default function App() {
  const [emailText, setEmailText] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const isDisabled = loading || emailText.trim() === "";

  const handleSubmit = async () => {

    setLoading(true);

    if (emailText.trim() !== "") {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL, {
          email: emailText,
        });

        setLoading(true)
        setResponseData(response.data)

      } catch (error) {
        console.error(error)
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center pt-4">

      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold pt-10">ProdMail</h1>
        <p className="text-muted-foreground pb-2">
          Analise seus e-mails e ganhe + produtividade
        </p>
      </div>

      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Conteúdo do E-mail</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Cole o e-mail abaixo ou arraste o arquivo com e-mail para ser analisado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Digite o e-mail que recebeu aqui..."
            className="resize-none h-40"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={isDisabled} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Analisando..." : "Analise o E-mail"}
          </Button>
        </CardContent>
      </Card>

      {responseData && (
        <Card className="w-full mt-5 max-w-2xl shadow-lg">
          <CardHeader className="justify-start">
            <CardTitle className="inline-flex items-center">

              <div>
                <div className="inline-flex items-center">
                  {responseData.label === 0 ? (
                    <CircleX className="" />
                  ) : (
                    <CircleCheckBig />
                  )}
                  <p className="pl-2">Resultado da Análises</p>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <span className="">Classificação do e-mail:</span>
                  {responseData.label === 0 ? (
                    <Badge variant="destructive">Improdutivo</Badge>
                  ) : (
                    <Badge>Produtivo</Badge>
                  )}
                </div>
              </div>

            </CardTitle>
          </CardHeader>
          <div className="pr-5 pl-5">
            <Separator />
          </div>
          
          {
            responseData.suggestions.map((suggestion) => (
              <Card className="w-9/10 m-auto break-all">
                <CardHeader className="flex items-center">
                  <CardTitle>{suggestion}</CardTitle>
                </CardHeader>
              </Card>
            ))
          }

        </Card>

      )}
    </div>
  );
}