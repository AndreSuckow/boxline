---
version: alpha
name: BoxLyne
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

# BoxLyne Design System

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

Faixa contínua de parceiros com nomes provisórios mantidos em business.ts, movimento contínuo que desacelera a 25% sob o mouse, sem parar, e versão estática com reduced motion. A seção de postagem apresenta quatro opções iniciais de medidas e preenche o orçamento. Não representa vínculo oficial com os Correios. C × L × A usa uma caixa Three.js com cotas projetadas, proporções ligadas aos valores internos do formulário e destaque por clique ou foco no campo. O corte estrutural ajusta a câmera aos oito extremos da geometria, com margem em toda proporção de tela. Publicação estática em /boxline pelo GitHub Pages; o desenvolvimento local mantém a raiz.

Orçamento com vários tipos: um editor para o modelo selecionado, lista de resumos com valores preservados, adicionar e remover por botão. Validar todos os itens e abrir o primeiro erro; reunir cada modelo, medida, quantidade e finalidade em uma mensagem. A ilustração de postagem usa a marca Correios em uma cor, como a referência.

Desempenho: preservar toda rotação, camadas por scroll, faixa contínua e orçamento múltiplo. Carregar WebGL inferior por proximidade; na abertura, ativar a cena principal ao entrar com o mouse, tocar ou após oito segundos. Renderizar a caixa somente quando houver movimento, scroll ou resize. Fontes WOFF2 locais Manrope e DM Sans com métricas de fallback ajustadas; títulos já visíveis no HTML inicial. Revelações, contadores e velocidade da faixa usam APIs nativas. A marca é BoxLyne; /boxline permanece como endereço de publicação.

Textura kraft pré-calculada em WebP sem perdas, preservando o ruído original. Compilar os materiais em etapa separada e usar compileAsync. Fontes com font-display optional evitam troca tardia; no título inicial do celular, usar a métrica estável da fonte de sistema para manter a pintura imediata. Detalhes gráficos de tamanho fixo fora da tela usam content-visibility auto.

## Marca e cobertura comercial

Símbolo da marca: caixa laranja (#f86b2b) baseada na referência fornecida, com topo em losango, haste central e abertura no canto superior direito. BrandLogo.tsx e app/icon.svg mantêm a mesma geometria vetorial e cor; o ícone da aba usa fundo transparente.

Grafia oficial: BoxLyne. O símbolo geométrico e o wordmark são SVG responsivos; manter a versão vetorial como fonte principal. Atendimento atual limitado a Curitiba, Campo Largo e regiões metropolitanas próximas. Não declarar cobertura nacional.

As tampas giram pelas dobras nas bordas das paredes. O enquadramento do corte estrutural inclui a projeção da sombra no chão. As explicações aparecem em ordem 01, 02 e 03 conforme a rolagem. O título da seção seguinte digita somente enquanto visível, com pausa de um segundo após a primeira frase, mantendo o espaço do texto completo e leitura acessível; movimento reduzido exibe o texto imediatamente.

Atualização: removidas a faixa de empresas e a seção “Existe uma caixa certa”. Nossas caixas leva a #correios. Medidas C × L × A em cm, convertidas da referência em mm: 22,5 × 19 × 6; 22 × 14 × 4; 17 × 12,5 × 7,5; 18 × 11,5 × 5. Limites dimensionais PAC/SEDEX consultados em https://www2.correios.com.br/sistemas/precosprazos/Formato.cfm em 28/09/2026; não são modelos oficiais dos Correios. Esta decisão substitui as descrições anteriores das seções removidas.

Ilustrações de postagem em SVG com proporções derivadas de C × L × A, viewBox incluindo todas as faces e margem, centralizadas no cartão e responsivas sem recorte. Substituem as faces CSS 3D e escalas por índice.

Cada cartão de postagem tem quantidade independente, apenas dígitos e validação de inteiro entre 1 e 10.000.000. Orçar esta medida abre WhatsApp com modelo, medidas e quantidade; cada cartão mantém apenas o botão Orçar esta medida, sem link adicional de continuação. Marca Correios usa SVG de proporção explícita, arquivo correios-fit.svg e ajuste meet para evitar recorte e cache do ativo antigo.

Postagem: cartões ordenados por altura crescente (4, 5, 6 e 7,5 cm), mantendo a identificação dos modelos 02, 04, 01 e 03. Imagem, medidas e mensagem de orçamento usam o mesmo modelo; não permutar ilustrações isoladamente.

Preparação comercial: removidos avisos demonstrativos; produção informada pelo cliente superior a 100 mil caixas. Rodapé com © e todos os direitos reservados. Medidas são sempre externas, inclusive no orçamento e WhatsApp. Ilustrações das caixas identificadas como meramente ilustrativas. Orçamento inicia com medidas e quantidade vazias e tipo Sob medida. Contatos e horários preservados.
