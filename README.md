# Dazain Landing Page

Landing page com formulário de cadastro e sistema de medalhas que salva dados no Google Sheets, hospedada no Railway.

## 🚀 Tecnologias

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Integração**: Google Sheets API
- **Deploy**: Railway

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Google Cloud Platform
- Conta no Railway

## 🔧 Configuração Local

### 1. Instalar dependências

```bash
npm run install:all
```

### 2. Adicionar Logo da Empresa (Opcional)

Coloque sua logo em:
```
frontend/public/logo.png
```

Formatos aceitos: PNG, SVG, JPG, WEBP  
Tamanho recomendado: 300x100px

Se não adicionar a logo, aparecerá um placeholder "🎯 DAZAIN" em magenta.

### 3. Adicionar Fonte IBrand (Opcional)

Coloque os arquivos da fonte em:
```
frontend/public/fonts/
  - IBrand.woff2
  - IBrand.woff
```

📚 **[Veja instruções completas](frontend/public/README_FONTES.md)**  
💡 Se não adicionar, o sistema usará Outfit como fallback automaticamente.

### 4. Configurar Google Sheets API

#### Passo 1: Criar projeto no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**

#### Passo 2: Criar Service Account
1. Vá em **IAM & Admin** > **Service Accounts**
2. Clique em **Create Service Account**
3. Dê um nome (ex: `sheets-service`) e clique em **Create and Continue**
4. Pule as permissões (Role) e clique em **Done**
5. Clique no service account criado
6. Vá na aba **Keys**
7. Clique em **Add Key** > **Create new key**
8. Escolha **JSON** e baixe o arquivo

#### Passo 3: Preparar a Planilha Google
1. Crie uma nova planilha no Google Sheets
2. Compartilhe a planilha com o email do service account (encontrado no JSON baixado, campo `client_email`)
3. Dê permissão de **Editor**
4. Copie o ID da planilha da URL: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`

#### Passo 4: Configurar variáveis de ambiente

Crie o arquivo `backend/.env` com os seguintes dados do JSON baixado:
```env
GOOGLE_PROJECT_ID=seu-project-id
GOOGLE_PRIVATE_KEY_ID=sua-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua-chave-privada-completa\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_SHEET_ID=id-da-sua-planilha
PORT=5000
```

**Exemplo de arquivo `.env` no backend:**
1. Abra o JSON baixado do Google Cloud
2. Copie os valores dos campos:
   - `project_id` → `GOOGLE_PROJECT_ID`
   - `private_key_id` → `GOOGLE_PRIVATE_KEY_ID`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (copie toda a chave, incluindo as quebras de linha `\n`)
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `client_id` → `GOOGLE_CLIENT_ID`
3. Para `GOOGLE_SHEET_ID`, pegue da URL da planilha: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`

**Importante**: Para `GOOGLE_PRIVATE_KEY`, mantenha as quebras de linha como `\n` na string.

### 3. Rodar localmente

```bash
# Desenvolvimento (frontend + backend)
npm run dev

# Ou separadamente:
npm run dev:frontend  # Frontend na porta 3000
npm run dev:backend   # Backend na porta 5000
```

Acesse: http://localhost:3000

## 🚢 Deploy no Railway

### 1. Preparar o projeto

Execute o build do frontend:
```bash
npm run build:all
```

### 2. Deploy no Railway

O projeto está configurado para servir o frontend e backend em um único serviço no Railway.

#### Passo a passo:

