---
version: alpha
name: Boxline
description: Uma apresentação industrial do papelão, da estrutura ao orçamento.
colors:
  primary: "#282b25"
  background: "#f5f4f0"
  surface: "#ebe8e0"
  muted: "#5e6056"
  kraft: "#886337"
  green: "#4a583f"
  error: "#a52e28"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
  technical:
    fontFamily: "ui-monospace, monospace"
rounded:
  DEFAULT: "8px"
  control: "4px"
  button: "5px"
spacing:
  page: "1320px"
  section: "100px"
components:
  button:
    rounded: "5px"
  field:
    rounded: "4px"
---

# Boxline Design System

## Overview

Referência: uma bancada de engenharia de embalagem com luz de estúdio. Site comercial para compradores brasileiros de embalagens, em português do Brasil. A assinatura é a caixa 3D aberta, seguida pelo corte de três camadas ligado à rolagem. A utilidade permanece familiar no formulário. Evitar estética de gráfica, promoções e decorações sem função.
Tokens visuais são mantidos em src/app/globals.css; este documento espelha os valores e suas intenções. Dados comerciais pertencem exclusivamente a src/config/business.ts.

## Colors

Papel off-white, tinta verde quase preta e kraft natural. Verde para contato e foco; vermelho com texto para erros. O CTA final inverte o contraste.

## Typography

Manrope para títulos; DM Sans para leitura e controles. Arial é fallback local. Legendas técnicas usam monospace. Conteúdo e números usam pt-BR.

## Layout

Página de 1320px com margens de 50px no desktop. Grid assimétrico no hero, quatro modelos no catálogo, duas colunas no orçamento. Em 800px, navegação recolhida e orçamento em uma coluna; catálogo em duas. Formulário e página usam rolagem natural. Mídia tem altura reservada.

## Elevation & Depth

Sombras e texturas pertencem à caixa. Cards usam superfícies e divisórias, sem sombras decorativas. WebGL usa iluminação e sombras reais, com substituto CSS quando indisponível.

## Shapes

Controles de 4px, botões de 5px, formulário de 8px. Somente WhatsApp usa círculo.

## Components

Links navegam, botões executam ações. Todos têm hover, foco visível e estado pressionado. Select nativo escolhido por familiaridade móvel; popup pertence ao sistema operacional. Formulário valida localmente, preserva valores e foca primeiro erro. Solicitação abre WhatsApp; mensagem só é enviada pelo usuário. Link alternativo aparece após preparar orçamento.
Movimento: entrada breve, rolagem revelando estrutura e rotação completa em torno do centro da caixa com mouse, arraste por toque ou setas do teclado. A folha começa montada e vista de cima; o scroll inclina e separa as camadas antes de revelar a explicação à direita. No celular, a explicação fica abaixo da imagem. Reduced motion elimina entrada e parallax e mantém camadas separadas. Não há autenticação, envio ao servidor ou pagamento. Dados demonstrativos são sinalizados.

## Do's and Don'ts

- Mostrar materialidade e geometria do produto.
- Preservar legibilidade sem depender de animação.
- Centralizar dados substituíveis em business.ts.
- Não prometer resistência certificada, prazo de fabricação ou capacidade não verificada.

## Novas apresentações comerciais

Faixa contínua de parceiros com nomes provisórios mantidos em business.ts, botão para pausar e versão estática com reduced motion. A seção de postagem apresenta quatro opções iniciais de medidas e preenche o orçamento. Não representa vínculo oficial com os Correios. C × L × A usa uma caixa Three.js com cotas projetadas, proporções ligadas aos valores internos do formulário e destaque por clique ou foco no campo. O corte estrutural ajusta a câmera aos oito extremos da geometria, com margem em toda proporção de tela. Publicação estática em /boxline pelo GitHub Pages; o desenvolvimento local mantém a raiz.
