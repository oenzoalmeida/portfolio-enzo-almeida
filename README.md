# Portfólio de Enzo Almeida

Site de apresentação profissional de Enzo Almeida, desenvolvedor de software júnior na Zé Registra e estudante de Ciência da Computação. Contém 14 estudos de caso de projetos pessoais, páginas em português e inglês, CSS e JavaScript compartilhados, capturas locais e currículos nos dois idiomas.

## Desenvolvimento

Requer Node.js 22 e Python para os testes de navegador.

```sh
npm install
npm run build
npm run validate
python -m http.server 8000 --directory dist
```

Acesse http://localhost:8000. O build gera as 14 imagens Open Graph em PNG a partir das fontes SVG em `assets/og/` e copia o site para `dist/`. O site entregue ao navegador continua sem dependências JavaScript externas.

Testes: `npx playwright install chromium` e `npm test`. O CI testa desktop e mobile, acessibilidade, rotas, imagens, currículo e orçamento de transferência. A verificação de demonstrações externas gera `demo-report.json` separadamente; uma indisponibilidade externa não reprova o portfólio.

## Publicação

Produção: https://portfolio-enzo-almeida.vercel.app/

A configuração versionada da Vercel aponta para `dist/`. A versão anterior foi publicada manualmente; confira a integração e as permissões de preview antes de publicar. Links antigos `/#estudo-<projeto>` encaminham para páginas individuais quando JavaScript está disponível.

PenteFino é privado e sua capa é ilustrativa, não uma captura do sistema.

## Diretriz editorial

O portfólio documenta a atuação profissional atual, a formação e os projetos pessoais do autor. Em ambos os idiomas, preserve o vínculo atual com a Zé Registra, diferencie projetos pessoais e experiências independentes da atividade na empresa e evite linguagem que sinalize busca de emprego, disponibilidade para contratação ou intenção de mudança profissional. Os canais de contato servem à apresentação profissional e à troca de experiências. Preserve fatos verificáveis, sem exagerar senioridade ou atribuir projetos pessoais à empresa.


Os estudos complementares usam capturas públicas revisadas quando disponíveis e capas ilustrativas identificadas como tais nos demais casos. Projetos privados não apontam para o repositório nem para ambientes internos. O Passaporte Área 51 permanece fora desta expansão até autorização específica de divulgação.