1. **Criar conta no Railway**
   - Acesse [Railway](https://railway.app/)
   - Faça login com GitHub/GitLab/Google

2. **Criar novo projeto**
   - Clique em **New Project**
   - Escolha **Deploy from GitHub repo** (recomendado) ou **Empty Project**
   - Se usar GitHub, conecte seu repositório

3. **Configurar variáveis de ambiente**
   - No painel do Railway, vá em **Variables**
   - Adicione todas as variáveis do `backend/.env`:
     - `GOOGLE_PROJECT_ID`
     - `GOOGLE_PRIVATE_KEY_ID`
     - `GOOGLE_PRIVATE_KEY` (copie a chave completa com as quebras de linha `\n`)
     - `GOOGLE_CLIENT_EMAIL`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_SHEET_ID`
     - `NODE_ENV=production`
   - O Railway gerará automaticamente a variável `PORT`

4. **Configurar Build e Start**
   - O Railway detectará automaticamente o Node.js
   - Configure o **Build Command** (se necessário): `npm run build:all`
   - Configure o **Start Command**: `npm start`
   - Ou deixe o Railway usar as configurações padrão

5. **Deploy**
   - O Railway fará o deploy automaticamente
   - Você receberá uma URL (ex: `https://seu-app.railway.app`)
   - O frontend será servido estaticamente pelo Express na raiz
   - A API estará disponível em `/api/*`

### 3. Verificar funcionamento

1. Acesse a URL fornecida pelo Railway
2. Preencha o formulário e envie
3. Verifique na planilha do Google Sheets se os dados foram salvos

### 4. Troubleshooting

- Se o deploy falhar, verifique os logs no Railway
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se o service account tem permissão na planilha do Google
- Certifique-se de que o Google Sheets API está ativado

## 📝 Estrutura do Projeto

```
dazain_lp/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.jsx
│   │   │   └── SuccessMessage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/           # API Express
│   ├── services/
│   │   └── sheetsService.js
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## 🔒 Segurança

- Nunca commite arquivos `.env` no Git
- Use variáveis de ambiente no Railway
- A chave privada do Google deve estar protegida

## 🏆 Sistema de Medalhas

O sistema inclui um hub de medalhas personalizado para cada usuário:

### Funcionalidades

- **5 Medalhas Disponíveis**: Pioneiro, Explorador, Conquistador, Mestre, Lenda
- **Identificação por Telefone**: Cada usuário é identificado pelo número de telefone cadastrado
- **Visualização em Tempo Real**: As medalhas são exibidas automaticamente após o cadastro
- **Barra de Progresso**: Mostra o percentual de medalhas conquistadas

### Como Adicionar Medalhas

Veja o arquivo [MEDALHAS_ADMIN.md](MEDALHAS_ADMIN.md) para instruções detalhadas.

#### Via API (POST `/api/medalhas`):

```bash
curl -X POST https://seu-app.railway.app/api/medalhas \
  -H "Content-Type: application/json" \
  -d '{"telefone": "(11) 98765-4321", "medalhaId": 1}'
```

#### Buscar Medalhas (GET `/api/medalhas/:telefone`):

```bash
curl https://seu-app.railway.app/api/medalhas/(11)%2098765-4321
```

### Estrutura da Planilha

A planilha Google Sheets possui uma única aba:

**Usuarios** com as seguintes colunas:
- Nome
- Email
- Telefone
- Empresa
- Medalha1 (data de conquista)
- Medalha2 (data de conquista)
- Medalha3 (data de conquista)
- Medalha4 (data de conquista)
- Medalha5 (data de conquista)

A aba é criada automaticamente na primeira execução. Cada linha representa um usuário único identificado pelo telefone.

## 📚 Documentação

### 🚀 Começando

- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Setup rápido em 10 passos (recomendado para iniciantes)

### 📖 Guias Detalhados

- **[GUIA_CONFIGURACAO.md](GUIA_CONFIGURACAO.md)** - Configuração completa passo a passo (Google Sheets + Railway)
- **[TESTES_API.md](TESTES_API.md)** - Como testar a API localmente e no Railway
- **[MEDALHAS_ADMIN.md](MEDALHAS_ADMIN.md)** - Como adicionar e gerenciar medalhas
- **[LOCALSTORAGE_INFO.md](LOCALSTORAGE_INFO.md)** - Sistema de cache local e persistência

### 🔧 Recursos Avançados

- **[IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)** - Visão técnica da implementação
- **[GUIDELINE_CORES.md](GUIDELINE_CORES.md)** - Paleta de cores, fontes e diretrizes visuais
- **[NOTA_NORMALIZACAO_TELEFONE.md](NOTA_NORMALIZACAO_TELEFONE.md)** - Sistema de normalização de telefones
- **[DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)** - Deploy do frontend na Vercel
- **[backend/admin-medalhas-exemplo.js](backend/admin-medalhas-exemplo.js)** - Scripts de exemplo em Node.js

## 📞 Suporte

Em caso de problemas:
1. Verifique se o Google Sheets API está ativado
2. Confirme que o service account tem permissão na planilha
3. Verifique os logs no Railway
4. Confirme que todas as variáveis de ambiente estão configuradas
5. Execute os testes automatizados: `node test-api.js` ou `.\test-api.ps1`

