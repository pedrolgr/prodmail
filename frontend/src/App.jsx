import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function App() {
  const [emailText, setEmailText] = useState("");

  const handleSubmit = async () => {

    if (emailText.trim() !== "") {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL, {
          email: emailText,
        });

        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-4">
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
          <Button onClick={handleSubmit} disabled={!emailText.trim()}>Analise o E-mail</Button>
        </CardContent>
      </Card>
    </div>
  );
}