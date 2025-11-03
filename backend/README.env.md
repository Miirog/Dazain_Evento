# Configuração do arquivo .env

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
GOOGLE_PROJECT_ID=seu-project-id
GOOGLE_PRIVATE_KEY_ID=sua-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua-chave-privada-completa\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_SHEET_ID=id-da-sua-planilha
PORT=5000
```

## Como obter os valores:

1. **GOOGLE_PROJECT_ID**: No arquivo JSON baixado, campo `project_id`
2. **GOOGLE_PRIVATE_KEY_ID**: No arquivo JSON baixado, campo `private_key_id`
3. **GOOGLE_PRIVATE_KEY**: No arquivo JSON baixado, campo `private_key` (copie toda a chave incluindo as quebras de linha)
4. **GOOGLE_CLIENT_EMAIL**: No arquivo JSON baixado, campo `client_email`
5. **GOOGLE_CLIENT_ID**: No arquivo JSON baixado, campo `client_id`
6. **GOOGLE_SHEET_ID**: Da URL da planilha Google: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`

## Exemplo de GOOGLE_PRIVATE_KEY:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

Observe que as quebras de linha devem ser representadas como `\n` na string.


