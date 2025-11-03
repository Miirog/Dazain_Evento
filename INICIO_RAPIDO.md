# 🚀 Início Rápido - Dazain LP

Este guia te leva do zero até ter a aplicação rodando em produção no Railway em **10 passos simples**.

## ⚡ Setup Rápido (30 minutos)

### Pré-requisitos

- [ ] Conta Google (para Google Sheets API)
- [ ] Conta GitHub (para Railway)
- [ ] Node.js 18+ instalado
- [ ] Git instalado

---

## 📝 Passo a Passo

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/dazain_lp.git
cd dazain_lp
```

### 2️⃣ Instale as Dependências

```bash
npm run install:all
```

### 3️⃣ Configure Google Sheets API

🔗 **[Siga este guia completo](GUIA_CONFIGURACAO.md#1-configuração-do-google-sheets)**

Resumo rápido:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto
3. Ative Google Sheets API
4. Crie um Service Account
5. Baixe o JSON de credenciais
6. Crie uma planilha no Google Sheets
7. Compartilhe a planilha com o email do Service Account
8. Anote o ID da planilha

### 4️⃣ Configure Variáveis de Ambiente

Crie `backend/.env`:

```env
GOOGLE_PROJECT_ID=seu-project-id
GOOGLE_PRIVATE_KEY_ID=seu-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_SHEET_ID=seu-id-da-planilha
PORT=5000
```

### 5️⃣ Teste Localmente

```bash
# Iniciar servidor
npm run dev
```

Abra: `http://localhost:3000`

### 6️⃣ Execute os Testes

**Mac/Linux:**
```bash
node test-api.js
```

**Windows:**
```powershell
.\test-api.ps1
```

Você deve ver: ✅ Todos os testes passaram!

### 7️⃣ Faça o Commit

```bash
git add .
git commit -m "feat: configuração inicial"
git push
```

### 8️⃣ Configure Railway

1. Acesse [Railway](https://railway.app/)
2. Login com GitHub
3. New Project > Deploy from GitHub repo
4. Selecione seu repositório
5. Aguarde o deploy inicial

### 9️⃣ Configure Variáveis no Railway

No Railway, vá em **Variables** e adicione todas as variáveis do `backend/.env`:
- `GOOGLE_PROJECT_ID`
- `GOOGLE_PRIVATE_KEY_ID`
- `GOOGLE_PRIVATE_KEY` (TODA a chave)
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_SHEET_ID`
- `NODE_ENV=production`

### 🔟 Teste em Produção

1. Pegue sua URL do Railway
2. Teste no navegador
3. Execute testes automatizados:

```bash
API_URL=https://seu-app.railway.app/api node test-api.js
```

---

## ✅ Checklist de Verificação

Use este checklist para garantir que tudo está funcionando:

### Local
- [ ] `npm run dev` inicia sem erros
- [ ] Frontend acessível em `localhost:3000`
- [ ] Backend responde em `localhost:5000`
- [ ] Formulário de cadastro funciona
- [ ] Hub de Medalhas aparece após cadastro
- [ ] `node test-api.js` passa em todos os testes
- [ ] Dados salvando no Google Sheets

### Railway
- [ ] Deploy bem-sucedido (verde)
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Health check respondendo
- [ ] Site acessível no navegador
- [ ] Formulário funcionando em produção
- [ ] Medalhas aparecendo no Hub
- [ ] API testada com sucesso

---

## 🎯 Próximos Passos

Agora que está tudo funcionando:

1. **Personalize** as medalhas (cores, nomes, descrições)
2. **Configure domínio customizado** no Railway
3. **Adicione medalhas** para usuários reais
4. **Monitore** os dados no Google Sheets
5. **Acompanhe** os logs no Railway

---

## 📚 Documentação Completa

Para informações detalhadas:

- **[GUIA_CONFIGURACAO.md](GUIA_CONFIGURACAO.md)** - Setup detalhado
- **[MEDALHAS_ADMIN.md](MEDALHAS_ADMIN.md)** - Gerenciar medalhas
- **[TESTES_API.md](TESTES_API.md)** - Testes automatizados
- **[IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)** - Detalhes técnicos

---

## 🐛 Problemas?

### Erro Comum #1: "API não responde"

```bash
# Verifique se o servidor está rodando
npm run dev

# Em outro terminal, teste
curl http://localhost:5000/api/health
```

### Erro Comum #2: "Credenciais inválidas"

Verifique o arquivo `backend/.env`:
- Todas as variáveis preenchidas?
- `GOOGLE_PRIVATE_KEY` com a chave completa?
- Quebras de linha como `\n`?

### Erro Comum #3: "Permission denied no Sheets"

Abra a planilha no Google Sheets:
1. Clique em "Share"
2. Adicione o email do Service Account
3. Permissão: Editor
4. Desmarque "Notify people"

### Erro Comum #4: "Deploy falha no Railway"

Verifique os logs no Railway:
1. Clique em "Deployments"
2. Veja os logs
3. Confirme todas as variáveis estão configuradas

---

## 🎉 Sucesso!

Se você chegou até aqui e todos os testes passaram, parabéns! 🎊

Sua aplicação está rodando em produção e pronta para receber cadastros e medalhas!

---

## 📞 Precisa de Ajuda?

1. Leia a seção [Troubleshooting](GUIA_CONFIGURACAO.md#7-troubleshooting)
2. Execute os testes automatizados
3. Verifique os logs no Railway
4. Consulte a documentação completa

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de cadastros e medalhas**

