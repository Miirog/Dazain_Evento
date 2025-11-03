# 🎨 Guideline Visual - Dazain LP

Este documento descreve a paleta de cores e fontes aplicadas no projeto.

## 🔤 Fontes Utilizadas

### IBrand (Títulos)
- **Fonte:** Display customizada
- **Uso:** Logo, títulos, nomes de medalhas
- **Fallback:** Outfit
- **Peso:** 800
- **Características:** Impacto visual, branding forte

### Outfit (Corpo)
- **Fonte:** Sans-serif geométrica
- **Origem:** Google Fonts
- **Uso:** Corpo do texto, labels, descrições
- **Pesos disponíveis:** 300, 400, 500, 600, 700, 800, 900
- **Características:** Limpa, moderna, legível

**Aplicação:**
```css
/* Títulos */
font-family: 'IBrand', 'Outfit', sans-serif;
font-weight: 800;

/* Corpo */
font-family: 'Outfit', sans-serif;
font-weight: 400-600;
```

📚 **Instruções para adicionar IBrand:** [frontend/public/README_FONTES.md](frontend/public/README_FONTES.md)

## 🎨 Paleta de Cores

| Cor | Código Hex | RGB | Uso Principal |
|-----|-----------|-----|---------------|
| **Magenta Neon** | `#FF007F` | rgb(255, 0, 127) | Gradientes, destaques, Medalha 1 e 4 |
| **Verde Neon** | `#39FF14` | rgb(57, 255, 20) | Gradientes, focus states, Medalha 2 |
| **Roxo Escuro** | `#3D026D` | rgb(61, 2, 109) | Gradientes, Medalha 3 |
| **Preto Roxo** | `#1E002B` | rgb(30, 0, 43) | Texto principal, títulos |
| **Branco** | `#FFFFFF` | rgb(255, 255, 255) | Fundos, texto sobre cores escuras |

## 🎯 Aplicação das Cores

### Background da Aplicação
```css
background: linear-gradient(135deg, #FF007F 0%, #3D026D 100%);
```
- Gradiente roxo neon a roxo escuro
- Aplicado no body da aplicação

### Botões Principais
```css
background: linear-gradient(135deg, #FF007F 0%, #39FF14 100%);
color: #1E002B;
```
- Gradiente magenta a verde neon
- Texto em roxo preto para contraste
- Aplicado em: Botão de enviar, Botão de recarregar

### Estados de Focus
```css
border-color: #39FF14;
```
- Verde neon para indicar campo ativo
- Aplicado em: inputs do formulário

### Títulos e Labels
```css
color: #1E002B;
```
- Roxo preto para legibilidade
- Aplicado em: Títulos principais, labels, nomes de medalhas

### Medalhas

Cada medalha tem sua cor específica:

| Medalha | Nome | Cor | Hex |
|---------|------|-----|-----|
| 📸 1 | Fotógrafo | Magenta Neon | `#FF007F` |
| 🧭 2 | Explorador | Verde Neon | `#39FF14` |
| 🥷 3 | Ninja | Roxo Escuro | `#3D026D` |
| 👑 4 | Rei da plataforma | Magenta Neon | `#FF007F` |
| 🏆 5 | Indomável | Roxo Preto | `#1E002B` |

### Barra de Progresso
```css
background: linear-gradient(90deg, #FF007F 0%, #39FF14 100%);
```
- Gradiente horizontal magenta a verde
- Indica progresso visualmente

### Badges e Elementos de Destaque
```css
color: #FFFFFF;
background: [cor da medalha]
```
- Texto branco sobre fundo colorido
- Máximo contraste

## 🎨 Psycologia das Cores

### #FF007F (Magenta Neon)
- **Uso:** Call-to-actions, destaques, medalhas de conquista
- **Efeito:** Energético, vibrante, atenção
- **Aplicação:** Botões principais, Medalhas 1 e 4

### #39FF14 (Verde Neon)
- **Uso:** Estados positivos, feedback, progressão
- **Efeito:** Sucesso, crescimento, ativo
- **Aplicação:** Focus states, Medalha 2, gradientes

### #3D026D (Roxo Escuro)
- **Uso:** Elementos estruturais, profundidade
- **Efeito:** Sofisticação, mistério, profundidade
- **Aplicação:** Background gradient, Medalha 3

### #1E002B (Preto Roxo)
- **Uso:** Texto, informação primária
- **Efeito:** Legibilidade, seriedade, contraste
- **Aplicação:** Títulos, texto principal, Medalha 5

### #FFFFFF (Branco)
- **Uso:** Fundos, espaços em branco
- **Efeito:** Limpeza, clareza, contraste
- **Aplicação:** Cards, badges, texto sobre cores

## 📱 Aplicação por Componente

### Formulário (`Form.jsx`)
- **Background:** Gradiente magenta → roxo
- **Input focus:** Border verde neon
- **Labels:** Roxo preto
- **Botão:** Gradiente magenta → verde
- **Texto botão:** Roxo preto

### Hub de Medalhas (`MedalHub.jsx`)
- **Título:** Roxo preto
- **Botão recarregar:** Gradiente magenta → verde
- **Card conquistada:** Cor da medalha + animação pulse
- **Badge:** Texto branco, fundo da cor da medalha
- **Progresso:** Gradiente magenta → verde

### Background Geral (`index.css`)
- **Body:** Gradiente magenta → roxo escuro
- **Container:** Branco com sombra
- **Responsivo:** Mantém gradientes em todos os tamanhos

## 🎨 Combinações Recomendadas

### Gradientes Principais
```css
/* Horizontal */
linear-gradient(90deg, #FF007F, #39FF14)

/* Diagonal */
linear-gradient(135deg, #FF007F, #39FF14)

/* Background */
linear-gradient(135deg, #FF007F, #3D026D)
```

### Contraste de Texto
- **Sobre fundos claros:** `#1E002B`
- **Sobre fundos escuros:** `#FFFFFF`
- **Sobre cores neon:** `#FFFFFF` ou `#1E002B` (testar legibilidade)

### Bordas e Destaques
- **States ativos:** `#39FF14`
- **Medalhas:** Cor específica da medalha
- **Neutras:** `#e0e0e0`

## ✅ Checklist de Aplicação

- [x] Background da aplicação
- [x] Botões principais
- [x] Estados de focus
- [x] Títulos e labels
- [x] Cor de cada medalha
- [x] Barra de progresso
- [x] Badges de conquista
- [x] Hover states
- [x] Responsividade mobile
- [x] Contraste de acessibilidade

## 🎯 Princípios de Uso

1. **Consistência:** Use as cores exatamente como especificadas
2. **Contraste:** Sempre teste legibilidade em diferentes fundos
3. **Hierarquia:** Use cores mais vibrantes para elementos importantes
4. **Responsividade:** Mantenha as cores em todos os breakpoints
5. **Acessibilidade:** WCAG AA mínimo para contraste de texto

## 🚀 Implementação Futura

Para manter consistência, adicione novas cores seguindo:
- Padrão hexadecimal de 6 dígitos
- Verificação de contraste
- Aplicação em múltiplos elementos
- Teste em diferentes telas
- Documentação neste arquivo

---

**Última atualização:** Janeiro 2025  
**Versão da paleta:** 1.0

