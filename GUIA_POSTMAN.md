# 📮 Guia Completo: Testar API no Postman

Este guia mostra como testar a API, especialmente para enviar medalhas, usando o Postman.

## ⚠️ IMPORTANTE: Use o BODY, não os PARAMS!

O endpoint `/api/medalhas` espera os dados no **Body (JSON)**, não nos **Query Parameters (Params)**.

## 🎯 Caso Específico: Enviar Medalha 3 para 17988349182

### Configuração no Postman

#### 1. **Método e URL**

- **Método:** `POST`
- **URL:** 
  - Local: `http://localhost:5000/api/medalhas`
  - Produção: `https://seu-app.railway.app/api/medalhas`

#### 2. **Headers (Cabeçalhos)**

Clique em **Headers** e adicione:

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Importante:** O Postman pode adicionar automaticamente `Content-Type` quando você seleciona Body > raw > JSON, mas é bom verificar.

#### 3. **Body (Corpo da Requisição)** ⭐ **AQUI É ONDE VOCÊ COLOCA OS DADOS!**

1. Clique na aba **Body**
2. Selecione **raw**
3. No dropdown ao lado de "raw", selecione **JSON**
4. Cole o seguinte JSON:

```json
{
  "telefone": "17988349182",
  "medalhaId": 3
}
```

**Visual esperado:**
```
┌─────────────────────────────────┐
│ Body                            │
│ ○ none                          │
│ ○ form-data                     │
│ ○ x-www-form-urlencoded         │
│ ○ raw ← SELECIONE ESTE          │
│ ○ binary                        │
│ ○ GraphQL                       │
│                                 │
│ [JSON ▼] ← SELECIONE JSON       │
│                                 │
│ {                               │
│   "telefone": "17988349182",    │
│   "medalhaId": 3                │
│ }                               │
└─────────────────────────────────┘
```

#### 4. **Params (Query Parameters)** ❌ **NÃO USE AQUI!**

Deixe a aba **Params** **VAZIA**. Não adicione `telefone` ou `medalhaId` aqui!

**Se você colocar nos Params, receberá o erro:**
```
{
  "message": "Telefone e Medalha são obrigatórios"
}
```

### Exemplo Visual Completo

```
POSTMAN INTERFACE
┌─────────────────────────────────────────────────────────┐
│ POST  http://localhost:5000/api/medalhas  [Send]        │
├─────────────────────────────────────────────────────────┤
│ Params │ Authorization │ Headers │ Body │ Pre-request │ Tests │
│        │               │         │ ●    │             │       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Body                                                     │
│ ○ none     ● raw  ○ form-data  ○ x-www-form-urlencoded  │
│                                                          │
│ [JSON ▼]                                                 │
│                                                          │
│ {                                                        │
│   "telefone": "17988349182",                            │
│   "medalhaId": 3                                        │
│ }                                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## ✅ Resposta de Sucesso

Se tudo estiver correto, você receberá:

**Status:** `200 OK`

**Body:**
```json
{
  "success": true,
  "message": "Medalha adicionada com sucesso!"
}
```

## ❌ Erros Comuns e Soluções

### Erro 1: "Telefone e Medalha são obrigatórios"

**Causa:** Dados enviados nos Params em vez do Body

**Solução:**
1. Vá para a aba **Body**
2. Selecione **raw** > **JSON**
3. Adicione o JSON com `telefone` e `medalhaId`
4. Deixe a aba **Params** vazia

### Erro 2: "Usuário não encontrado"

**Causa:** O telefone não está cadastrado

**Solução:** Cadastre o usuário primeiro:
1. **POST** `http://localhost:5000/api/submit`
2. Body (raw > JSON):
```json
{
  "nome": "Teste",
  "email": "teste@example.com",
  "telefone": "17988349182",
  "empresa": "Empresa Teste"
}
```

### Erro 3: "Usuário já possui esta medalha"

**Causa:** O usuário já tem a medalha 3

**Solução:** Tente enviar outra medalha (ID 1, 2, 4 ou 5)

### Erro 4: "Network Error" ou "Connection Error"

**Causa:** URL incorreta ou servidor não está rodando

**Solução:**
1. Verifique se a URL está correta
2. Verifique se o servidor está rodando (`npm run dev`)
3. Teste o health check primeiro: **GET** `http://localhost:5000/api/health`

## 📋 Coleção Completa de Exemplos

### 1. Health Check

**GET** `http://localhost:5000/api/health`

**Response esperado:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### 2. Cadastrar Usuário

**POST** `http://localhost:5000/api/submit`

**Body (raw > JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "17988349182",
  "empresa": "Minha Empresa"
}
```

### 3. Enviar Medalha 3

**POST** `http://localhost:5000/api/medalhas`

**Body (raw > JSON):**
```json
{
  "telefone": "17988349182",
  "medalhaId": 3
}
```

### 4. Buscar Medalhas

