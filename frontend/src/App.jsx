import { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  CircleX,
  CircleCheckBig,
  Upload,
  ClipboardCopy,
  Send,
  Archive,
  Zap
} from "lucide-react";

import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function App() {
  const [emailText, setEmailText] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [archivedEmails, setArchivedEmails] = useState([]);
  const fileInputRef = useRef(null);

  // Carrega arquivados do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem("archivedEmails");
    if (stored) setArchivedEmails(JSON.parse(stored));
  }, []);

  const handleFileClick = () => fileInputRef.current.click();
  const isDisabled = loading || emailText.trim() === "";

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n";
    }
    return fullText;
  };

  const extractTextFromTXT = async (file) => file.text();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    let text = "";

    try {
      if (file.name.endsWith(".pdf")) {
        text = await extractTextFromPDF(file);
      } else if (file.name.endsWith(".txt")) {
        text = await extractTextFromTXT(file);
      }
      setEmailText(text);
    } catch (err) {
      console.error("Erro ao ler o arquivo:", err);
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (emailText.trim() !== "") {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL, {
          email: emailText,
        });
        setResponseData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };

  const handleArchive = () => {
    if (!responseData) return;
    const newEntry = {
      email: emailText,
      label: responseData.label,
      firstSuggestion: responseData.suggestions[0] || "",
    };
    const updated = [...archivedEmails, newEntry];
    setArchivedEmails(updated);
    localStorage.setItem("archivedEmails", JSON.stringify(updated));

    setEmailText("");
    setResponseData(null);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center pt-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold pt-10">ProdMail</h1>
        <p className="text-muted-foreground pb-2">
          Analise seus e-mails e ganhe + produtividade
        </p>
      </div>

      <Tabs defaultValue="analysis" className="w-full max-w-2xl">
        <TabsList className="w-full justify-center">
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="archived">
            Arquivados ({archivedEmails.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Card className="w-full shadow-lg mt-4">
            <CardHeader>
              <CardTitle>Conteúdo do E-mail</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Cole o e-mail abaixo ou envie um arquivo (.pdf, .txt)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Digite o e-mail que recebeu aqui..."
                className="resize-none h-40"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
              />
              <Button
                onClick={handleSubmit}
                disabled={isDisabled}
                className="w-full cursor-pointer">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!loading && <Zap className="h-4 w-4" />}
                {loading ? "Analisando..." : "Analise o E-mail"}
              </Button>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleFileClick}
                disabled={loading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {loading ? "Processando..." : "Envie seu arquivo"}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.txt"
                onChange={handleFileChange}
              />
            </CardContent>
          </Card>

          {responseData && (
            <Card className="w-full mt-5 shadow-lg">
              <CardHeader className="justify-start">
                <CardTitle className="inline-flex items-center">
                  <div>
                    <div className="inline-flex items-center">
                      {responseData.label === 0 ? <CircleX /> : <CircleCheckBig />}
                      <p className="pl-2">Resultado da Análise</p>
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <span>Classificação do e-mail:</span>
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

              {responseData.suggestions.map((suggestion, idx) => (
                <Card key={idx} className="w-[90%] m-auto break-words my-2">
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(suggestion)}
                        className="text-gray-500 hover:text-gray-800 cursor-pointer"
                      >
                        <ClipboardCopy size={20} />
                      </button>
                      <CardTitle>{suggestion}</CardTitle>
                    </div>

                    <div>
                      <a
                        href={`mailto:?body=${encodeURIComponent(suggestion)}`}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <Send size={20} />
                      </a>
                    </div>
                  </CardHeader>
                </Card>
              ))}

              <Button
                variant="default"
                className="mt-4 w-[90%] mx-auto flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleArchive}
              >
                <Archive size={20} />
                Arquivar este e-mail
              </Button>

            </Card>
          )}
        </TabsContent>

        <TabsContent value="archived">
          {archivedEmails.length === 0 ? (
            <p className="text-center py-10">Nenhum e-mail arquivado.</p>
          ) : (
            archivedEmails.map((item, idx) => (
              <Card key={idx} className="w-full mt-4 shadow-lg">
                <CardContent>
                  <p>
                    <strong>E-mail:</strong> {item.email}
                  </p>
                  <p>
                    <strong>Classificação:</strong>{" "}
                    {item.label === 0 ? (
                      <Badge variant="destructive">Improdutivo</Badge>
                    ) : (
                      <Badge>Produtivo</Badge>
                    )}
                  </p>
                  <p>
                    <strong>Primeira sugestão:</strong> {item.firstSuggestion}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
