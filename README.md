# Boxlyne

Site comercial em Next.js, React, TypeScript, Three.js e animações nativas do navegador.

## Executar

Instale Node.js LTS. Execute npm install e npm run dev. Abra http://127.0.0.1:3000.

## Substituir os dados

Edite src/config/business.ts: WhatsApp (país + DDD + número), telefone, e-mail, endereço, horário, resposta comercial, catálogo e indicadores. São demonstrativos. Defina demo: false somente depois de substituir os dados.

O formulário prepara a mensagem e abre WhatsApp. O visitante conclui o envio; o site não envia automaticamente nem salva dados pessoais.

## Validar

Execute npm run typecheck, npm run build, npm run format:check.
Para testes de navegador, execute npx playwright install chromium e npm test.

## Recursos

Caixa 3D com textura procedural, sombra e cursor. Corte ondulado extrudado com separação por rolagem. Fallback CSS para WebGL indisponível, reduced motion, catálogo ligado ao configurador, validação acessível, FAQ e menu móvel.
Fontes WOFF2 são hospedadas localmente, com fallback Arial ajustado pelo Next.js. O site não depende de imagens externas.

## Produção

Execute npm run build e npm start. Antes de publicar, substitua contatos e indicadores e confirme as informações comerciais.

## GitHub Pages

Repositório: https://github.com/AndreSuckow/boxline
Site: https://andresuckow.github.io/boxline/

A workflow em .github/workflows/pages.yml valida tipos e formatação, gera a exportação estática com GITHUB_PAGES=true e publica pelo GitHub Actions. Configure Pages para usar GitHub Actions. Commits na branch main atualizam o site.

Para gerar a mesma versão localmente no PowerShell: $env:GITHUB_PAGES="true"; npm run build. O diretório out contém os arquivos estáticos. O desenvolvimento normal não precisa dessa variável.

Os nomes de empresas e as quatro opções iniciais de postagem estão em src/config/business.ts. O formulário funciona pelo WhatsApp sem servidor. Execute node scripts/interaction-test.mjs e node scripts/enhancements-test.mjs com o servidor local aberto para verificar rotação, camadas, postagem e cotas 3D.

## Desempenho

Execute node scripts/static-preview.mjs após a exportação para conferir a versão de produção. A prévia usa gzip como a hospedagem. Execute node scripts/performance-audit.mjs para gerar os relatórios HTML e JSON em test-results/performance, usando os perfis padrão de celular e desktop do Lighthouse. SITE_URL define o endereço e AUDIT_LABEL identifica a execução. As cenas inferiores carregam perto da tela; a caixa inicial só renderiza durante interação ou mudança de tamanho. Fontes são locais e a animação de rolagem usa IntersectionObserver. O endereço /boxline foi mantido para preservar o link publicado.
