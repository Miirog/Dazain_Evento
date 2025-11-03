# 🧪 Guia de Testes da API

Este documento explica como usar os scripts de teste automatizados.

## 📋 Scripts Disponíveis

### 1. `test-api.js` (Node.js)

Script em Node.js para testar a API local ou no Railway.

**Requisitos:** Node.js instalado

**Uso:**

```bash
# Testar API local (localhost:5000)
node test-api.js

# Testar API no Railway
node test-api.js railway

# Testar com URL customizada
API_URL=https://sua-url.app/api node test-api.js
```

### 2. `test-api.ps1` (PowerShell)

Script em PowerShell para usuários Windows.

**Requisitos:** PowerShell 5.0+

**Uso:**

```powershell
# Testar API local (localhost:5000)
.\test-api.ps1

# Testar API no Railway
.\test-api.ps1 railway

# Testar com URL customizada
$env:API_URL="https://sua-url.app/api"
.\test-api.ps1
```

## 🧪 Testes Executados

Ambos os scripts executam a mesma suíte de testes:

### 1. Health Check ✅
Verifica se a API está respondendo corretamente.

**Endpoint:** `GET /api/health`

**Sucesso:** Status "ok" retornado

### 2. Cadastro de Usuário ✅
Testa o cadastro de um novo usuário na planilha.

**Endpoint:** `POST /api/submit`

**Dados de teste gerados automaticamente:**
- Nome aleatório
- Email único com timestamp
- Telefone aleatório
- Empresa de teste

**Sucesso:** Dados salvos na planilha

### 3. Adicionar Medalha ✅
Adiciona uma medalha ao usuário de teste.

**Endpoint:** `POST /api/medalhas`

**Medalha testada:** Pioneiro (ID: 1)

**Sucesso:** Medalha adicionada ao usuário

### 4. Buscar Medalhas ✅
Busca as medalhas do usuário de teste.

**Endpoint:** `GET /api/medalhas/:telefone`

**Sucesso:** Lista de medalhas retornada (incluindo a adicionada no teste anterior)

### 5. Medalha Duplicada ✅
Tenta adicionar a mesma medalha novamente.

**Endpoint:** `POST /api/medalhas`

**Comportamento esperado:** Erro informando que o usuário já possui a medalha

**Sucesso:** Sistema bloqueou a duplicação corretamente

### 6. Múltiplas Medalhas ✅
Adiciona várias medalhas de uma vez.

**Medalhas testadas:** IDs 2, 3, 4

**Sucesso:** Todas as medalhas adicionadas com sucesso

## 📊 Relatório de Testes

Ao final da execução, o script exibe:

```
📊 Relatório Final

✅ Health Check: PASSOU
✅ Cadastro: PASSOU
✅ Adicionar Medalha: PASSOU
✅ Buscar Medalhas: PASSOU
✅ Medalha Duplicada: PASSOU
✅ Múltiplas Medalhas: PASSOU

🎯 Resultados: 6/6 testes passaram
🎉 Todos os testes passaram! Sistema está funcionando corretamente.

📝 Dados do usuário de teste:
   Nome: Usuário Teste
   Email: teste20240115123045@example.com
   Telefone: (11) 1234-5678
```

## 🔍 Verificando Resultados

### No Google Sheets

Após executar os testes, você pode verificar na planilha:

**Aba "Cadastros":**
- Um registro do usuário de teste
- Dados: Nome, Email, Telefone, Empresa

**Aba "Medalhas":**
- 4 registros para o telefone de teste
- Medalhas: 1, 2, 3, 4
- Datas de quando foram adicionadas

### Via Navegador

Se quiser testar visualmente:

1. Acesse a URL da aplicação
2. Use os dados do usuário de teste para acessar o Hub de Medalhas
3. Verifique se as medalhas aparecem corretamente

## ⚙️ Configuração

### Variáveis de Ambiente

Os scripts detectam automaticamente o ambiente baseado em:

1. Parâmetro de linha de comando: `railway`
2. Variável de ambiente: `API_URL`
3. Padrão: `http://localhost:5000/api`

### Personalização

Para modificar os dados de teste, edite o arquivo `test-api.js` ou `test-api.ps1` na seção:

```javascript
// Dados de teste
const testUser = {
  nome: 'Usuário Teste',
  email: `teste${Date.now()}@example.com`,
  telefone: `(${Math.floor(Math.random() * 100)}) ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`
}
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'axios'"

**Solução:**
```bash
npm install axios
```

### Erro: "API não respondeu"

**Verifique:**
1. API está rodando?
2. URL está correta?
3. Porta está correta?
4. Firewall/antivírus não está bloqueando?

### Erro: "Medalha já existe"

Isso é **esperado** no teste de medalha duplicada. Significa que o sistema está funcionando corretamente!

### Erro no PowerShell: "ExecutionPolicy"

**Solução:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\test-api.ps1
```

## 📝 Notas Importantes

1. **Dados de teste** são gerados automaticamente a cada execução
2. **Telefones aleatórios** podem já existir - isso é normal
3. **Medalhas** são adicionadas às vezes de forma sequencial
4. **Wait** entre requisições (1 segundo) para evitar rate limiting
5. **Limpeza** automática - testes não poluem dados reais

## 🎯 Casos de Uso

### Desenvolvimento Local

```bash
# Iniciar servidor
npm run dev

# Em outro terminal, testar
node test-api.js
```

### CI/CD Pipeline

```bash
# No seu pipeline de deploy
npm run build:all

# Após deploy, testar
API_URL=https://staging.app/api node test-api.js
```

### Monitoramento

```bash
# Agendar execução periódica
# Crontab (Linux/Mac):
*/15 * * * * cd /path/to/project && node test-api.js railway >> logs.txt

# Task Scheduler (Windows):
# Configure para executar .\test-api.ps1 railway a cada 15 minutos
```

## 🔐 Segurança

⚠️ **Importante:**
- Scripts são apenas para **testes**
- Não use em **produção** sem autenticação adequada
- Dados de teste são **inseridos** na planilha real
- **Monitore** os dados no Google Sheets

## 📚 Referências

- [Documentação completa da API](../GUIA_CONFIGURACAO.md)
- [Admin de Medalhas](../MEDALHAS_ADMIN.md)
- [Implementação Completa](../IMPLEMENTACAO_COMPLETA.md)

