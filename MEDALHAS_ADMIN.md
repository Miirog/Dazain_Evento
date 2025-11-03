# Sistema de Administração de Medalhas

## Como Adicionar Medalhas aos Usuários

Após o deploy no Railway, você pode adicionar medalhas aos usuários de duas formas:

### 1. Via API (Railway)

Você pode adicionar medalhas usando o endpoint POST `/api/medalhas`:

#### Exemplo com cURL:
```bash
curl -X POST https://seu-app.railway.app/api/medalhas \
  -H "Content-Type: application/json" \
  -d '{"telefone": "(11) 98765-4321", "medalhaId": 1}'
```

#### Exemplo com JavaScript/Node.js:
```javascript
const axios = require('axios');

async function adicionarMedalha(telefone, medalhaId) {
  try {
    const response = await axios.post('https://seu-app.railway.app/api/medalhas', {
      telefone: telefone,
      medalhaId: medalhaId
    });
    console.log('Medalha adicionada:', response.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}

// Exemplo: Adicionar medalha 1 ao usuário com telefone (11) 98765-4321
adicionarMedalha('(11) 98765-4321', 1);
```

#### Exemplo com Python:
```python
import requests

def adicionar_medalha(telefone, medalha_id):
    url = 'https://seu-app.railway.app/api/medalhas'
    data = {
        'telefone': telefone,
        'medalhaId': medalha_id
    }
    
    response = requests.post(url, json=data)
    
    if response.status_code == 200:
        print('Medalha adicionada:', response.json())
    else:
        print('Erro:', response.json())

# Exemplo: Adicionar medalha 1 ao usuário com telefone (11) 98765-4321
adicionar_medalha('(11) 98765-4321', 1)
```

### 2. Diretamente no Google Sheets

Você também pode adicionar medalhas diretamente na planilha do Google Sheets:

1. Abra sua planilha no Google Sheets
2. Vá para a aba **"Usuarios"**
3. Encontre o usuário pelo telefone na coluna C
4. Na linha do usuário, localize a coluna da medalha desejada:
   - **Medalha1** = Coluna E
   - **Medalha2** = Coluna F
   - **Medalha3** = Coluna G
   - **Medalha4** = Coluna H
   - **Medalha5** = Coluna I
5. Adicione a data de conquista (formato: YYYY-MM-DD)

**Exemplo**: Para dar a Medalha 2 ao usuário com telefone (11) 98765-4321, localize a linha dele e adicione `2024-01-15` na coluna F.

## Medalhas Disponíveis

O sistema possui 5 medalhas:

| ID | Nome | Descrição | Cor |
|----|------|-----------|-----|
| 1 | Pioneiro | Primeira conquista! | Dourado #FFD700 |
| 2 | Explorador | Descobrindo o caminho | Prata #C0C0C0 |
| 3 | Conquistador | Meio caminho andado | Bronze #CD7F32 |
| 4 | Mestre | Quase lá! | Roxo #9370DB |
| 5 | Lenda | Completo! | Rosa #FF1493 |

## Validações

- **telefone**: Campo obrigatório, deve corresponder exatamente ao telefone cadastrado
- **medalhaId**: Deve ser um número entre 1 e 5
- Um usuário não pode ter a mesma medalha duas vezes

## Buscar Medalhas de um Usuário

Para buscar as medalhas de um usuário específico:

```bash
curl https://seu-app.railway.app/api/medalhas/(11)%2098765-4321
```

Ou no navegador:
```
https://seu-app.railway.app/api/medalhas/(11)%2098765-4321
```

**Nota**: URLs com caracteres especiais precisam ser codificadas. Use `%20` para espaço, `%28` para `(`, `%29` para `)`.

## Estrutura da Planilha

### Aba "Usuarios"
Armazena todos os dados dos usuários em uma única planilha:

**Colunas:**
- **A**: Nome
- **B**: Email
- **C**: Telefone (chave primária - identificador único)
- **D**: Empresa
- **E**: Medalha1 (data de conquista ou vazia)
- **F**: Medalha2 (data de conquista ou vazia)
- **G**: Medalha3 (data de conquista ou vazia)
- **H**: Medalha4 (data de conquista ou vazia)
- **I**: Medalha5 (data de conquista ou vazia)

**Vantagens desta estrutura:**
- ✅ Um usuário = uma linha
- ✅ Fácil de visualizar todas as medalhas de um usuário
- ✅ Permite ter medalhas não sequenciais (ex: 1, 3 e 5)
- ✅ Data de conquista registrada para cada medalha
- ✅ Consultas mais rápidas

## Automação Sugerida

Você pode criar scripts de automação para adicionar medalhas com base em critérios específicos:

### Exemplo: Adicionar medalha para todos os usuários
```javascript
// Listar todos os telefones da planilha de Cadastros
// Para cada telefone, adicionar a medalha desejada
```

### Exemplo: Sistema de pontos
```javascript
// Calcular pontos baseado em ações do usuário
// Quando atingir X pontos, adicionar medalha automaticamente
```

## Segurança

- As APIs são públicas, então qualquer um pode adicionar medalhas
- Considere implementar autenticação para operações administrativas
- Para produção, recomendamos adicionar:
  - API Key ou Bearer Token
  - Rate limiting
  - Logs de auditoria

## Troubleshooting

### Erro: "Usuário já possui esta medalha"
O usuário já tem essa medalha específica. Verifique com a API de busca.

### Erro: "Telefone não encontrado"
O telefone não está cadastrado. Verifique a planilha de Cadastros.

### Erro: "ID da medalha deve ser entre 1 e 5"
Use apenas IDs de 1 a 5.

### A aba não existe
A aba é criada automaticamente na primeira execução. Se houver problema, crie manualmente no Google Sheets:
1. Aba chamada "Usuarios"
2. Cabeçalho: Nome | Email | Telefone | Empresa | Medalha1 | Medalha2 | Medalha3 | Medalha4 | Medalha5

