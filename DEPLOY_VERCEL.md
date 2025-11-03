# 🚀 Deploy do Frontend na Vercel

Este guia te ajudará a fazer o deploy do frontend na Vercel.

## 📋 Pré-requisitos

- [ ] Conta no [Vercel](https://vercel.com)
- [ ] Backend rodando no Railway (ou outro serviço)
- [ ] Código no GitHub (recomendado)

---

## 🎯 Arquitetura

```
┌──────────────┐         ┌──────────────┐
│   Vercel     │────────▶│   Railway    │
│  (Frontend)  │  API    │  (Backend)   │
└──────────────┘         └──────────────┘
```

**Frontend:** Vercel (deploy automático)  
**Backend:** Railway (já configurado)

---

## 📝 Opção 1: Deploy via GitHub (Recomendado)

### Passo 1: Preparar o Repositório

Se ainda não fez push para o GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/dazain_lp.git
git push -u origin main
```

### Passo 2: Criar Projeto na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"Add New"** > **"Project"**
4. Importe o repositório `dazain_lp`

### Passo 3: Configurar Deploy

**Configurações do Projeto:**

- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `dist` (automático)
- **Install Command:** `npm install` (automático)

⚠️ **Importante:** Marque **"Root Directory"** e defina como `frontend`

### Passo 4: Configurar Variáveis de Ambiente

Nas configurações do projeto, vá em **"Environment Variables"**:

```
Nome: VITE_API_URL
Valor: https://seu-backend.railway.app/api
Ambiente: Production, Preview, Development (todas)
```

⚠️ **Importante:** Use a URL completa do seu backend Railway

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (~2-5 minutos)
3. Sua URL estará disponível: `https://seu-app.vercel.app`

### Passo 6: Testar

1. Acesse a URL do Vercel
2. Preencha o formulário
3. Verifique se os dados estão salvando no Google Sheets
4. Teste o sistema de medalhas

---

## 📝 Opção 2: Deploy via CLI

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login

```bash
vercel login
```

### Passo 3: Deploy

Na pasta **`frontend`**:

```bash
cd frontend
vercel
```

Siga as instruções:
- **Link to existing project?** N (primeiro deploy)
- **Project name:** dazain-lp (ou outro)
- **Directory:** ./
- **Settings:** Deixe padrão

### Passo 4: Configurar Variáveis

```bash
vercel env add VITE_API_URL production
# Digite: https://seu-backend.railway.app/api

vercel env add VITE_API_URL preview
# Digite: https://seu-backend.railway.app/api

vercel env add VITE_API_URL development
# Digite: https://seu-backend.railway.app/api
```

### Passo 5: Deploy em Produção

```bash
vercel --prod
```

---

## 🔗 Configuração do Backend (Railway)

O backend no Railway NÃO precisa de mudanças!

Mas verifique se CORS está configurado:

```javascript
// backend/server.js
app.use(cors())
```

Isso deve permitir requisições da Vercel.

---

## 🌍 Domínio Customizado (Opcional)

### Adicionar Domínio

1. No projeto Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio: `app.dazain.com`
3. Configure o DNS conforme instruções
4. Aguarde propagação (~1-24h)

---

## 🔄 Deploy Automático

Após configurar via GitHub:

✅ **Cada push para `main`** → Deploy automático em produção  
✅ **Cada pull request** → Preview deployment  
✅ **Builds rápidos** (~2-3 minutos)  
✅ **Rollback fácil** → Um clique para versões anteriores

---

## 🧪 Testar a Integração

### 1. Frontend + Backend

```bash
# Frontend: https://seu-app.vercel.app
# Backend: https://seu-backend.railway.app/api

# Teste via browser
curl https://seu-app.vercel.app
```

### 2. API Calls

No console do navegador:
```javascript
// Deve apontar para o Railway
console.log(window.location.origin)
```

### 3. Teste Completo

1. Acesse: `https://seu-app.vercel.app`
2. Preencha formulário
3. Verifique medalhas
4. Adicione medalha via API
5. Atualize medalhas

---

## 📊 Monitoramento

### Vercel Analytics

- **Speed Insights:** Performance do site
- **Real User Monitoring:** Métricas reais
- **Build Logs:** Debug de erros

### Logs

No painel Vercel:
- **Deployments:** Veja todos os deploys
- **Logs:** Veja logs em tempo real
- **Function Logs:** Se usar serverless

---

## ⚙️ Configurações Avançadas

### Build Otimizado

A Vercel já otimiza automaticamente, mas você pode:

```json
// frontend/package.json
{
  "scripts": {
    "build": "vite build --mode production",
    "build:staging": "vite build --mode staging"
  }
}
```

### Redirecionamentos

Criar `frontend/public/_redirects`:
```
/api/*  https://seu-backend.railway.app/api/:splat  200
```

Ou usar `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://seu-backend.railway.app/api/$1"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Erro: "Failed to build"

**Causa:** Dependências ou erro de build

**Solução:**
```bash
# Local
cd frontend
rm -rf node_modules dist
npm install
npm run build

# Se build local funciona, problema é na Vercel
```

### Erro: "API not found"

**Causa:** VITE_API_URL incorreto ou CORS

**Solução:**
1. Verifique variável de ambiente na Vercel
2. Confirme URL do Railway (deve terminar em `/api`)
3. Verifique CORS no backend: `app.use(cors())`

### Erro: "Environment variable not defined"

**Causa:** Variável não configurada na Vercel

**Solução:**
1. Settings > Environment Variables
2. Adicione `VITE_API_URL`
3. Faça redeploy

### Build funcionando mas site não carrega

**Causa:** Problema com roteamento

**Solução:**
Verifique se `vercel.json` está correto

---

## 📈 Comparação Vercel vs Railway

### Vercel (Frontend)

✅ **Vantagens:**
- Deploy automático
- CDN global
- SSL automático
- Preview deployments
- Analytics grátis
- Otimizações automáticas
- Rede Edge

❌ **Desvantagens:**
- Limite de build time (plano free)
- Sem banco de dados incluído

### Railway (Backend)

✅ **Vantagens:**
- Deploy simples
- Postgres incluído (se necessário)
- Logs em tempo real
- Auto-scaling

❌ **Desvantagens:**
- Não é otimizado para frontend
- Preço pode aumentar

---

## 🎯 Estrutura Final

```
dazain_lp/
├── backend/               ← Railway
│   ├── server.js
│   ├── services/
│   └── package.json
├── frontend/              ← Vercel
│   ├── src/
│   ├── public/
│   ├── vercel.json
│   └── package.json
└── README.md
```

---

## ✅ Checklist de Deploy

### Antes do Deploy
- [ ] Código commitado no GitHub
- [ ] Backend funcionando no Railway
- [ ] Testes locais passando
- [ ] CORS configurado no backend
- [ ] Logo adicionada (se necessário)
- [ ] Fonte IBrand adicionada (se necessário)

### Configuração Vercel
- [ ] Projeto criado na Vercel
- [ ] Root Directory = `frontend`
- [ ] VITE_API_URL configurado
- [ ] Framework = Vite
- [ ] Deploy realizado

### Após o Deploy
- [ ] Site carregando
- [ ] Formulário funcionando
- [ ] Dados salvando no Sheets
- [ ] Medalhas aparecendo
- [ ] Botão atualizar funcionando
- [ ] localStorage funcionando
- [ ] Responsivo testado

---

## 🚀 URLs Finais

**Frontend:** `https://seu-app.vercel.app`  
**Backend:** `https://seu-backend.railway.app/api`  
**Planilha:** Google Sheets (sua planilha)

---

## 📝 Scripts Úteis

### Teste Local com Build de Produção

```bash
cd frontend
npm run build
npm run preview

# Visite: http://localhost:4173
```

### Variáveis de Ambiente Locais

Criar `frontend/.env.local`:
```env
VITE_API_URL=https://seu-backend.railway.app/api
```

---

## 🎉 Sucesso!

Após configurar, você terá:
- ✅ Frontend na Vercel (rápido, global)
- ✅ Backend no Railway (robusto, API)
- ✅ Dados no Google Sheets (simples, visual)
- ✅ Deploy automático no push
- ✅ SSL automático
- ✅ CDN global

---

**Próximos passos:**
1. Configurar domínio customizado
2. Ativar Vercel Analytics
3. Configurar webhooks (se necessário)
4. Monitorar performance

---

**Problemas?** Consulte os logs no painel Vercel ou teste localmente com `npm run preview`.

