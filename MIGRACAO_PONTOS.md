# 🎯 Migração do Sistema de Medalhas para Sistema de Pontos

## 📋 Resumo das Mudanças

O sistema foi migrado de um modelo baseado em **medalhas** para um modelo baseado em **pontos por ativação**.

---

## 🔄 Principais Mudanças

### 1. Estrutura do Google Sheets

**Antes:**
```
Nome | Email | Telefone | Empresa | Medalha1 | Medalha2 | Medalha3 | Medalha4 | Medalha5
```

**Agora:**
```
Nome | Email | Telefone | Empresa | PontosAtivacao1 | PontosAtivacao2 | PontosAtivacao3 | PontosAtivacao4 | PontosAtivacao5 | PontosTotal
```

### 2. Lógica de Negócio

- **Antes:** Sistema binário (tem/ não tem medalha)
- **Agora:** Sistema de pontos onde cada ativação pode ter valores variados
- **Regra:** Só atualiza pontos se o novo valor for **maior** que o atual
- **Total:** Calculado automaticamente como soma de todas as ativações

---

## 🎯 Sistema de Pontos por Ativação

### Valores Base (Exemplo)
- **Ativação 1:** 100 pontos (mínimo)
- **Ativação 2:** 300 até 1000 pontos (pode variar)
- **Ativação 3:** 500 pontos (pode variar)
- **Ativação 4:** 700 pontos (pode variar)
- **Ativação 5:** 1000 pontos (pode variar)

### Comportamento
- Cada ativação pode ter **qualquer valor numérico positivo**
- Se já existe pontuação em uma ativação, só atualiza se o novo valor for **maior**
- O total é sempre a **soma** de todas as ativações

---

## 🔧 Mudanças no Backend

### Novas Funções (`backend/services/sheetsService.js`)

#### `getPontosByTelefone(telefone)`
- Busca pontos de todas as ativações do usuário
- Retorna: `{ pontos: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0 }`

#### `addPontosToUser({ telefone, ativacaoId, pontos })`
- Adiciona ou atualiza pontos de uma ativação específica
- Só atualiza se `pontos > pontosAtuais[ativacaoId]`
- Recalcula e atualiza o total automaticamente
- Retorna: `{ success: true, pontos: {...}, total: 0 }`

### Novas Rotas da API (`backend/server.js`)

#### `GET /api/pontos/:telefone`
Busca pontos do usuário.

**Response:**
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

#### `POST /api/pontos`
Adiciona ou atualiza pontos de uma ativação.

**Request:**
```json
{
  "telefone": "11999999999",
  "ativacaoId": 1,
  "pontos": 150
}
```

---

## 📊 Exemplo de Uso

### Adicionar Pontos
```bash
POST /api/pontos
{
  "telefone": "11999999999",
  "ativacaoId": 1,
  "pontos": 100
}
```

**Nota:** Se `pontos <= pontosAtuais[ativacaoId]`, não atualiza e retorna mensagem informativa.

---

## ✅ Checklist de Migração

- [x] Função `getPontosByTelefone()` criada
- [x] Função `addPontosToUser()` criada
- [x] Lógica de "só atualizar se maior" implementada
- [x] Cálculo automático de total implementado
- [x] Rotas `/api/pontos` criadas
- [x] Frontend atualizado para mostrar pontos
- [x] Card de pontos total adicionado
- [x] Estilos CSS atualizados

---

**Versão:** 2.0.0