**GET** `http://localhost:5000/api/medalhas/17988349182`

**Response esperado:**
```json
{
  "success": true,
  "medalhas": [3]
}
```

### 5. Enviar Outras Medalhas

**Medalha 1 (Pioneiro 🏆):**
```json
{
  "telefone": "17988349182",
  "medalhaId": 1
}
```

**Medalha 2 (Explorador 🔍):**
```json
{
  "telefone": "17988349182",
  "medalhaId": 2
}
```

**Medalha 4 (Mestre 👑):**
```json
{
  "telefone": "17988349182",
  "medalhaId": 4
}
```

**Medalha 5 (Lenda 🌟):**
```json
{
  "telefone": "17988349182",
  "medalhaId": 5
}
```

## 🎯 Passo a Passo Detalhado

### Enviar Medalha 3 para 17988349182

1. **Abra o Postman**
2. **Crie uma nova requisição:**
   - Clique em "New" > "HTTP Request"
3. **Configure o método:**
   - Selecione `POST` no dropdown
4. **Digite a URL:**
   - `http://localhost:5000/api/medalhas`
5. **Configure os Headers:**
   - Clique em "Headers"
   - Adicione `Content-Type: application/json`
6. **Configure o Body:** ⭐ **PARTE MAIS IMPORTANTE**
   - Clique em "Body"
   - Selecione "raw"
   - No dropdown, selecione "JSON"
   - Cole este JSON:
     ```json
     {
       "telefone": "17988349182",
       "medalhaId": 3
     }
     ```
7. **Verifique que Params está vazio:**
   - Clique em "Params"
   - Certifique-se de que não há nada lá
8. **Envie a requisição:**
   - Clique em "Send"
9. **Verifique a resposta:**
   - Deve mostrar `200 OK` com mensagem de sucesso

## 🔍 Verificação Rápida

### Checklist antes de enviar:

- [ ] Método é `POST`
- [ ] URL está correta: `/api/medalhas`
- [ ] Body está selecionado (não Params)
- [ ] Body está em formato `raw` > `JSON`
- [ ] JSON contém `"telefone": "17988349182"`
- [ ] JSON contém `"medalhaId": 3` (sem aspas no número)
- [ ] Header `Content-Type` está configurado
- [ ] Params está vazio

## 📸 Estrutura Visual da Requisição

```
┌──────────────────────────────────────────────────────────────┐
│ POST                                                          │
│ http://localhost:5000/api/medalhas                    [Send] │
├──────────────────────────────────────────────────────────────┤
│ Params │ Auth │ Headers │ Body │ Pre-request │ Tests │ Code │
│        │      │         │  ●   │             │       │      │
├──────────────────────────────────────────────────────────────┤
│                                                                 │
│ Headers                                                        │
│ ┌──────────────┬──────────────────────────────────┐            │
│ │ KEY          │ VALUE                            │            │
│ ├──────────────┼──────────────────────────────────┤            │
│ │ Content-Type │ application/json                  │            │
│ └──────────────┴──────────────────────────────────┘            │
│                                                                 │
├──────────────────────────────────────────────────────────────┤
│                                                                 │
│ Body                                                           │
│ ○ none     ● raw  ○ form-data  ○ x-www-form-urlencoded       │
│                                                                 │
│ [JSON ▼]                                                       │
│                                                                 │
│ {                                                              │
│   "telefone": "17988349182",                                  │
│   "medalhaId": 3                                              │
│ }                                                              │
│                                                                 │
└──────────────────────────────────────────────────────────────┘
```

## 💡 Dicas Importantes

1. **Sempre use Body > raw > JSON** para este endpoint
2. **Nunca use Params** para enviar dados neste caso
3. **Formato do telefone:** Pode ser com ou sem formatação (o backend normaliza)
4. **medalhaId é um número:** Não coloque aspas: `3` (correto), não `"3"` (também funciona, mas é string)
5. **Salve a requisição:** Clique em "Save" para reutilizar depois

## 🐛 Troubleshooting Avançado

### Se ainda não funcionar:

1. **Verifique o Console do Postman:**
   - View > Show Postman Console
   - Veja a requisição completa enviada

2. **Compare com a requisição de sucesso:**
   - Veja o que foi enviado vs o esperado

3. **Teste com cURL (via Postman):**
   - Após enviar, clique em "Code" (canto inferior direito)
   - Selecione "cURL"
   - Você verá o comando cURL equivalente
   - Execute no terminal para verificar

### Exemplo de cURL gerado:

```bash
curl --location 'http://localhost:5000/api/medalhas' \
--header 'Content-Type: application/json' \
--data '{
    "telefone": "17988349182",
    "medalhaId": 3
}'
```

## 📚 Referências

- [Postman Documentation](https://learning.postman.com/docs/)
- [API Endpoints Documentation](IMPLEMENTACAO_COMPLETA.md)
- [Testes Automatizados](TESTES_API.md)

