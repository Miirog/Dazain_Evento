# 🖼️ Logo da Aplicação

## Como Adicionar a Logo

1. Coloque o arquivo da logo neste diretório (`frontend/public/`)
2. Nome do arquivo: `logo.png`
3. Formatos aceitos: PNG, SVG, JPG, WEBP
4. Tamanho recomendado: 300x100px ou proporcional

## Especificações

- **Caminho:** `/logo.png`
- **Dimensões máximas:** 180x80px (desktop), 140x60px (mobile)
- **Object-fit:** contain (mantém proporções)
- **Fallback:** Se a logo não existir, aparece um placeholder "🎯 DAZAIN"

## Estrutura de Arquivos

```
frontend/
├── public/
│   ├── logo.png         ← Coloque sua logo aqui
│   └── README_LOGO.md
└── src/
```

## Nota

A aplicação está configurada para:
- Tentar carregar `/logo.png` primeiro
- Se falhar, mostra o placeholder "🎯 DAZAIN" em magenta
- Logo aparece no topo de todas as páginas

