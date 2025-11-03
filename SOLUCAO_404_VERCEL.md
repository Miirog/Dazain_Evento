# 🔧 Solução: Erro 404 no Vercel

## 🔴 Problema Identificado

Você está recebendo **404 Not Found** ao acessar:
```
https://web-production-c7576.up.railway.app/submit
```

## ✅ Soluções

### Problema 1: URL Incorreta

**❌ ERRADO:**
```
https://web-production-c7576.up.railway.app/submit
```

**✅ CORRETO:**
```
https://web-production-c7576.up.railway.app/api/submit
```

**Todos os endpoints da API começam com `/api/`:**
- ✅ `/api/submit` - Cadastrar usuário
- ✅ `/api/medalhas` - Adicionar/buscar medalhas
- ✅ `/api/health` - Health check

### Problema 2: Configuração do Vercel

O `vercel.json` estava configurado incorretamente. Já foi corrigido para fazer proxy das requisições `/api/*` para o Railway.

## 🚀 Soluções Práticas

### Opção 1: Usar URL Direta do Railway (Recomendado)

Se você está testando diretamente no Railway, use a URL completa com `/api`:

```bash
# Health Check
GET https://web-production-c7576.up.railway.app/api/health

# Cadastrar Usuário
POST https://web-production-c7576.up.railway.app/api/submit
Body: {
  "nome": "João",
  "email": "joao@example.com",
  "telefone": "17988349182",
  "empresa": "Empresa"
}

# Enviar Medalha
POST https://web-production-c7576.up.railway.app/api/medalhas
Body: {
  "telefone": "17988349182",
  "medalhaId": 3
}
```

### Opção 2: Usar Variável de Ambiente no Vercel

O frontend na Vercel deve usar a variável `VITE_API_URL` apontando para o Railway:

1. **No painel Vercel:**
   - Vá em **Settings** > **Environment Variables**
   - Adicione:
     ```
     Nome: VITE_API_URL
     Valor: https://web-production-c7576.up.railway.app/api
     Ambientes: Production, Preview, Development
     ```

2. **Faça redeploy:**
   - Vercel > Deployments > Re-deploy

3. **O frontend usará automaticamente:**
   - Todas as chamadas `/api/*` serão feitas para o Railway
   - Não precisa do `vercel.json` para proxy se usar isso

### Opção 3: Usar Proxy no vercel.json (Já Configurado)

O `vercel.json` foi atualizado para fazer proxy. Com isso, o frontend pode chamar `/api/*` e será redirecionado para o Railway automaticamente.

**Configuração atual:**
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://web-production-c7576.up.railway.app/api/$1"
    }
  ]
}
```

**Com isso, o frontend pode usar:**
```javascript
// No código, use URL relativa:
const API_URL = '/api'  // Será redirecionado para Railway

// Ou ainda use a variável de ambiente:
const API_URL = import.meta.env.VITE_API_URL || '/api'
```

## 📋 Checklist de Configuração

### No Vercel (Frontend)

- [ ] Variável `VITE_API_URL` configurada com URL do Railway + `/api`
- [ ] `vercel.json` configurado para proxy (opcional, se não usar variável)
- [ ] Build funcionando sem erros
- [ ] Deploy bem-sucedido

### No Railway (Backend)

- [ ] Servidor rodando na porta correta
- [ ] CORS configurado (`app.use(cors())`)
- [ ] Variáveis de ambiente do Google Sheets configuradas
- [ ] Health check funcionando: `GET /api/health`

## 🧪 Testes

### Teste 1: Health Check no Railway

```bash
curl https://web-production-c7576.up.railway.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Teste 2: Cadastrar Usuário

```bash
curl -X POST https://web-production-c7576.up.railway.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@example.com",
    "telefone": "17988349182",
    "empresa": "Empresa Teste"
  }'
```

### Teste 3: Enviar Medalha

```bash
curl -X POST https://web-production-c7576.up.railway.app/api/medalhas \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "17988349182",
    "medalhaId": 3
  }'
```

## 🐛 Troubleshooting

### Erro 404 Persiste

**Verifique:**
1. URL está correta? Deve terminar com `/api/submit`
2. Método HTTP está correto? Deve ser `POST`
3. Servidor Railway está rodando? Verifique logs

### Erro CORS

**Verifique no backend:**
```javascript
// backend/server.js deve ter:
app.use(cors())  // Permite requisições de qualquer origem
```

### Erro na Build do Vercel

**Possíveis causas:**
1. Variável `VITE_API_URL` não configurada
2. Erro de sintaxe no código
3. Dependências faltando

**Solução:**
```bash
# Teste build localmente
cd frontend
npm install
npm run build

# Se funcionar localmente, problema é na Vercel
# Verifique logs no painel Vercel
```

### Frontend não consegue conectar ao Railway

**Verifique:**
1. URL do Railway está correta e acessível
2. CORS está habilitado no backend
3. Variável `VITE_API_URL` está configurada corretamente
4. Network tab do navegador mostra o erro exato

## 📝 Resumo das URLs Corretas

### Railway (Backend)
```
https://web-production-c7576.up.railway.app/api/submit
https://web-production-c7576.up.railway.app/api/medalhas
https://web-production-c7576.up.railway.app/api/health
```

### Vercel (Frontend)
```
https://seu-app.vercel.app
```

### No Código do Frontend
```javascript
// Opção 1: Usar variável de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Opção 2: Usar URL relativa (com proxy do vercel.json)
const API_URL = '/api'
```

## 🎯 Próximos Passos

1. ✅ Corrigir URL: usar `/api/submit` em vez de `/submit`
2. ✅ Configurar `VITE_API_URL` no Vercel
3. ✅ Fazer redeploy do frontend
4. ✅ Testar requisições
5. ✅ Verificar logs se ainda houver erro

## 💡 Dica Importante

**Sempre use a URL completa com `/api`** quando testar diretamente no Railway:
- ✅ `https://web-production-c7576.up.railway.app/api/submit`
- ❌ `https://web-production-c7576.up.railway.app/submit`

