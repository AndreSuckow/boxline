# Boxline

Site comercial em Next.js, React, TypeScript, Three.js e GSAP.

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
Fontes são carregadas via Google Fonts com fallback Arial. O site não depende de imagens externas.

## Produção

Execute npm run build e npm start. Antes de publicar, substitua contatos e indicadores e confirme as informações comerciais.

## GitHub Pages

Repositório: https://github.com/AndreSuckow/boxline
Site: https://andresuckow.github.io/boxline/

A workflow em .github/workflows/pages.yml valida tipos e formatação, gera a exportação estática com GITHUB_PAGES=true e publica pelo GitHub Actions. Configure Pages para usar GitHub Actions. Commits na branch main atualizam o site.

Para gerar a mesma versão localmente no PowerShell: $env:GITHUB_PAGES="true"; npm run build. O diretório out contém os arquivos estáticos. O desenvolvimento normal não precisa dessa variável.

Os nomes de empresas e as quatro opções iniciais de postagem estão em src/config/business.ts. O formulário funciona pelo WhatsApp sem servidor. Execute node scripts/interaction-test.mjs e node scripts/enhancements-test.mjs com o servidor local aberto para verificar rotação, camadas, postagem e cotas 3D.
