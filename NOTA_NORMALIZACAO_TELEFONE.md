# 📱 Normalização de Telefone

## ✅ Implementação Completa

O sistema agora **normaliza automaticamente** todos os números de telefone para conter **apenas dígitos**.

---

## 🔄 Como Funciona

### Frontend (Form.jsx)
- Usuário digita: `(11) 99999-9999` ou `11 99999-9999` ou qualquer formato
- Antes de enviar, normaliza para: `11999999999`
- Envia apenas os dígitos para a API

### Backend (sheetsService.js)
- Recebe telefone do frontend ou API externa
- Normaliza para apenas números
- Salva na planilha: `11999999999`
- Busca por telefone: compara apenas números

---

## 📝 Exemplos

### Formato de Entrada
```javascript
"(11) 99999-9999"   → "11999999999"
"11 99999-9999"     → "11999999999"
"(11)99999-9999"    → "11999999999"
"+55 11 99999-9999" → "5511999999999"
"11.99999-9999"     → "11999999999"
```

### Como é Salvo na Planilha
```
Coluna C (Telefone): 11999999999
```

### Busca e Comparação
```javascript
// Todos estes formatos encontram o mesmo usuário:
telefone = "(11) 99999-9999"
telefone = "11 99999-9999"
telefone = "11999999999"

// Porque são normalizados para: 11999999999
```

---

## 🎯 Benefícios

✅ **Consistência**: Telefones sempre salvos da mesma forma  
✅ **Busca robusta**: Encontra usuários independente do formato digitado  
✅ **Experiência do usuário**: Usuário pode digitar como quiser  
✅ **Prevenção de duplicatas**: Evita criar usuários duplicados  
✅ **API flexível**: Aceita qualquer formato no input

---

## 🔧 Arquivos Modificados

### Backend
- **`backend/services/sheetsService.js`**
  - Função `normalizeTelefone()` adicionada
  - `submitToSheets()` normaliza telefone antes de salvar/buscar
  - `getMedalhasByTelefone()` normaliza antes de buscar
  - `addMedalhaToUser()` normaliza antes de adicionar medalha

### Frontend
- **`frontend/src/components/Form.jsx`**
  - Função `normalizeTelefone()` adicionada
  - `handleSubmit()` normaliza antes de enviar
  - `onSubmit(telefoneNormalizado)` passa telefone normalizado

---

## 🧪 Testes

### Teste Manual

1. **Cadastre um usuário com formato:**
   ```
   Nome: João Silva
   Email: joao@example.com
   Telefone: (11) 99999-9999
   Empresa: Teste
   ```

2. **Verifique na planilha:**
   - Coluna C deve ter: `11999999999`
   - Não deve ter parênteses, espaços ou hífens

3. **Busque medalhas com formatos diferentes:**
   - `(11) 99999-9999` ✅ Funciona
   - `11 99999-9999` ✅ Funciona
   - `11999999999` ✅ Funciona

4. **Adicione medalha via API:**
   ```bash
   curl -X POST http://localhost:5000/api/medalhas \
     -H "Content-Type: application/json" \
     -d '{"telefone": "(11) 99999-9999", "medalhaId": 1}'
   ```
   - Deve funcionar normalmente ✅

---

## 📊 Estrutura de Dados

### Google Sheets - Aba "Usuarios"

| Nome | Email | Telefone | Empresa | Medalha1 | ... |
|------|-------|----------|---------|----------|-----|
| João | joao@example.com | 11999999999 | Teste | 2024-01-15 | ... |
| Maria | maria@example.com | 21988888888 | Empresa | 2024-01-16 | ... |

**Observação:** Todos os telefones são salvos sem formatação.

---

## 🔍 Casos de Uso

### Caso 1: Usuário Cadastra com Formato
```
Usuário digita: "(11) 99999-9999"
Sistema salva: "11999999999"
```

### Caso 2: API Externo Adiciona Medalha
```javascript
POST /api/medalhas
{
  "telefone": "11 99999-9999",
  "medalhaId": 2
}

// Sistema normaliza para: 11999999999
// Busca usuário com este telefone
// Adiciona medalha
```

### Caso 3: Buscar Medalhas pelo Telefone
```javascript
GET /api/medalhas/(11)%2099999-9999

// Sistema normaliza URL decode: (11) 99999-9999
// Sistema normaliza para: 11999999999
// Busca medalhas
```

---

## ⚠️ Importante

### Migração de Dados Antigos

Se você já tem dados na planilha com telefones formatados:

```javascript
// Exemplos de telefones antigos que precisam ser normalizados:
"(11) 99999-9999" → 11999999999
"11 99999-9999"   → 11999999999
"+55 11 99999-9999" → 5511999999999
```

**Solução:** Execute um script de migração para normalizar telefones antigos.

### Script de Migração (Exemplo)

```javascript
// migrate.js
const telefoneNormalizado = normalizeTelefone(telefoneAntigo)
// Atualizar na planilha
```

---

## ✅ Checklist

- [x] Normalização implementada no frontend
- [x] Normalização implementada no backend
- [x] Testes manuais realizados
- [x] Documentação atualizada
- [ ] Migração de dados antigos (se necessário)

---

## 🚀 Próximos Passos

1. ✅ Sistema já aceita qualquer formato de telefone
2. ✅ Busca funciona independente do formato
3. ⚠️ Migrar dados antigos (se houver)
4. ✅ Testar em produção

---

**Resultado:** Sistema robusto e flexível para manipulação de telefones! 🎉

