# Portfólio de Enzo Almeida

Site estático com seis estudos de caso, CSS e JavaScript compartilhados. As capturas são armazenadas localmente e o currículo é um PDF único.

## Desenvolvimento

Requer Node.js 22 e Python para os testes de navegador.

```sh
npm install
npm run build
npm run validate
python -m http.server 8000 --directory dist
```

Acesse http://localhost:8000. O build gera as seis imagens Open Graph em PNG a partir das fontes SVG em `assets/og/` e copia o site para `dist/`. O site entregue ao navegador continua sem dependências JavaScript externas.

Testes: `npx playwright install chromium` e `npm test`. O CI testa desktop e mobile, acessibilidade, rotas, imagens, currículo e orçamento de transferência. A verificação de demonstrações externas gera `demo-report.json` separadamente; uma indisponibilidade externa não reprova o portfólio.

## Publicação

Produção: https://portfolio-enzo-almeida.vercel.app/

A configuração versionada da Vercel aponta para `dist/`. A versão anterior foi publicada manualmente; confira a integração e as permissões de preview antes de publicar. Links antigos `/#estudo-<projeto>` encaminham para páginas individuais quando JavaScript está disponível.

PenteFino é privado e sua capa é ilustrativa, não uma captura do sistema.
