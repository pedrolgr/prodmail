# ProdMail


## ⚡ Instalação

Primeiro, clone o repositório e instale todas as dependências do backend

```bash
git clone https://github.com/pedrolgr/prodmail.git
cd prodmail
cd api
pip install -r requirements.txt
```

Entre no site https://aistudio.google.com/apikey e pegue a sua API_KEY do Gemini.<br>

<img width="1868" height="495" alt="image" src="https://github.com/user-attachments/assets/c1609fc7-c485-4594-a66c-75c9eac4ea15" />

Crie um arquivo `.env` dentro da pasta `/api/` e cole o seguinte código:


```bash
GEMINI_API_KEY=COLOQUE A SUA API KEY DO GEMINI AQUI
```

Dentro do arquivo `main.py`, na linha 9, faça a seguinte alteração para não ter erros de CORS durante a execução da sua máquina:
```bash
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
# MANTENHA {"origins": "*"} PARA PODER RECEBER REQUISIÇÕES DE QUALQUER ENDEREÇO SEM ERRO DE CORS
```

Após isso, execute o arquivo `main.py` e pegue o endereço em que está sendo executado seu backend.

<img width="315" height="139" alt="image" src="https://github.com/user-attachments/assets/0f8129a3-3991-4ad5-8e17-f6770b18935b" />


Depois, instale as dependências do frontend

```bash
cd ../frontend/
npm install
```

Crie um `.env` dentro da pasta `/frontend/`
```bash
VITE_API_URL=COLE O LINK DO SERVIDOR DO FLASK AQUI
```

Digite o seguinte comando no terminal:
```bash
npm run dev
```
