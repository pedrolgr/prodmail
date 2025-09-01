# ProdMail

## Estrutura do Projeto

```
api/        # Backend Python (Flask, NLTK (Naive Bayes), Gemini AI)
frontend/   # Frontend React (Vite, Shadcn, TailwindCSS)
```

## Instalação
Clone o projeto na sua máquina:
```bash
git clone https://github.com/pedrolgr/prodmail.git
cd prodmail
```

### Backend (`api/`)

- **main.py**: Servidor Flask. Expõe `/api/classify` para classificação de e-mails e sugestões.
- **gemini/gemini.py**: Integração com Google Gemini AI para sugestões de resposta.
- **training/training_model.py**: Treina e salva o classificador Naive Bayes com dados rotulados.
- **classifier/emailclassifier.pkl**: Modelo treinado.
- **data/email_data.txt**: Dados de treinamento.
- **data/stopwords.txt**: Stopwords para pré-processamento.

#### Requisitos

Instale as dependências do backend:

```sh
cd api
pip install -r api/requirements.txt
```

#### Ambiente

Entre no site https://aistudio.google.com/apikey e pegue a sua API_KEY do Gemini.<br>
Crie um arquivo `.env` em `api/.env` e configure sua chave da API do Gemini:

```
GEMINI_API_KEY=sua-chave-aqui
```

#### Execução

Treine o modelo (opcional pois já existe um modelo treinado em `api/classifier/emailclassifier.pkl`):

```sh
python api/training/training_model.py
```

Inicie o servidor e pegue o endereço em que está sendo executado seu backend:
```sh
python api/main.py
```
<img width="315" height="139" alt="image" src="https://github.com/user-attachments/assets/0f8129a3-3991-4ad5-8e17-f6770b18935b" />

### Frontend (`frontend/`)

- **src/App.jsx**: App principal React. Permite colar ou enviar e-mails, analisar e arquivar resultados.
- **src/components/ui/**: Componentes de UI personalizados do Shadcn.
- **src/index.css**: TailwindCSS.
- **vite.config.js**: Configuração do Vite.

#### Requisitos

Instale as dependências:

```sh
cd frontend
npm install
```

#### Ambiente

Crie um arquivo .env em `frontend/.env` e configure o endpoint da API (informado após executar o arquivo `main.py`:

```
VITE_API_URL=ENDEREÇO_AQUI/api/classify
```

#### Execução

Inicie o servidor frontend:

```sh
npm run dev
```

Acesse o endereço do localhost no navegador.

## Como Usar

1. Cole ou envie um e-mail (.pdf ou .txt) no frontend.
2. Clique em "Analise o E-mail" para classificar e obter sugestões.
3. Arquive e-mails analisados para referência futura.

## Observações Importantes

- **Chave da API**: É necessário fornecer uma chave Gemini válida, caso o contrário a API não retornará sugestões.
- **Treinamento do Modelo**: O classificador é treinado com `email_data.txt`. Treine novamente se atualizar esse arquivo.
- **Armazenamento Local**: E-mails arquivados ficam no localStorage do navegador.
- **Upload de Arquivos**: Apenas arquivos `.pdf` e `.txt` são suportados para leitura.
