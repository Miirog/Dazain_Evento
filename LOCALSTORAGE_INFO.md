# 💾 Sistema de localStorage

O sistema utiliza o localStorage do navegador para salvar informações do usuário e melhorar a experiência.

## 📦 O que é salvo

### 1. Informações de Sessão
- `dazain_user_phone`: Telefone do usuário cadastrado
- `dazain_user_submitted`: Flag indicando se o formulário foi enviado

**Chave:** `dazain_user_phone`  
**Tipo:** String  
**Exemplo:** `"(11) 98765-4321"`

**Chave:** `dazain_user_submitted`  
**Tipo:** String  
**Valor:** `"true"`

### 2. Cache de Medalhas
- `medalhas_{telefone}`: Array de IDs das medalhas conquistadas

**Chave:** `medalhas_${telefone}`  
**Tipo:** JSON String  
**Exemplo:** `"[1, 3, 5]"`

## 🎯 Como Funciona

### Fluxo de Carregamento

1. **Primeiro carregamento:**
   - Usuário faz cadastro
   - Dados são salvos no localStorage
   - Medalhas são buscadas da API
   - Medalhas são cacheadas

2. **Recarregamento da página:**
   - App detecta `dazain_user_phone` no localStorage
   - Mostra o Hub de Medalhas automaticamente
   - Carrega medalhas do cache instantaneamente
   - Busca atualizações da API em background

3. **Atualização silenciosa:**
   - Cache mostra medalhas antigas imediatamente
   - API é consultada para novas medalhas
   - Cache é atualizado sem reload

## 🔄 Benefícios

### Performance
- ✅ Carregamento instantâneo
- ✅ Menos requisições à API
- ✅ Experiência fluida

### UX
- ✅ Usuário vê conteúdo imediatamente
- ✅ Persistência entre sessões
- ✅ Sem necessidade de login

### Offline
- ✅ Funciona sem internet (cache)
- ✅ Atualiza quando conexão voltar
- ✅ Dados sempre sincronizados

## 🧹 Limpeza

### Como limpar manualmente

No console do navegador (F12):
```javascript
// Limpar tudo
localStorage.clear()

// Limpar dados específicos
localStorage.removeItem('dazain_user_phone')
localStorage.removeItem('dazain_user_submitted')
localStorage.removeItem('medalhas_(11) 98765-4321')
```

### Limpeza automática sugerida

Você pode adicionar um botão de "Sair" que limpa o localStorage:

```javascript
const handleLogout = () => {
  // Limpar localStorage
  localStorage.removeItem('dazain_user_phone')
  localStorage.removeItem('dazain_user_submitted')
  
  // Remover todas as medalhas cached
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('medalhas_')) {
      localStorage.removeItem(key)
    }
  })
  
  // Redirecionar para formulário
  window.location.reload()
}
```

## 🔍 Debug

### Verificar o que está salvo

No console do navegador (F12):
```javascript
// Ver todos os dados
console.log(localStorage)

// Ver chaves específicas
console.log(localStorage.getItem('dazain_user_phone'))
console.log(localStorage.getItem('dazain_user_submitted'))
console.log(localStorage.getItem('medalhas_(11) 98765-4321'))
```

### Testar cache

1. Preencha o formulário
2. Abra DevTools (F12) > Application > Local Storage
3. Verifique os dados salvos
4. Recarregue a página
5. Veja que abre direto no Hub

## ⚠️ Limitações

### Armazenamento
- **Limite:** ~5-10MB por domínio
- **Dados:** Apenas strings
- **Persistência:** Mantém entre sessões

### Segurança
- **Acesso:** Qualquer script na página
- **HTTPS:** Recomendado em produção
- **Senhas:** NUNCA salve senhas

### Privacidade
- **Por domínio:** Cada site tem seu localStorage
- **Por navegador:** Dados não compartilhados entre navegadores
- **Limpeza:** Usuário pode limpar quando quiser

## 📝 Estrutura dos Dados

### localStorage completo
```json
{
  "dazain_user_phone": "(11) 98765-4321",
  "dazain_user_submitted": "true",
  "medalhas_(11) 98765-4321": "[1, 3, 5]"
}
```

### Cada chave de medalha
- **Nome:** `medalhas_{telefone completo}`
- **Conteúdo:** Array JSON de IDs de medalhas
- **Exemplo:** `"[1, 3, 5]"`

## 🎯 Casos de Uso

### 1. Persistência de Sessão
Usuário fecha a aba e abre novamente → volta direto para Hub

### 2. Performance
Primeira visita → carrega cache → consulta API em background

### 3. Offline
Sem internet → mostra medalhas do cache → sincroniza depois

### 4. Múltiplos Usuários
Cada telefone → seu próprio cache → isolado

## 🔧 Customização

### Mudar chaves
No código:
```javascript
// Em App.jsx
localStorage.setItem('minha_chave', value)

// Em MedalHub.jsx
localStorage.setItem(`minhas_medalhas_${telefone}`, medalhas)
```

### Adicionar TTL (tempo de expiração)
```javascript
// Adicionar timestamp
const data = {
  valor: medalhas,
  timestamp: Date.now()
}
localStorage.setItem('medalhas', JSON.stringify(data))

// Verificar se expirou
const cached = JSON.parse(localStorage.getItem('medalhas'))
const agora = Date.now()
const umaHora = 60 * 60 * 1000

if (agora - cached.timestamp > umaHora) {
  // Expirado, buscar novamente
  fetchMedalhas()
}
```

## 📊 Impacto

### Antes do localStorage
- Recarregar página → volta para formulário
- Sem medalhas instantâneas
- Requisita API a cada abertura
- UX mais lenta

### Depois do localStorage
- Recarregar página → vai direto para Hub
- Medalhas aparecem instantaneamente
- Cache + API em background
- UX muito mais fluida

---

**Nota:** O localStorage é limpo automaticamente quando:
- Usuário limpa dados do navegador
- Modo anônimo/privado é fechado
- Cache é limpo manualmente

