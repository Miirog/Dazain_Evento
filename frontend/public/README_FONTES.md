# 🔤 Instruções para Adicionar a Fonte IBrand

## Como Funciona

O projeto usa duas fontes:
- **Outfit**: Disponível via Google Fonts (já configurada)
- **IBrand**: Fonte customizada que precisa ser adicionada manualmente

## Passos para Adicionar IBrand

### 1. Download da Fonte

A fonte IBrand é uma fonte premium. Você pode:
- Comprar a licença comercial no site oficial
- Ou usar a versão gratuita para testes pessoais

**Site oficial:** https://ifonts.xyz/ibrand-font.html

### 2. Preparar os Arquivos

Após fazer o download, você precisa dos arquivos nos formatos:
- `IBrand.woff2` (recomendado)
- `IBrand.woff` (fallback)

### 3. Organizar na Estrutura

Crie a estrutura de pastas e coloque os arquivos:

```
frontend/
├── public/
│   ├── fonts/
│   │   ├── IBrand.woff2     ← Coloque aqui
│   │   ├── IBrand.woff      ← Coloque aqui
│   │   └── README_FONTES.md
│   └── logo.png
└── src/
```

### 4. Verificar Configuração

A configuração já está pronta no código:
- `index.css` já tem o @font-face configurado
- CSS já aplica a fonte nos títulos

## Aplicação das Fontes

### IBrand (Títulos)
Aplicada em:
- Logo placeholder
- Títulos principais (h1)
- Nome das medalhas
- Títulos do hub

**Características:**
- Fonte display/decorativa
- Ideal para branding
- Impacto visual forte

### Outfit (Corpo)
Aplicada em:
- Corpo do texto
- Labels
- Descrições
- Botões
- Progresso

**Características:**
- Fonte sans-serif limpa
- Ótima legibilidade
- Geométrica e moderna

## Como Funciona se IBrand Não Estiver Disponível

Se os arquivos da IBrand não forem encontrados:
- Sistema usa Outfit como fallback automaticamente
- Não quebra o design
- Mantém a consistência visual

## Checklist

- [ ] Download da fonte IBrand feito
- [ ] Pasta `frontend/public/fonts/` criada
- [ ] Arquivos `IBrand.woff2` e `IBrand.woff` colocados na pasta
- [ ] Teste em diferentes navegadores
- [ ] Verificação de licença para uso comercial

## Testar

Para verificar se funcionou:

1. Abra o DevTools (F12)
2. Vá em **Network** > **Font**
3. Recarregue a página
4. Veja se `IBrand.woff2` carregou

Ou no **Elements**:
1. Selecione um título
2. Veja em **Computed** a fonte aplicada

## Notas Importantes

⚠️ **Licenciamento:**
- IBrand tem licença comercial necessária
- Verifique os termos no site oficial
- Versão gratuita: apenas uso pessoal

⚠️ **Performance:**
- WOFF2 é otimizado
- WOFF é fallback
- Usar @font-face com font-display: swap

---

**Última atualização:** Janeiro 2025

