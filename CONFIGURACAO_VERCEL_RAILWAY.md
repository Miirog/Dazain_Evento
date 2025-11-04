# ⚙️ Configuração: Vercel (Frontend) + Railway (Backend)

## 🎯 Arquitetura

```
┌──────────────┐         ┌──────────────┐
│   Vercel     │────────▶│   Railway   │
│  (Frontend)  │  API    │  (Backend)   │
└──────────────┘         └──────────────┘
```

**Frontend:** Vercel (React/Vite)  
**Backend:** Railway (Node.js/Express)

## ✅ Configuração Atual

### 1. Railway (Backend)

**URL do seu backend:**
```
https://web-production-c7576.up.railway.app
```

**Endpoints disponíveis:**
- `POST /api/submit` - Cadastrar usuário
- `POST /api/medalhas` - Adicionar medalha
- `GET /api/medalhas/:telefone` - Buscar medalhas
- `GET /api/health` - Health check

### 2. Vercel (Frontend)

**Opção A: Usar Variável de Ambiente (Recomendado)**

1. **No painel Vercel:**
   - Settings > Environment Variables
   - Adicione:
     ```
     Nome: VITE_API_URL
     Valor: https://web-production-c7576.up.railway.app/api
     Ambientes: Production, Preview, Development
     ```

2. **O código já está configurado:**
   ```javascript
   // frontend/src/components/Form.jsx
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
   ```

3. **Remova ou comente o proxy no vercel.json:**
   ```json
   {
     "rewrites": []
   }
   ```

**Opção B: Usar Proxy (Alternativa)**

Se preferir usar proxy, o `vercel.json` já está configurado:

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

E no código, use URL relativa:
```javascript
const API_URL = '/api'  // Será redirecionado para Railway
```

## 🔧 Atualizar URL do Railway

Se a URL do Railway mudar, atualize:

### Se usando Variável de Ambiente:
- Atualize `VITE_API_URL` no painel Vercel
- Faça redeploy

### Se usando Proxy:
- Atualize `vercel.json` com a nova URL
- Faça commit e push
- Vercel fará redeploy automaticamente

## 📋 Checklist de Configuração

### Railway
- [ ] Backend rodando e acessível
- [ ] CORS configurado (`app.use(cors())`)
- [ ] Health check funcionando: `GET /api/health`
- [ ] Variáveis de ambiente do Google Sheets configuradas

### Vercel
- [ ] Frontend deployado
- [ ] Variável `VITE_API_URL` configurada (se usar Opção A)
- [ ] `vercel.json` configurado (se usar Opção B)
- [ ] Build sem erros

## 🧪 Testar Configuração

### 1. Teste do Backend (Railway)

```bash
# Health Check
curl https://web-production-c7576.up.railway.app/api/health

# Deve retornar:
# {"status":"ok","message":"API is running"}
```

### 2. Teste do Frontend (Vercel)

1. Acesse a URL do Vercel
2. Abra o Console do navegador (F12)
3. Preencha o formulário e envie
4. Verifique se não há erros de CORS ou 404

### 3. Verificar Requisições

No Console do navegador > Network tab:
- Deve ver requisições para `/api/submit` ou para a URL do Railway
- Status deve ser `200 OK`
- Não deve haver erros de CORS

## 🐛 Problemas Comuns

### Erro: 404 Not Found

**Causa:** URL incorreta (faltando `/api`)

**Solução:**
- ✅ Use: `https://web-production-c7576.up.railway.app/api/submit`
- ❌ Não use: `https://web-production-c7576.up.railway.app/submit`

### Erro: CORS

**Causa:** Backend não está permitindo requisições do Vercel

**Solução:**
Verifique se o backend tem:
```javascript
app.use(cors())  // Permite qualquer origem
```

### Erro: Variável não definida

**Causa:** `VITE_API_URL` não configurada na Vercel

**Solução:**
1. Vercel > Settings > Environment Variables
2. Adicione `VITE_API_URL`
3. Faça redeploy

### Erro: Build falha

**Causa:** Erro de sintaxe ou dependências

**Solução:**
```bash
# Teste localmente
cd frontend
npm install
npm run build

# Se funcionar localmente, verifique logs na Vercel
```

## 📝 Notas Importantes

1. **URL do Railway pode mudar:**
   - Railway pode gerar novas URLs após deploy
   - Sempre verifique a URL atual no painel Railway

2. **Variáveis de ambiente:**
   - `VITE_API_URL` deve terminar com `/api`
   - Exemplo: `https://web-production-c7576.up.railway.app/api`

3. **Proxy vs Variável:**
   - **Variável:** Mais flexível, fácil de mudar
   - **Proxy:** Funciona mesmo sem configurar variável, mas URL fica hardcoded

4. **CORS:**
   - Backend deve permitir requisições do Vercel
   - `app.use(cors())` resolve isso

## 🚀 Próximos Passos

1. ✅ Configure `VITE_API_URL` no Vercel (Opção A) OU use proxy (Opção B)
2. ✅ Faça redeploy do frontend
3. ✅ Teste todas as funcionalidades
4. ✅ Verifique logs se houver erros


