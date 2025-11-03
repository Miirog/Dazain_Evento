# 📘 Guia Completo de Configuração - Railway e Google Sheets

Este guia te ajudará a configurar todo o ambiente para testar localmente e fazer deploy no Railway.

## 📋 Índice

1. [Configuração do Google Sheets](#1-configuração-do-google-sheets)
2. [Configuração Local](#2-configuração-local)
3. [Testando Localmente](#3-testando-localmente)
4. [Configuração do Railway](#4-configuração-do-railway)
5. [Deploy no Railway](#5-deploy-no-railway)
6. [Testando via API](#6-testando-via-api)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Configuração do Google Sheets

### Passo 1: Criar projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Clique no menu dropdown no topo (onde mostra o nome do projeto atual)
4. Clique em **"New Project"**
5. Preencha:
   - **Project name**: `dazain-sheets` (ou qualquer nome)
   - **Organization**: Deixe como está
   - **Location**: No organization
6. Clique em **"Create"**

### Passo 2: Ativar Google Sheets API

1. No menu lateral esquerdo, clique em **"APIs & Services"** > **"Library"**
2. Na barra de busca, digite **"Google Sheets API"**
3. Clique no resultado
4. Clique em **"Enable"**
5. Aguarde a ativação completar

### Passo 3: Criar Service Account

1. No menu lateral, clique em **"APIs & Services"** > **"Credentials"**
2. Clique em **"Create Credentials"** no topo
3. Selecione **"Service Account"**
4. Preencha:
   - **Service account name**: `sheets-service`
   - **Service account ID**: Será gerado automaticamente
5. Clique em **"Create and Continue"**
6. Em **"Grant this service account access to project"**, **NÃO adicione nenhum role** (pule)
7. Clique em **"Continue"**
8. Clique em **"Done"**

### Passo 4: Gerar Credenciais JSON

1. Na lista de Service Accounts, clique no que você acabou de criar
2. Vá na aba **"Keys"**
3. Clique em **"Add Key"** > **"Create new key"**
4. Selecione **"JSON"**
5. Clique em **"Create"**
6. Um arquivo JSON será baixado automaticamente - **GUARDE ESSE ARQUIVO!**

### Passo 5: Criar a Planilha Google

1. Acesse [Google Sheets](https://sheets.google.com/)
2. Clique em **"Blank"** para criar uma nova planilha
3. Dê um nome (ex: "Dazain - Cadastros e Medalhas")
4. Copie o **ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```
   O ID é a parte entre `/d/` e `/edit`

5. Compartilhe a planilha com o Service Account:
   - Clique em **"Share"** (botão verde no topo direito)
   - No campo de email, cole o **client_email** do JSON baixado
   - Dê permissão **"Editor"**
   - Clique em **"Send"**
   - **Importante**: Desmarque a opção "Notify people" (para não enviar email)

### Passo 6: Extrair Informações do JSON

Abra o arquivo JSON baixado e você verá algo assim:

```json
{
  "type": "service_account",
  "project_id": "seu-projeto-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n",
  "client_email": "sheets-service@seu-projeto-123456.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sheets-service..."
}
```

**Anote estes valores** (você vai precisar deles):
- `project_id`
- `private_key_id`
- `private_key` (TODA a chave, incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
- `client_email`
- `client_id`

---

## 2. Configuração Local

### Passo 1: Instalar Dependências

```bash
# Na raiz do projeto
npm run install:all
```

### Passo 2: Criar arquivo .env

Na pasta `backend`, crie um arquivo chamado `.env`:

```bash
# No terminal, dentro da pasta backend
cd backend
touch .env  # No Windows: type nul > .env
```

### Passo 3: Configurar Variáveis de Ambiente

Abra o arquivo `backend/.env` e adicione:

```env
# Google Sheets API Credentials
GOOGLE_PROJECT_ID=seu-project-id-aqui
GOOGLE_PRIVATE_KEY_ID=seu-private-key-id-aqui
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua-chave-privada-completa-aqui\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=seu-service-account@seu-projeto.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_SHEET_ID=seu-id-da-planilha-aqui

# Server
PORT=5000
NODE_ENV=development
```

**⚠️ IMPORTANTE:**
1. Substitua todos os valores pelos valores do seu JSON
2. Para `GOOGLE_PRIVATE_KEY`, copie **TODA** a chave, incluindo as quebras de linha
3. Use `\n` para representar quebras de linha na string
4. Mantenha as aspas ao redor de `GOOGLE_PRIVATE_KEY`

**Exemplo de como deve ficar:**

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## 3. Testando Localmente

### Passo 1: Iniciar o Servidor

Em um terminal, na raiz do projeto:

```bash
npm run dev
```

Isso iniciará:
- Frontend em `http://localhost:3000`
- Backend em `http://localhost:5000`

### Passo 2: Testar o Frontend

1. Abra seu navegador em `http://localhost:3000`
2. Você verá o formulário de cadastro
3. Preencha todos os campos:
   - Nome: João Silva
   - Email: joao@example.com
   - Telefone: (11) 98765-4321
   - Empresa: Tech Corp
4. Clique em **"Enviar"**
5. Você deve ser redirecionado para o Hub de Medalhas
6. Abra a planilha do Google Sheets para verificar se os dados foram salvos

### Passo 3: Adicionar uma Medalha (Teste Direto no Sheets)

1. Abra sua planilha no Google Sheets
2. Se ainda não existir, crie uma aba chamada **"Medalhas"**
3. Se não existir cabeçalho, adicione: `Telefone | Medalha | Data`
4. Adicione uma linha:
   - Telefone: `(11) 98765-4321`
   - Medalha: `1`
   - Data: `2024-01-15`
5. Salve
6. Recarregue a página do Hub de Medalhas - você deve ver a medalha!

### Passo 4: Testar API Localmente

#### Opção A: Script Automatizado (Recomendado)

**Mac/Linux:**
```bash
# Testar localhost
node test-api.js

# Testar Railway
node test-api.js railway
```

**Windows (PowerShell):**
```powershell
# Testar localhost
.\test-api.ps1

# Testar Railway
.\test-api.ps1 railway
```

O script executa automaticamente:
- ✅ Health check
- ✅ Cadastro de usuário
- ✅ Adição de medalha
- ✅ Busca de medalhas
- ✅ Teste de medalha duplicada
- ✅ Múltiplas medalhas

#### Opção B: cURL Manual

```bash
# Adicionar medalha via API
curl -X POST http://localhost:5000/api/medalhas \
  -H "Content-Type: application/json" \
  -d "{\"telefone\": \"(11) 98765-4321\", \"medalhaId\": 2}"
```

```bash
# Buscar medalhas
curl http://localhost:5000/api/medalhas/(11)%2098765-4321
```

---

## 4. Configuração do Railway

### Passo 1: Criar Conta no Railway

1. Acesse [Railway](https://railway.app/)
2. Clique em **"Login"**
3. Escolha uma opção:
   - **GitHub** (recomendado se seu código está no GitHub)
   - **Email**
   - **Google**

### Passo 2: Criar Novo Projeto

1. No dashboard, clique em **"New Project"**
2. Escolha uma opção:
   - **"Deploy from GitHub repo"** (recomendado)
   - **"Deploy from Dockerfile"**
   - **"Empty Project"**

Se escolher GitHub:
3. Autorize o Railway a acessar seu GitHub (se necessário)
4. Selecione o repositório `dazain_lp`
5. Clique em **"Deploy Now"**

### Passo 3: Adicionar Variáveis de Ambiente

Após o deploy inicial, configure as variáveis:

1. No projeto, clique na aba **"Variables"**
2. Clique em **"+ New Variable"**
3. Adicione cada variável separadamente:

```
Nome: GOOGLE_PROJECT_ID
Valor: seu-project-id

Nome: GOOGLE_PRIVATE_KEY_ID
Valor: seu-private-key-id

Nome: GOOGLE_PRIVATE_KEY
Valor: -----BEGIN PRIVATE KEY-----\nsua-chave-completa\n-----END PRIVATE KEY-----\n

Nome: GOOGLE_CLIENT_EMAIL
Valor: seu-service-account@seu-projeto.iam.gserviceaccount.com

Nome: GOOGLE_CLIENT_ID
Valor: seu-client-id

Nome: GOOGLE_SHEET_ID
Valor: seu-id-da-planilha

Nome: NODE_ENV
Valor: production
```

**⚠️ IMPORTANTE**: A variável `PORT` é gerada automaticamente pelo Railway.

4. Após adicionar todas, o Railway fará um redeploy automaticamente

---

## 5. Deploy no Railway

### Configuração Automática

O Railway detecta automaticamente:
- Node.js
- Estrutura do projeto
- Comandos de build e start

### Verificar Configuração

No projeto Railway, verifique:

1. **Settings** > **Build & Deploy**:
   - Build Command: `npm run build:all` (ou deixe automático)
   - Start Command: `npm start` (ou deixe automático)

2. **Settings** > **Services**:
   - Deve haver 1 serviço ativo

3. **Deployments**:
   - Deve mostrar o status do deploy
   - Verde = sucesso

### Obter URL do Deploy

1. Clique em **"Settings"**
2. Role para baixo em **"Domains"**
3. Você verá a URL: `https://seu-app.up.railway.app`

---

## 6. Testando via API

### Opção A: Script Automatizado

**Mac/Linux:**
```bash
# Configurar URL do Railway e testar
API_URL=https://seu-app.up.railway.app/api node test-api.js
```

**Windows (PowerShell):**
```powershell
# Configurar URL do Railway e testar
$env:API_URL="https://seu-app.up.railway.app/api"
.\test-api.ps1
```

O script executa todos os testes automaticamente e mostra um relatório detalhado.

### Opção B: Testes Manuais com cURL

### Teste 1: Health Check

```bash
curl https://seu-app.up.railway.app/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Teste 2: Adicionar Cadastro

```bash
curl -X POST https://seu-app.up.railway.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@example.com",
    "telefone": "(21) 99999-8888",
    "empresa": "Design Studio"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Dados salvos com sucesso!"
}
```

### Teste 3: Adicionar Medalha

```bash
curl -X POST https://seu-app.up.railway.app/api/medalhas \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "(21) 99999-8888",
    "medalhaId": 1
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Medalha adicionada com sucesso!"
}
```

### Teste 4: Buscar Medalhas

```bash
curl https://seu-app.up.railway.app/api/medalhas/(21)%2099999-8888
```

Resposta esperada:
```json
{
  "success": true,
  "medalhas": [1]
}
```

### Teste 5: Testar no Navegador

1. Acesse: `https://seu-app.up.railway.app`
2. Preencha o formulário
3. Verifique se aparece o Hub de Medalhas
4. Adicione medalhas via API ou diretamente no Sheets

---

## 7. Troubleshooting

### ❌ Erro: "GOOGLE_SHEET_ID não configurado"

**Causa**: Variável de ambiente não configurada

**Solução**:
1. Verifique se o `.env` existe em `backend/.env`
2. Verifique se todas as variáveis estão presentes
3. Reinicie o servidor após adicionar variáveis

### ❌ Erro: "Service Account não tem permissão"

**Causa**: O email do service account não tem acesso à planilha

**Solução**:
1. Abra a planilha no Google Sheets
2. Clique em "Share"
3. Adicione o `client_email` do JSON
4. Dê permissão "Editor"
5. Aguarde alguns segundos e tente novamente

### ❌ Erro: "Google Sheets API não ativada"

**Causa**: API não foi ativada no Google Cloud

**Solução**:
1. Acesse Google Cloud Console
2. Vá em "APIs & Services" > "Library"
3. Busque "Google Sheets API"
4. Clique em "Enable"
5. Aguarde a ativação

### ❌ Erro: "Invalid credentials" ou "Token expired"

**Causa**: Credenciais incorretas ou JSON incorreto

**Solução**:
1. Verifique se copiou TODA a private key (incluindo BEGIN e END)
2. Verifique se usou `\n` para quebras de linha
3. Regere o JSON e atualize as variáveis

### ❌ Erro: "PORT is already in use" (Localmente)

**Causa**: Porta 5000 já está sendo usada

**Solução**:
1. Pare outros processos na porta 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. Ou altere a porta no `.env`:
   ```env
   PORT=3001
   ```

### ❌ Deploy no Railway falha

**Causa**: Variáveis de ambiente faltando ou incorretas

**Solução**:
1. Verifique todas as variáveis em "Variables"
2. Veja os logs em "Deployments"
3. Confirme que não há espaços extras nos valores
4. Regere o deploy em "Deployments" > "Redeploy"

### ❌ Medalhas não aparecem no Hub

**Causa**: Erro na busca de medalhas ou formatação do telefone

**Solução**:
1. Verifique os logs do backend
2. Confirme que o telefone está exatamente igual ao cadastrado
3. Verifique se a aba "Medalhas" foi criada
4. Teste a API diretamente com cURL

---

## 📝 Checklist de Configuração

Use este checklist para garantir que tudo está configurado:

### Google Cloud
- [ ] Projeto criado no Google Cloud Console
- [ ] Google Sheets API ativada
- [ ] Service Account criado
- [ ] JSON de credenciais baixado
- [ ] Planilha Google criada
- [ ] Planilha compartilhada com o service account email
- [ ] ID da planilha anotado

### Local
- [ ] Dependências instaladas (`npm run install:all`)
- [ ] Arquivo `backend/.env` criado
- [ ] Todas as variáveis configuradas no `.env`
- [ ] Servidor iniciando sem erros (`npm run dev`)
- [ ] Frontend acessível em `http://localhost:3000`
- [ ] Backend respondendo em `http://localhost:5000`
- [ ] Cadastro funcionando
- [ ] Hub de Medalhas aparecendo
- [ ] Dados salvando no Google Sheets

### Railway
- [ ] Conta criada no Railway
- [ ] Projeto criado
- [ ] Repositório conectado (ou código enviado)
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] URL do Railway anotada
- [ ] Health check respondendo
- [ ] API funcionando
- [ ] Site acessível pelo navegador

---

## 🎉 Próximos Passos

Agora que está tudo configurado:

1. **Teste todas as funcionalidades** localmente e no Railway
2. **Adicione medalhas** usando a API ou diretamente no Sheets
3. **Personalize as medalhas** se quiser (cores, nomes, etc.)
4. **Configure domínio customizado** no Railway (opcional)
5. **Monitore os logs** no Railway para verificar funcionamento

---

## 📚 Referências Úteis

- [Documentação do Google Sheets API](https://developers.google.com/sheets/api)
- [Documentação do Railway](https://docs.railway.app/)
- [Guia de Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Railway Status](https://status.railway.app/)

---

## 💡 Dicas

1. **Guarde o JSON de credenciais** em local seguro - você precisará dele para configurações futuras
2. **Use variáveis de ambiente** - nunca commite credenciais no Git
3. **Monitore a cota da API** - Google Sheets API tem limites
4. **Faça backups** - exporte a planilha periodicamente
5. **Teste sempre localmente primeiro** - é mais rápido que esperar deploy

---

**Problemas?** Revise a seção [Troubleshooting](#7-troubleshooting) ou consulte os logs do Railway.

