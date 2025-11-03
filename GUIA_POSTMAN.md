# 📮 Guia Completo: Testar API no Postman

Este guia mostra como testar a API usando o Postman, especialmente para enviar e consultar pontos do sistema.

## ⚠️ IMPORTANTE: Use o BODY, não os PARAMS!

Os endpoints `/api/pontos` e `/api/medalhas` esperam os dados no **Body (JSON)**, não nos **Query Parameters (Params)**.

---

## 🎯 Sistema de Pontos

O sistema agora trabalha com **pontos por ativação** em vez de medalhas. Cada usuário pode ter pontos em 5 ativações diferentes:

- **Ativação 1**: 100 pontos fixos (ou mais)
- **Ativação 2**: 300 até 1000 pontos
- **Ativação 3**: Variável
- **Ativação 4**: Variável
- **Ativação 5**: Variável

**Importante:** 
- Os pontos são salvos apenas se o novo valor for **maior** que o valor atual
- O sistema calcula automaticamente o total de pontos
- O telefone deve conter apenas números (será normalizado automaticamente)

---

## 🚀 Endpoints Principais (Sistema de Pontos)

### 1. Cadastrar Usuário

**POST** `http://localhost:5000/api/submit`

**Headers:**
```
Content-Type: application/json
```

**Body (raw > JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "17988349182",
  "empresa": "Minha Empresa"
}
```

**Response esperado:**
```json
{
  "success": true,
  "message": "Dados salvos com sucesso!"
}
```

**Nota:** O telefone será normalizado automaticamente (ex: `(17) 98834-9182` vira `17988349182`)

---

### 2. Adicionar/Atualizar Pontos de uma Ativação ⭐

**POST** `http://localhost:5000/api/pontos`

**Headers:**
```
Content-Type: application/json
```

**Body (raw > JSON):**
```json
{
  "telefone": "17988349182",
  "ativacaoId": 2,
  "pontos": 500
}
```

**Parâmetros:**
- `telefone` (string, obrigatório): Número de telefone do usuário (pode ter formatação)
- `ativacaoId` (número, obrigatório): ID da ativação (1, 2, 3, 4 ou 5)
- `pontos` (número, obrigatório): Pontos a serem adicionados/atualizados

**Regra de Negócio:**
- Os pontos só serão atualizados se o novo valor for **maior** que o valor atual
- Se os pontos atuais forem iguais ou maiores, retorna mensagem informativa

**Response de sucesso (atualizado):**
```json
{
  "success": true,
  "message": "Pontos atualizados com sucesso!",
  "pontos": {
    "1": 100,
    "2": 500,
    "3": 0,
    "4": 0,
    "5": 0
  },
  "total": 600
}
```

**Response quando não atualiza (valor menor ou igual):**
```json
{
  "success": true,
  "message": "Pontos não atualizados. Valor atual é maior ou igual.",
  "pontosAtuais": {
    "1": 100,
    "2": 800,
    "3": 0,
    "4": 0,
    "5": 0
  },
  "total": 900
}
```

---

### 3. Buscar Pontos de um Usuário

**GET** `http://localhost:5000/api/pontos/17988349182`

**Headers:** Nenhum necessário

**Response esperado:**
```json
{
  "success": true,
  "pontos": {
    "1": 100,
    "2": 500,
    "3": 0,
    "4": 0,
    "5": 0
  },
  "total": 600
}
```

**Nota:** Se o usuário não existir, retorna todos os pontos como 0.

---

### 4. Buscar Maior Pontuação Total

**GET** `http://localhost:5000/api/pontos/maior`

**Headers:** Nenhum necessário

**Response esperado:**
```json
{
  "success": true,
  "maiorPontuacao": 2500
}
```

**Uso:** Usado para calcular o requisito do "Brinde 6", que é baseado na maior pontuação do sistema.

---

## 📋 Exemplos Práticos

### Exemplo 1: Adicionar 100 pontos na Ativação 1

**POST** `http://localhost:5000/api/pontos`

**Body:**
```json
{
  "telefone": "17988349182",
  "ativacaoId": 1,
  "pontos": 100
}
```

### Exemplo 2: Atualizar Ativação 2 com 750 pontos

**POST** `http://localhost:5000/api/pontos`

**Body:**
```json
{
  "telefone": "17988349182",
  "ativacaoId": 2,
  "pontos": 750
}
```

### Exemplo 3: Tentar atualizar com valor menor (não atualiza)

**POST** `http://localhost:5000/api/pontos`

**Body:**
```json
{
  "telefone": "17988349182",
  "ativacaoId": 2,
  "pontos": 300
}
```

**Response:** Retorna mensagem informando que não atualizou porque o valor atual (750) é maior.

---

## 🎯 Configuração Visual no Postman

### Enviar Pontos - Configuração Completa

```
┌──────────────────────────────────────────────────────────────┐
│ POST                                                          │
│ http://localhost:5000/api/pontos                      [Send] │
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
│   "ativacaoId": 2,                                            │
│   "pontos": 500                                               │
│ }                                                              │
│                                                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Endpoints Antigos (Deprecated)

### Buscar Medalhas (DEPRECATED - usar /api/pontos)

**GET** `http://localhost:5000/api/medalhas/17988349182`

