# ⚠️ SOLUÇÃO: Erro "Telefone e Medalha são obrigatórios" no Postman

## 🔴 O Problema

Você está recebendo:
```json
{
  "message": "Telefone e Medalha são obrigatórios"
}
```

**Causa:** Você está enviando os dados nos **Params** (Query Parameters), mas o endpoint espera os dados no **Body** (JSON)!

## ✅ A Solução

### ❌ NÃO FAÇA ISSO (Params):
```
Params (Query Parameters)
┌──────────┬──────────────┐
│ KEY      │ VALUE        │
├──────────┼──────────────┤
│ telefone │ 17988349182  │ ❌ ERRADO!
│ medalhaId│ 3            │ ❌ ERRADO!
└──────────┴──────────────┘
```

### ✅ FAÇA ISSO (Body):

1. **Clique na aba "Body"**
2. **Selecione "raw"**
3. **Selecione "JSON" no dropdown**
4. **Cole este JSON:**

```json
{
  "telefone": "17988349182",
  "medalhaId": 3
}
```

## 📋 Passo a Passo Rápido

1. **Método:** `POST`
2. **URL:** `http://localhost:5000/api/medalhas`
3. **Headers:** Adicione `Content-Type: application/json`
4. **Body (não Params!):**
   - Clique em "Body"
   - Selecione "raw"
   - Selecione "JSON"
   - Cole: `{"telefone": "17988349182", "medalhaId": 3}`
5. **Envie!**

## 🎯 Exemplo Visual

**CORRETO:**
```
┌─────────────────────────────────────┐
│ Body                                │
│ ○ none  ● raw  ○ form-data         │
│ [JSON ▼]                            │
│                                     │
│ {                                   │
│   "telefone": "17988349182",        │
│   "medalhaId": 3                    │
│ }                                   │
└─────────────────────────────────────┘
```

**ERRADO:**
```
┌─────────────────────────────────────┐
│ Params                              │
│ ┌──────────┬──────────────┐        │
│ │ telefone │ 17988349182  │ ❌     │
│ │ medalhaId│ 3            │ ❌     │
│ └──────────┴──────────────┘        │
└─────────────────────────────────────┘
```

## 💡 Por Que Isso Acontece?

O código do servidor está assim:
```javascript
app.post('/api/medalhas', async (req, res) => {
  const { telefone, medalhaId } = req.body  // ← Lê do BODY, não dos params!
  // ...
})
```

`req.body` = dados enviados no **Body (JSON)**
`req.params` = dados na URL (ex: `/api/medalhas/:telefone`)
`req.query` = dados nos **Query Parameters (Params)**

## 🚀 Coleção Postman Pronta

Para facilitar, importe a coleção pronta:
- Arquivo: `Dazain_API.postman_collection.json`
- No Postman: Import > Upload Files > Selecione o arquivo
- Configure a variável `baseUrl` para sua URL

## ✅ Resposta Esperada

Se feito corretamente, você receberá:

**Status:** `200 OK`

**Body:**
```json
{
  "success": true,
  "message": "Medalha adicionada com sucesso!"
}
```

---

**Resumo:** Use **Body > raw > JSON**, NUNCA use **Params** para este endpoint! 🎯

