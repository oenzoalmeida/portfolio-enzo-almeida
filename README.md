# Portfólio de Enzo Almeida

Site estático com seis estudos de caso, CSS e JavaScript compartilhados. Capturas documentais locais em `assets/projects/` e currículo em `assets/curriculo-enzo-almeida.pdf`.

Execute `python -m http.server 8000` na raiz. Validação estática: `node scripts/validate-site.mjs`. O CI também executa testes de navegador e acessibilidade. As artes SVG em `assets/og/` são fontes para futuras imagens de compartilhamento PNG.

Produção: https://portfolio-enzo-almeida.vercel.app/

## Publicação

A versão anterior foi publicada por envio de arquivos à Vercel. O README da main informa que o projeto não estava conectado ao GitHub e que previews exigem autenticação. Confira a configuração antes de publicar. Não é necessário build para servir esta versão estática.

Links antigos `/#estudo-<projeto>` são encaminhados para as páginas individuais quando JavaScript está disponível.

As miniaturas da página inicial usam capturas documentais locais, com tratamento visual comum. As imagens de compartilhamento ainda usam as capturas PNG existentes (PenteFino usa a imagem geral até haver PNG próprio). Os testes geram capturas desktop e mobile em `browser-audit`.