**Response:**
```json
{
  "success": true,
  "medalhas": [1, 2]
}
```

**Nota:** Este endpoint ainda funciona para compatibilidade, mas retorna medalhas baseadas nos pontos (> 0).

---

### Adicionar Medalha (DEPRECATED - usar /api/pontos)

**POST** `http://localhost:5000/api/medalhas`

**Body (raw > JSON):**
```json
{
  "telefone": "17988349182",
  "medalhaId": 3
}
```

**Nota:** Este endpoint converte medalhas em pontos automaticamente:
- Medalha 1 → 100 pontos
- Medalha 2 → 300 pontos
- Medalha 3 → 500 pontos
- Medalha 4 → 700 pontos
- Medalha 5 → 1000 pontos

**⚠️ Recomendação:** Use `/api/pontos` para ter controle total sobre os valores.

---

## ❌ Erros Comuns e Soluções

### Erro 1: "Telefone, Ativação e Pontos são obrigatórios"

**Causa:** Dados enviados nos Params em vez do Body, ou campos faltando

**Solução:**
1. Vá para a aba **Body**
2. Selecione **raw** > **JSON**
3. Certifique-se de incluir `telefone`, `ativacaoId` e `pontos`
4. Deixe a aba **Params** vazia

### Erro 2: "Usuário não encontrado"

**Causa:** O telefone não está cadastrado

**Solução:** Cadastre o usuário primeiro usando `/api/submit`

### Erro 3: "Network Error" ou "Connection Error"

**Causa:** URL incorreta ou servidor não está rodando

**Solução:**
1. Verifique se a URL está correta
2. Verifique se o servidor está rodando (`npm run dev` no backend)
3. Teste o health check primeiro: **GET** `http://localhost:5000/api/health`

---

## ✅ Checklist Antes de Enviar

### Para adicionar pontos:

- [ ] Método é `POST`
- [ ] URL está correta: `/api/pontos`
- [ ] Body está selecionado (não Params)
- [ ] Body está em formato `raw` > `JSON`
- [ ] JSON contém `"telefone": "17988349182"` (pode ter formatação)
- [ ] JSON contém `"ativacaoId": 2` (número entre 1 e 5)
- [ ] JSON contém `"pontos": 500` (número positivo)
- [ ] Header `Content-Type: application/json` está configurado
- [ ] Params está vazio

---

## 🔍 Health Check

**GET** `http://localhost:5000/api/health`

**Response esperado:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

Sempre teste este endpoint primeiro para garantir que o servidor está rodando!

---

## 📚 Coleção Completa de Requisições

### Sequência Completa de Teste

1. **Health Check**
   - GET `http://localhost:5000/api/health`

2. **Cadastrar Usuário**
   - POST `http://localhost:5000/api/submit`
   - Body: `{ "nome": "Teste", "email": "teste@test.com", "telefone": "17988349182", "empresa": "Teste" }`

3. **Adicionar Pontos - Ativação 1**
   - POST `http://localhost:5000/api/pontos`
   - Body: `{ "telefone": "17988349182", "ativacaoId": 1, "pontos": 100 }`

4. **Adicionar Pontos - Ativação 2**
   - POST `http://localhost:5000/api/pontos`
   - Body: `{ "telefone": "17988349182", "ativacaoId": 2, "pontos": 500 }`

5. **Buscar Pontos do Usuário**
   - GET `http://localhost:5000/api/pontos/17988349182`

6. **Buscar Maior Pontuação**
   - GET `http://localhost:5000/api/pontos/maior`

---

## 💡 Dicas Importantes

1. **Sempre use Body > raw > JSON** para enviar dados
2. **Nunca use Params** para enviar dados nos endpoints POST
3. **Formato do telefone:** Pode ser com ou sem formatação (ex: `(17) 98834-9182` ou `17988349182`)
4. **ativacaoId e pontos são números:** Não coloque aspas: `2` (correto), não `"2"` (também funciona, mas é string)
5. **Pontos só aumentam:** O sistema só atualiza se o novo valor for maior que o atual
6. **Salve as requisições:** Clique em "Save" para criar uma coleção reutilizável

---

## 🐛 Troubleshooting Avançado

### Verificar requisição enviada

1. **Abra o Console do Postman:**
   - View > Show Postman Console
   - Veja a requisição completa enviada

2. **Teste com cURL (via Postman):**
   - Após enviar, clique em "Code" (canto inferior direito)
   - Selecione "cURL"
   - Você verá o comando cURL equivalente

### Exemplo de cURL gerado:

```bash
curl --location 'http://localhost:5000/api/pontos' \
--header 'Content-Type: application/json' \
--data '{
    "telefone": "17988349182",
    "ativacaoId": 2,
    "pontos": 500
}'
```

---

## 📖 Referências

- [Postman Documentation](https://learning.postman.com/docs/)
- Sistema de Pontos: Ver `MIGRACAO_PONTOS.md`
- Normalização de Telefone: Ver `NOTA_NORMALIZACAO_TELEFONE.md`

