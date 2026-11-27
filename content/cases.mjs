// Conteúdo editorial adicional dos 14 estudos de caso. Cada afirmação vem do README
// ou da documentação do repositório correspondente (consultados em 27/11/2026).
// Chaves: ctx (contexto e problema), flow (fluxo), rules (regras de negócio),
// challenges ([desafio, solução]), security, tests, learn, status e avail (disponibilidade).
export const cases = {
pentefino: {
 pt: {
  ctx: 'Conferir PDFs longos à mão significa repetir as mesmas verificações página por página. O PenteFino automatiza a primeira passada e deixa o julgamento final com uma pessoa.',
  flow: ['Cadastro e e-mail verificado','Upload e validação do PDF','Job na fila (PostgreSQL)','Análise pelo Gemini','Validação dos achados','Consulta pelo dono'],
  rules: ['Conta individual, com e-mail verificado antes de qualquer upload.','Apenas PDF com texto nativo, até 20 MB e 200 páginas. A assinatura do arquivo é verificada, não só o tipo declarado.','Estados permitidos: CREATED, QUEUED, PROCESSING e COMPLETED ou FAILED. Cancelamento só antes do processamento.','Severidades: INFO, LOW, MEDIUM, HIGH e CRITICAL. Cada achado traz página, evidência, recomendação e confiança.','O documento original expira em 30 dias. Metadados e resultado permanecem.'],
  challenges: [['Processar em segundo plano sem um broker de mensagens.','Fila em tabela do PostgreSQL com SELECT ... FOR UPDATE SKIP LOCKED, que impede dois workers de pegarem o mesmo job.'],['Jobs abandonados quando o processo reinicia.','Heartbeat por job e varredura periódica que marca como FAILED o que parou de responder.'],['Respostas da IA fora do formato esperado.','Validador estrutural descarta achados inválidos, limita confiança e página e aceita no máximo 100 por auditoria.']],
  security: ['Cada consulta valida o dono. Recurso de outro usuário responde 404, sem revelar que existe.','CSRF de ponta a ponta, rotação de sessão no login e revogação das sessões após troca de senha.','Limite de requisições por IP e por conta em autenticação e criação de auditoria.','Prompt com defesa contra injeção: o texto do documento é tratado como dado. A chave da IA fica fora do repositório e dos logs.'],
  tests: ['Backend com JUnit e MockMvc, incluindo concorrência do worker e o adapter do Gemini contra um servidor HTTP local. Frontend com Vitest e Testing Library, com um fluxo completo pela interface.','Números do README: 91 testes de backend (1 ignorado) e 25 de frontend. Nenhum teste chama a API real do Gemini.'],
  learn: ['Uma fila em banco atende bem um MVP e permite escalar para mais instâncias sem trocar de mecanismo.','Resposta de IA é entrada não confiável: precisa de validação antes de ser gravada.'],
  status: 'MVP funcional de ponta a ponta, em desenvolvimento. O código é privado e não há demonstração pública autorizada. Não processa PDFs sem texto nativo (sem OCR), e o Gemini real ainda precisa de ajuste fino de parsing no uso contínuo.',
  avail: ['Privado','Não divulgada','Disponível','Em desenvolvimento']
 },
 en: {
  ctx: 'Checking long PDFs by hand means repeating the same checks page after page. PenteFino automates the first pass and leaves the final judgment to a person.',
  flow: ['Sign-up and verified e-mail','PDF upload and validation','Queued job (PostgreSQL)','Gemini analysis','Findings validation','Owner review'],
  rules: ['Individual accounts, with a verified e-mail before any upload.','Native-text PDFs only, up to 20 MB and 200 pages. The file signature is checked, not just the declared type.','Allowed states: CREATED, QUEUED, PROCESSING, then COMPLETED or FAILED. Cancellation is possible only before processing.','Severities: INFO, LOW, MEDIUM, HIGH and CRITICAL. Each finding carries page, evidence, recommendation and confidence.','The original document expires after 30 days. Metadata and results remain.'],
  challenges: [['Background processing without a message broker.','A PostgreSQL table used as a queue, with SELECT ... FOR UPDATE SKIP LOCKED so two workers never take the same job.'],['Jobs abandoned when the process restarts.','A heartbeat per job and a periodic sweep that marks unresponsive jobs as FAILED.'],['AI responses outside the expected format.','A structural validator discards invalid findings, bounds confidence and page, and accepts at most 100 per audit.']],
  security: ['Every query checks ownership. Another user\'s resource returns 404, without revealing that it exists.','End-to-end CSRF, session rotation on login and session revocation after a password change.','Per-IP and per-account rate limits on authentication and audit creation.','The prompt defends against injection by treating document text as data. The AI key stays out of the repository and logs.'],
  tests: ['Backend with JUnit and MockMvc, including worker concurrency and the Gemini adapter against a local HTTP server. Frontend with Vitest and Testing Library, including a full flow through the UI.','README figures: 91 backend tests (1 skipped) and 25 frontend tests. No test calls the real Gemini API.'],
  learn: ['A database-backed queue serves an MVP well and scales to more instances without changing the mechanism.','AI output is untrusted input and needs validation before it is stored.'],
  status: 'Working end-to-end MVP, still in development. The code is private and no public demo is authorized. It does not process PDFs without native text (no OCR), and the live Gemini integration may still need parsing adjustments.',
  avail: ['Private','Not published','Available','In development']
 }
},
queueflow: {
 pt: {
  ctx: 'Em balcões de atendimento, o cliente espera sem saber quando será chamado e o atendente chama senhas em telas separadas. O QueueFlow reúne totem, guichê, painel e display numa fila que todos veem atualizada ao mesmo tempo.',
  flow: ['Totem emite a senha','API grava a senha na fila','Atendente chama no guichê','Evento STOMP por WebSocket','Display público atualiza'],
  rules: ['Três perfis: ADMIN configura a operação, ATTENDANT atende e as rotas de totem e display são públicas.','A conta administrativa nasce por bootstrap interno do backend, sem credencial pública.','A política de chamada de senhas é coberta por testes de backend.'],
  challenges: [['Manter várias telas sincronizadas sem recarregar.','WebSocket com STOMP e SockJS para os eventos, e REST para os fluxos convencionais.'],['Não misturar permissões de operador, administrador e público.','Autorização por papel com JWT no backend e rotas públicas restritas a totem e display.'],['Publicar interface e API de forma simples e consistente.','Segundo o README, interface e API são servidas pela mesma origem no Azure App Service.']],
  security: ['Senhas guardadas apenas como hash e JWT com segredo obrigatório no perfil de produção.','Totem e display são públicos por desenho e não coletam dados pessoais de quem é atendido.','Termos de Uso e Política de Privacidade acessíveis a partir do login.'],
  tests: ['Backend com testes de integração e da política de chamada, rodando com ./mvnw test no CI a cada push.','Frontend com Vitest e Testing Library (erros da API, rótulos de status e login). As capturas de tela do repositório saem da suíte E2E.'],
  learn: ['Tempo real pede um desenho de eventos, não só endpoints: definir quais telas ouvem quais eventos simplificou o resto.','Migrações Flyway e E2E tornam a demonstração reproduzível.'],
  status: 'Segundo o README (hospedagem não revalidada): publicada no Azure App Service com PostgreSQL gerenciado (Aiven). Os dados da demonstração podem ser redefinidos. O endereço antigo no Firebase Hosting apenas redireciona.',
  avail: ['Público','Disponível','Disponível','Publicado']
 },
 en: {
  ctx: 'At service counters, customers wait without knowing when they will be called, and attendants call tickets from separate screens. QueueFlow joins kiosk, counter, dashboard and display into one queue that everyone sees updated at the same time.',
  flow: ['Kiosk issues the ticket','API stores it in the queue','Attendant calls it at the counter','STOMP event over WebSocket','Public display updates'],
  rules: ['Three profiles: ADMIN configures operations, ATTENDANT serves, and kiosk and display routes are public.','The administrator account is created by an internal backend bootstrap, with no public credential.','The ticket-calling policy is covered by backend tests.'],
  challenges: [['Keeping several screens in sync without reloading.','WebSocket with STOMP and SockJS for events, and REST for conventional flows.'],['Not mixing operator, administrator and public permissions.','Role-based authorization with JWT on the backend and public routes limited to kiosk and display.'],['Publishing interface and API in a simple, consistent way.','Per the README, interface and API are served from the same origin on Azure App Service.']],
  security: ['Passwords stored only as hashes, and a mandatory JWT secret in the production profile.','Kiosk and display are public by design and collect no personal data from people being served.','Terms of Use and Privacy Policy are reachable from the login page.'],
  tests: ['Backend integration tests and ticket-calling policy tests, run with ./mvnw test in CI on every push.','Frontend tests with Vitest and Testing Library (API errors, status labels and login). The repository screenshots come from the E2E suite.'],
  learn: ['Real time calls for an event design, not just endpoints: deciding which screens listen to which events simplified the rest.','Flyway migrations and E2E tests make the demo reproducible.'],
  status: 'Per the README (hosting not re-verified): published on Azure App Service with managed PostgreSQL (Aiven). Demo data may be reset. The old Firebase Hosting address only redirects.',
  avail: ['Public','Available','Available','Published']
 }
},
conferevision: {
 pt: {
  ctx: 'Conferir à mão se um kit tem todos os itens leva tempo e falha por esquecimento. O ConfereVision compara o que a foto ou o vídeo mostra com a composição esperada do kit.',
  flow: ['Cadastro do kit (item e quantidade)','Envio de foto ou vídeo','Detecção com YOLOX-s (OpenCV)','Comparação com o esperado','Faltas, excessos e histórico'],
  rules: ['Foto JPEG ou PNG até 16 MP e 30 MB, com correção de orientação EXIF.','Vídeo até 30 MB, só os primeiros 15 segundos, com uma amostra por segundo. A aprovação exige as três últimas amostras compatíveis.','Detecção com limiar de confiança 0,45 e 26 categorias disponíveis para compor um kit.','Limite de análises por usuário e de tentativas de login.'],
  challenges: [['Detectar objetos sem serviço de IA pago.','Modelo YOLOX-s ONNX do OpenCV Zoo rodando em CPU no servidor, baixado com verificação de SHA-256.'],['Rodar inferência em hospedagem serverless.','Segundo o README, função Python na Vercel com o modelo embarcado e PostgreSQL persistente no Neon.'],['Não prometer mais do que o modelo entrega.','Faltas e excessos são tratados como indício para revisão. O README documenta um caso em que a colher não foi detectada e outro sem nenhuma detecção.']],
  security: ['Cada usuário só vê seus kits, análises e imagens anotadas, com verificação de titularidade no servidor.','Cadastro público cria apenas usuários comuns. Recuperação de senha por código secreto rotativo.','Segundo o README, a aplicação não inicia em produção sem SECRET_KEY e DATABASE_URL.'],
  tests: ['16 testes de aplicação e segurança (python manage.py test core) e testes de visão com fluxo geométrico, segundo o README.','Os exemplos do repositório são pontuais e não representam uma medida de precisão.'],
  learn: ['A parte difícil de visão computacional em produto é comunicar a incerteza ao usuário.','Separar o pipeline de detecção (vision.py, detector.py) da camada Django facilitou testar cada parte.'],
  status: 'Aplicação publicada e com endpoint de saúde. Não há validação de precisão para uso comercial. A detecção depende das classes reconhecidas pelo modelo.',
  avail: ['Público','Disponível','Disponível','Publicado']
 },
 en: {
  ctx: 'Checking by hand whether a kit has every item takes time and fails through oversight. ConfereVision compares what a photo or video shows with the kit\'s expected composition.',
  flow: ['Kit setup (item and quantity)','Photo or video upload','Detection with YOLOX-s (OpenCV)','Comparison with expected','Missing and extra items, history'],
  rules: ['JPEG or PNG photos up to 16 MP and 30 MB, with EXIF orientation fix.','Video up to 30 MB, first 15 seconds only, one sample per second. Approval requires the last three samples to match.','Detection with a 0.45 confidence threshold and 26 categories available to compose a kit.','Per-user analysis limit and login attempt limit.'],
  challenges: [['Detecting objects without a paid AI service.','A YOLOX-s ONNX model from OpenCV Zoo running on CPU on the server, downloaded with SHA-256 verification.'],['Running inference on serverless hosting.','Per the README, a Python function on Vercel with the embedded model and persistent PostgreSQL on Neon.'],['Not promising more than the model delivers.','Missing and extra items are treated as hints for review. The README documents a case where the spoon was not detected and another with no detection at all.']],
  security: ['Each user sees only their own kits, analyses and annotated images, with ownership checks on the server.','Public sign-up creates regular users only. Password recovery uses a rotating secret code.','Per the README, the app refuses to start in production without SECRET_KEY and DATABASE_URL.'],
  tests: ['16 application and security tests (python manage.py test core) and vision tests with a geometric flow, per the README.','The repository examples are spot checks and do not measure accuracy.'],
  learn: ['The hard part of computer vision in a product is communicating uncertainty to the user.','Separating the detection pipeline (vision.py, detector.py) from the Django layer made each part easier to test.'],
  status: 'Published, with a health endpoint. Accuracy has not been validated for commercial use. Detection depends on the classes the model recognizes.',
  avail: ['Public','Available','Available','Published']
 }
},
eventpass: {
 pt: {
  ctx: 'Organizadores de eventos pequenos controlam inscrições e presença em planilhas e listas de papel. O EventPass cobre o caminho completo: publicar o evento, inscrever, emitir ingresso com QR Code e validar a presença no celular.',
  flow: ['Organizador publica o evento','Participante se inscreve','Ingresso com QR Code','Check-in pela câmera','Pontos e ranking'],
  rules: ['Uma inscrição por participante em cada evento, com controle de vagas.','Um check-in por inscrição e um lançamento de pontos por check-in. Pontos só existem após check-in válido.','Evento passa por rascunho, publicado e encerrado. Só rascunho sem inscrições pode ser excluído.','Cancelamento libera a vaga, mas só antes do check-in.'],
  challenges: [['Vagas e check-ins simultâneos sem corrida.','Inscrição e check-in rodam em transação BEGIN IMMEDIATE, e as regras críticas também são constraints do banco (UNIQUE por evento e participante).'],['Validar no cliente e no servidor sem duplicar regras.','Schemas Zod num pacote compartilhado usados pelo formulário e pela API.'],['Ingresso sem e-mail.','O link do ingresso é a única forma de acesso, e a página orienta guardá-lo. A recuperação por e-mail ficou como etapa futura.']],
  security: ['Painel administrativo com sessão segura, senhas com scrypt e limite de 10 tentativas por 15 minutos por IP.','Ranking com nomes abreviados e limite de requisições na inscrição.','Segundo o README, a câmera do check-in exige HTTPS e o cookie de sessão é Secure em produção.'],
  tests: ['Vitest na API e no frontend, incluindo teste de concorrência. O CI roda typecheck, lint com regras de acessibilidade (jsx-a11y), testes e build em cada pull request.'],
  learn: ['Constraints no banco são a última linha de defesa das regras de negócio.','Uma página de demonstração com dados fictícios no navegador mostra o fluxo mesmo sem eventos abertos.'],
  status: 'Segundo o README (hospedagem não revalidada): publicado em servidor próprio com SQLite. Há uma variante em homologação com PostgreSQL (Neon) e Netlify Functions, documentada à parte e fora desta página. Ingressos por e-mail não existem.',
  avail: ['Público','Disponível','Disponível','Publicado']
 },
 en: {
  ctx: 'Small event organizers track sign-ups and attendance on spreadsheets and paper lists. EventPass covers the whole path: publish the event, register people, issue a QR ticket and validate attendance on a phone.',
  flow: ['Organizer publishes the event','Attendee registers','Ticket with QR code','Camera check-in','Points and ranking'],
  rules: ['One registration per attendee per event, with seat limits.','One check-in per registration and one points entry per check-in. Points exist only after a valid check-in.','Events move through draft, published and closed. Only a draft with no registrations can be deleted.','Cancelling frees the seat, but only before check-in.'],
  challenges: [['Simultaneous registrations and check-ins without races.','Registration and check-in run in BEGIN IMMEDIATE transactions, and critical rules are also database constraints (UNIQUE per event and attendee).'],['Validating on client and server without duplicating rules.','Zod schemas in a shared package used by both the form and the API.'],['Tickets without e-mail.','The ticket link is the only way in, and the page tells people to keep it. E-mail recovery was left as a future step.']],
  security: ['Admin panel with secure sessions, scrypt passwords and a limit of 10 attempts per 15 minutes per IP.','Leaderboard with abbreviated names and rate limiting on registration.','Per the README, the check-in camera requires HTTPS and the session cookie is Secure in production.'],
  tests: ['Vitest on the API and frontend, including a concurrency test. CI runs typecheck, lint with accessibility rules (jsx-a11y), tests and build on every pull request.'],
  learn: ['Database constraints are the last line of defense for business rules.','A demo page with fictitious in-browser data shows the flow even when no events are open.'],
  status: 'Per the README (hosting not re-verified): published on a dedicated server with SQLite. A PostgreSQL (Neon) and Netlify Functions variant is in staging, documented separately and out of scope here. E-mailed tickets do not exist.',
  avail: ['Public','Available','Available','Published']
 }
},
pratoja: {
 pt: {
  ctx: 'Restaurantes pequenos dependem de apps de entrega que cobram comissão e escondem a identidade da loja. O PratoJá é uma base de cardápio digital e pedidos em que cada loja configura a própria marca, horários e taxa de entrega.',
  flow: ['Cardápio da loja','Monte seu prato','Sacola com taxa de entrega','Checkout (entrega ou retirada)','Acompanhamento do status','Painel da loja'],
  rules: ['Cada loja vive em /loja/{slug}. Operação (categorias, produtos, grupos de opções, pedidos) carrega store_id.','Três perfis: CUSTOMER, STORE_ADMIN e PLATFORM_ADMIN, este último com painel /platform para criar lojas e administradores.','Pagamentos PIX, cartão e dinheiro são simulados. Não há cobrança real.'],
  challenges: [['Várias lojas no mesmo sistema sem vazar dados.','Toda consulta é escopada por loja (findByIdAndStore_Id). Objeto de outra loja responde 404.'],['Pratos com opções e adicionais.','Grupos de opções por produto e uma tela "Monte seu prato" que alimenta a sacola.'],['Mudar identidade da loja sem deploy.','Configuração visual e operacional guardada no banco e editada no painel.']],
  security: ['Isolamento lógico por store_id, não banco separado por loja.','Exclusão de conta pela interface: dados pessoais apagados e histórico anonimizado.','Segundo o README, modo demo desligado por padrão, inclusive em produção.'],
  tests: ['Testes de fluxo automatizados executados pelo GitHub Actions a cada push.'],
  learn: ['Multitenancy lógico exige disciplina em todas as consultas. Um teste por fluxo evita esquecer um escopo.','Monólito com Thymeleaf entrega rápido o que o projeto precisa, sem separar frontend.'],
  status: 'Segundo o README (hospedagem não revalidada): demonstração publicada em servidor na AWS (Lightsail). As imagens de pratos da demo foram geradas por IA e servem só como ilustração. Os pagamentos são simulados.',
  avail: ['Público','Disponível','Disponível','Publicado']
 },
 en: {
  ctx: 'Small restaurants rely on delivery apps that charge commission and hide the store\'s identity. PratoJá is a digital menu and ordering base where each store configures its own brand, hours and delivery fee.',
  flow: ['Store menu','Build your dish','Cart with delivery fee','Checkout (delivery or pickup)','Status tracking','Store dashboard'],
  rules: ['Each store lives at /loja/{slug}. Operational data (categories, products, option groups, orders) carries store_id.','Three profiles: CUSTOMER, STORE_ADMIN and PLATFORM_ADMIN, the last with a /platform panel to create stores and administrators.','PIX, card and cash payments are simulated. There are no real charges.'],
  challenges: [['Several stores in one system without leaking data.','Every query is scoped by store (findByIdAndStore_Id). An object from another store returns 404.'],['Dishes with options and extras.','Option groups per product and a "Build your dish" screen that feeds the cart.'],['Changing a store\'s identity without a deploy.','Visual and operational settings stored in the database and edited in the dashboard.']],
  security: ['Logical isolation by store_id, not a separate database per store.','Account deletion from the UI: personal data erased and history anonymized.','Per the README, demo mode is off by default, including in production.'],
  tests: ['Automated flow tests run by GitHub Actions on every push.'],
  learn: ['Logical multitenancy demands discipline in every query. One test per flow keeps a scope from being forgotten.','A Thymeleaf monolith delivers what the project needs quickly, without a separate frontend.'],
  status: 'Per the README (hosting not re-verified): demo published on an AWS server (Lightsail). The dish images in the demo were AI-generated and are illustrative only. Payments are simulated.',
  avail: ['Public','Available','Available','Published']
 }
},
autociclo: {
 pt: {
  ctx: 'Manutenção de veículo costuma viver em notas soltas e na memória. O AutoCiclo organiza revisões, quilometragem, gastos e documentos como um prontuário por veículo.',
  flow: ['Cadastro do veículo','Quilometragem e manutenções','Alertas de vencimento','Histórico e gastos','Relatório imprimível'],
  rules: ['Vários veículos por conta, com arquivar e excluir.','Redução de quilometragem pede confirmação e fica no histórico.','Vencimento mensal preserva o ajuste de calendário do JavaScript: 31/01 mais um mês cai em março quando fevereiro não tem o dia.','O AutoCiclo Score (0 a 100) mede organização das manutenções cadastradas. Não é diagnóstico mecânico.','Manutenções antigas sem vínculo ficam separadas do total, sem apagar nem vincular automaticamente.'],
  challenges: [['Isolar dados de cada usuário.','Row Level Security no PostgreSQL do Supabase e políticas próprias no Storage.'],['Gasto contado duas vezes quando manutenção e despesa se sobrepunham.','Correção que mantém manutenções antigas fora do total, sem perder registros.'],['Exportar o histórico completo de forma consistente.','Ajuste da exportação para incluir todos os itens do histórico.']],
  security: ['RLS no banco, perfis cliente e admin e arquivos em storage privado.','A service role key nunca é usada no frontend.','O painel administrativo é de uso interno do autor.'],
  tests: ['Testes unitários com Vitest executados no CI. Os dados do aplicativo exigem conexão: não há modo offline.'],
  learn: ['Política de acesso no banco reduz o que o frontend precisa acertar.','Cálculo de datas tem casos de borda que merecem teste próprio.'],
  status: 'Segundo o README (hospedagem não revalidada): publicado em planos gratuitos (Vercel e Supabase). O primeiro acesso pode ser lento e os dados de demonstração podem ser removidos. PWA instalável.',
  avail: ['Público','Disponível','Disponível','Publicado']
 },
 en: {
  ctx: 'Vehicle maintenance usually lives in loose receipts and memory. AutoCiclo organizes services, mileage, expenses and documents as a record per vehicle.',
  flow: ['Vehicle setup','Mileage and maintenance','Due-date alerts','History and expenses','Printable report'],
  rules: ['Several vehicles per account, with archive and delete.','Lowering mileage asks for confirmation and stays in the history.','Monthly due dates keep JavaScript\'s calendar rollover: Jan 31 plus one month lands in March when February lacks the day.','The AutoCiclo Score (0 to 100) measures how organized the recorded maintenance is. It is not a mechanical diagnosis.','Old unlinked maintenance records stay separate from the total, without being deleted or auto-linked.'],
  challenges: [['Isolating each user\'s data.','Row Level Security on Supabase PostgreSQL and dedicated Storage policies.'],['Expenses counted twice when maintenance and costs overlapped.','A fix that keeps old maintenance out of the total without losing records.'],['Exporting the full history consistently.','Export adjusted to include every history item.']],
  security: ['Database RLS, client and admin profiles, and private file storage.','The service role key is never used on the frontend.','The administration panel is for the author\'s internal use.'],
  tests: ['Unit tests with Vitest run in CI. App data requires a connection: there is no offline mode.'],
  learn: ['Access policies in the database reduce what the frontend must get right.','Date arithmetic has edge cases that deserve their own tests.'],
  status: 'Per the README (hosting not re-verified): published on free plans (Vercel and Supabase). The first load may be slow and demo data may be removed. Installable PWA.',
  avail: ['Public','Available','Available','Published']
 }
},
mountrack: {
 pt: {
  ctx: 'Quem registra peso, medidas e sintomas precisa de uma ferramenta que guarde dados sensíveis com cuidado. O MounTrack é um registro pessoal, sem análise ou recomendação.',
  flow: ['Cadastro com consentimento','Registros do usuário','Gráfico e relatório','Exportação JSON','Exclusão de dados ou da conta'],
  rules: ['Só entram dados digitados pelo usuário. O sistema não calcula nem sugere doses.','Consentimento de dados de saúde separado do aceite dos Termos, com data e versão registradas no servidor. Público adulto (18+).','O painel administrativo mostra cadastro e status, sem rota para registros de saúde.'],
  challenges: [['Limitar o acesso do administrador a dados de saúde.','Painel separado, sem rotas para registros de saúde.'],['Funcionar como PWA sem frameworks.','HTML, CSS e JavaScript puros com service worker que guarda a interface em cache.'],['Ser claro sobre o que a proteção cobre.','O README informa que o isolamento é lógico e que não há criptografia de coluna em repouso.']],
  security: ['Senhas com bcrypt (custo 12) e sessão por cookie HttpOnly.','Consultas parametrizadas e limite de tentativas por IP na autenticação.','Sem analytics e sem cookies além do de sessão.'],
  tests: ['Testes de backend com node --test: troca obrigatória de senha, revogação de conta, versão dos dados, configuração do banco, consentimento de privacidade e mesma origem. Também há testes de cache de autenticação e de entrada decimal. Existência confirmada pela listagem do repositório; os testes não foram executados nesta auditoria.'],
  learn: ['Privacidade começa pelo que o sistema decide não expor, inclusive para o administrador.','Documentar o que a segurança não cobre é parte do trabalho.'],
  status: 'Projeto de portfólio. Segundo o README (hospedagem não revalidada): frontend no Firebase Hosting, API na Vercel e PostgreSQL no Neon. Login e sincronização exigem conexão. Não substitui acompanhamento médico.',
  avail: ['Privado','Existe, divulgação pública não validada','Disponível','Publicado']
 },
 en: {
  ctx: 'People who log weight, measurements and symptoms need a tool that treats sensitive data with care. MounTrack is a personal log, with no analysis or recommendations.',
  flow: ['Sign-up with consent','User entries','Chart and report','JSON export','Delete data or account'],
  rules: ['Only data typed by the user goes in. The system does not calculate or suggest doses.','Health-data consent is separate from accepting the Terms, with date and version recorded on the server. Adults only (18+).','The admin panel shows registration and status, with no route to health records.'],
  challenges: [['Limiting the administrator\'s access to health data.','A separate panel with no routes to health records.'],['Working as a PWA without frameworks.','Plain HTML, CSS and JavaScript with a service worker that caches the interface.'],['Being clear about what the protection covers.','The README states that isolation is logical and that there is no column-level encryption at rest.']],
  security: ['bcrypt passwords (cost 12) and HttpOnly cookie sessions.','Parameterized queries and per-IP attempt limits on authentication.','No analytics and no cookies beyond the session cookie.'],
  tests: ['Backend tests with node --test: forced password change, account revocation, data versioning, database configuration, privacy consent and same-origin checks. There are also tests for the authentication cache and decimal input. Existence confirmed from the repository file listing; the tests were not run in this audit.'],
  learn: ['Privacy starts with what the system chooses not to expose, including to the administrator.','Documenting what the security does not cover is part of the work.'],
  status: 'Portfolio project. Per the README (hosting not re-verified): frontend on Firebase Hosting, API on Vercel and PostgreSQL on Neon. Login and sync need a connection. It does not replace medical care.',
  avail: ['Private','Exists, public listing not cleared','Available','Published']
 }
},
'dona-joana': {
 pt: {
  ctx: 'Uma marmitaria local precisava receber pedidos e cobrar por Pix sem conferir comprovantes manualmente. O app cobre catálogo, carrinho, checkout com Pix dinâmico e acompanhamento do pedido.',
  flow: ['Catálogo','Carrinho','Checkout com Pix dinâmico (Asaas)','Confirmação','Acompanhamento do pedido'],
  rules: ['Pix gerado pela integração com o Asaas no checkout.','Dados do negócio só saem da API com autenticação.'],
  challenges: [['Usar a mesma base no celular e na web.','App Expo e React Native com versão web publicada.'],['Manter segredos fora do código.','Credenciais do Asaas, JWT, Resend e MongoDB lidas apenas de variáveis de ambiente.']],
  security: ['Nenhum segredo é versionado.','A API não expõe dados do negócio sem autenticação.'],
  tests: ['Suíte pytest no backend com 18 arquivos test_*.py: pagamento Pix com mock do Asaas, segurança, CORS, backup, área de entrega, pedidos, cardápio e painel. Existência confirmada pela listagem do repositório; os testes não foram executados nesta auditoria.'],
  learn: ['Pagamento por Pix dinâmico exige tratar o ciclo do pedido, não só gerar o código.','Documentar o produto (PRD e pacotes) ajudou a manter o escopo do app.'],
  status: 'Projeto complementar com código privado: aplicação Expo e React Native, API FastAPI e MongoDB. Os dados do negócio não são divulgados.',
  avail: ['Privado','Existe, divulgação pública não validada','Disponível','Publicado']
 },
 en: {
  ctx: 'A local lunchbox shop needed to take orders and charge by Pix without checking receipts by hand. The app covers catalog, cart, dynamic Pix checkout and order tracking.',
  flow: ['Catalog','Cart','Dynamic Pix checkout (Asaas)','Confirmation','Order tracking'],
  rules: ['Pix is generated through the Asaas integration at checkout.','Business data leaves the API only with authentication.'],
  challenges: [['Using one codebase on mobile and web.','Expo and React Native app with a published web version.'],['Keeping secrets out of the code.','Asaas, JWT, Resend and MongoDB credentials are read only from environment variables.']],
  security: ['No secret is versioned.','The API does not expose business data without authentication.'],
  tests: ['Backend pytest suite with 18 test_*.py files: Pix payment against an Asaas mock, security, CORS, backup, delivery area, orders, menu and dashboard. Existence confirmed from the repository file listing; the tests were not run in this audit.'],
  learn: ['Dynamic Pix payment requires handling the order lifecycle, not just generating the code.','Product documentation (PRD and packages) helped keep the app\'s scope.'],
  status: 'Complementary project with private code: Expo and React Native app, FastAPI API and MongoDB. Business data is not disclosed.',
  avail: ['Private','Exists, public listing not cleared','Available','Published']
 }
},
cofre: {
 pt: {
  ctx: 'Credenciais de projetos e contas pessoais acabam em planilhas e anotações. O Cofre guarda segredos cifrados e registra cada visualização.',
  flow: ['Login (cadastro fechado)','Projetos e Pessoal','Segredo mascarado','Revelar ou copiar','Evento de auditoria'],
  rules: ['A primeira conta só vira administradora se o e-mail bater com INITIAL_ADMIN_EMAIL.','Credenciais privadas ficam com o dono e os administradores. Compartilhamento respeita concessões individuais.','Senha temporária bloqueia o cofre até a troca confirmada.','O último administrador não pode ser removido nem rebaixado.'],
  challenges: [['Nunca guardar segredo em texto puro.','Cifra AES-256-GCM no servidor, com chave mestra independente do segredo de autenticação e versionada (VAULT_MASTER_KEY_Vn).'],['Auditar sem perder consistência.','A alteração e o evento de auditoria são gravados na mesma transação.'],['Proteger login e conta.','Rate limiting em /sign-in/email, MFA/TOTP opcional com códigos de recuperação e revogação de sessões ao trocar senha.']],
  security: ['A chave mestra nunca vai ao frontend, a logs, URLs ou commits.','Cadastro público fechado, com usuários provisionados internamente.','Visualização e cópia de segredos geram trilha de auditoria.'],
  tests: ['Cinco arquivos de teste em scripts/: backup do banco, verificação de marca, veredito do smoke de navegador, invariante de autenticação e plugin PWA. Existência confirmada pela listagem do repositório; os testes não foram executados nesta auditoria. Este estudo não afirma cobertura total.'],
  learn: ['Segurança de cofre é mais política de acesso e auditoria do que criptografia isolada.','Transação única para dado e auditoria evita trilha incompleta.'],
  status: 'Uso pessoal, com código privado e sem cadastro público. Esta apresentação não constitui certificação nem auditoria independente de segurança. Os registros do cofre nunca aparecem aqui.',
  avail: ['Privado','Não divulgada','Disponível','Em uso pessoal']
 },
 en: {
  ctx: 'Project and personal credentials end up in spreadsheets and notes. Cofre stores encrypted secrets and logs every view.',
  flow: ['Login (sign-up closed)','Projects and Personal','Masked secret','Reveal or copy','Audit event'],
  rules: ['The first account becomes administrator only if the e-mail matches INITIAL_ADMIN_EMAIL.','Private credentials stay with the owner and administrators. Sharing respects individual grants.','A temporary password blocks the vault until a confirmed change.','The last administrator cannot be removed or demoted.'],
  challenges: [['Never storing a secret in plain text.','AES-256-GCM encryption on the server, with a master key independent of the auth secret and versioned (VAULT_MASTER_KEY_Vn).'],['Auditing without losing consistency.','The change and its audit event are written in the same transaction.'],['Protecting login and account.','Rate limiting on /sign-in/email, optional MFA/TOTP with recovery codes, and session revocation on password change.']],
  security: ['The master key never reaches the frontend, logs, URLs or commits.','Public sign-up is closed, with users provisioned internally.','Viewing and copying secrets produces an audit trail.'],
  tests: ['Five test files in scripts/: database backup, brand check, browser smoke verdict, authentication invariant and PWA plugin. Existence confirmed from the repository file listing; the tests were not run in this audit. This case study does not claim full coverage.'],
  learn: ['Vault security is more about access policy and auditing than isolated encryption.','A single transaction for data and audit avoids an incomplete trail.'],
  status: 'Personal use, with private code and no public sign-up. This presentation is not a certification or independent security audit. Vault records never appear here.',
  avail: ['Private','Not published','Available','Personal use']
 }
},
taskflow: {
 pt: {
  ctx: 'Projeto para praticar autenticação, isolamento de dados por usuário e publicação em nuvem com um problema familiar: listas de tarefas.',
  flow: ['Cadastro e login','Tarefas do usuário','Filtros e progresso','Painel administrativo'],
  rules: ['Cada usuário vê só as próprias tarefas.','Administrador vê estatísticas e ativa ou desativa contas, sem acesso ao conteúdo das tarefas.','A exclusão da conta apaga usuário e tarefas definitivamente.'],
  challenges: [['Garantir isolamento entre usuários.','Consultas filtradas pelo usuário autenticado, com testes de regressão de segurança no CI.'],['Trocar senha temporária com segurança.','Troca obrigatória na primeira entrada, coberta por testes do backend.']],
  security: ['Senhas com bcrypt (custo 12) e sessão JWT em cookie HttpOnly e Secure.','CORS restrito ao domínio do frontend e consultas parametrizadas.','Sem analytics nem cookies de terceiros.'],
  tests: ['O CI executa testes do backend com PostgreSQL 16: regressões de segurança, limitador de autenticação, troca de senha, CRUD de tarefas e isolamento entre usuários.'],
  learn: ['Um projeto pequeno é um bom espaço para praticar segurança de verdade.'],
  status: 'Segundo o README (hospedagem e disponibilidade não revalidadas): frontend no Firebase Hosting, backend serverless na Vercel e PostgreSQL no Neon. O README informa que o acesso de demonstração está temporariamente indisponível.',
  avail: ['Público','Aplicação no ar, sem conta demo','Disponível','Publicado']
 },
 en: {
  ctx: 'A project to practice authentication, per-user data isolation and cloud deployment with a familiar problem: task lists.',
  flow: ['Sign-up and login','User tasks','Filters and progress','Admin panel'],
  rules: ['Each user sees only their own tasks.','The administrator sees statistics and activates or deactivates accounts, with no access to task content.','Deleting an account permanently removes the user and tasks.'],
  challenges: [['Guaranteeing isolation between users.','Queries filtered by the authenticated user, with security regression tests in CI.'],['Changing a temporary password safely.','A mandatory change on first login, covered by backend tests.']],
  security: ['bcrypt passwords (cost 12) and JWT sessions in HttpOnly, Secure cookies.','CORS restricted to the frontend domain and parameterized queries.','No analytics or third-party cookies.'],
  tests: ['CI runs backend tests with PostgreSQL 16: security regressions, authentication rate limiter, password change, task CRUD and user isolation.'],
  learn: ['A small project is a good place to practice real security.'],
  status: 'Per the README (hosting and availability not re-verified): frontend on Firebase Hosting, serverless backend on Vercel and PostgreSQL on Neon. The README states that the demo login is temporarily unavailable.',
  avail: ['Public','App online, no demo account','Available','Published']
 }
},
devjourney: {
 pt: {
  ctx: 'Protótipo de jogo educativo para aprender tecnologia em missões curtas, com um laboratório de terminal guiado.',
  flow: ['Escolher missão','Desafio em etapas','Terminal simulado','XP e progresso local'],
  rules: ['Cinco missões com desafios em etapas e pontuação em XP.','O laboratório usa comandos simulados. Nada executa no sistema nem roda Python ou SQL real.'],
  challenges: [['Ensinar linha de comando sem risco.','Terminal simulado, que valida respostas sem executar comandos.'],['Manter o protótipo simples.','Sem dependências externas, backend ou conta: progresso salvo em localStorage.']],
  security: ['Nenhum dado sai do navegador: o progresso fica no armazenamento local.'],
  tests: ['Cinco scripts de teste em Node (tests, tests-code, tests-languages, tests-selfhost e audit-tests). Existência confirmada pela listagem do repositório; os testes não foram executados nesta auditoria. O README lista a revisão funcional e de acessibilidade no navegador como pendência.'],
  learn: ['Simular o ambiente permite ensinar sem expor o usuário a execução arbitrária.'],
  status: 'Protótipo v0.5 em desenvolvimento, com código privado. Sem sincronização entre dispositivos. Evoluir para execução real exigiria ambientes isolados.',
  avail: ['Privado','Não divulgada','Disponível','Protótipo em desenvolvimento']
 },
 en: {
  ctx: 'An educational game prototype for learning technology through short missions, with a guided terminal lab.',
  flow: ['Pick a mission','Step-by-step challenge','Simulated terminal','XP and local progress'],
  rules: ['Five missions with step-by-step challenges and XP scoring.','The lab uses simulated commands. Nothing runs on the system and no real Python or SQL executes.'],
  challenges: [['Teaching the command line without risk.','A simulated terminal that checks answers without executing commands.'],['Keeping the prototype simple.','No external dependencies, backend or account: progress is saved in localStorage.']],
  security: ['No data leaves the browser: progress stays in local storage.'],
  tests: ['Five Node test scripts (tests, tests-code, tests-languages, tests-selfhost and audit-tests). Existence confirmed from the repository file listing; the tests were not run in this audit. The README lists a functional and accessibility review in the browser as pending.'],
  learn: ['Simulating the environment lets you teach without exposing users to arbitrary execution.'],
  status: 'Prototype v0.5 in development, with private code. No sync across devices. Moving to real execution would require isolated environments.',
  avail: ['Private','Not published','Available','Prototype in development']
 }
},
'sistema-estoque': {
 pt: {
  ctx: 'Um dos primeiros projetos da faculdade de Ciência da Computação: um sistema de estoque no terminal, com orientação a objetos e validações. Em 2026 ganhou uma versão web sobre as mesmas regras.',
  flow: ['Cadastro do produto','Entrada ou saída','Movimentação registrada','Painel e filtros'],
  rules: ['Toda movimentação exige quantidade inteira maior que zero, e a saída nunca passa do estoque.','Não há produto com nome duplicado, e valores negativos são rejeitados.','Valor em estoque é quantidade vezes preço.','Na web, a quantidade só muda por movimentação, e o histórico é imutável (regras do Firestore proíbem editar ou excluir).'],
  challenges: [['Levar um programa de terminal para a web sem mudar as regras.','Motor puro em JavaScript (model.js) separado da interface e do Firestore.'],['Preservar histórico ao excluir produtos.','O nome do produto fica denormalizado em cada movimentação.']],
  security: ['Autenticação anônima do Firebase e regras do Firestore que impedem alterar movimentações.'],
  tests: ['Testes com node --test: motor de regras (model.test.mjs), transação de movimentação, regras do Firestore e emulador, além de um teste em Python (tests/test_estoque.py). Existência confirmada pela listagem do repositório; os testes não foram executados nesta auditoria.'],
  learn: ['Separar regra de negócio da interface permitiu reaproveitar a lógica em outro ambiente.'],
  status: 'Projeto acadêmico preservado e evoluído. Código público, com a versão original em Python e a web, que segundo o README está no Firebase Hosting (não revalidado).',
  avail: ['Público','Disponível','Disponível','Concluído']
 },
 en: {
  ctx: 'One of the first projects of the Computer Science degree: a terminal inventory system with object orientation and validation. In 2026 it gained a web version on the same rules.',
  flow: ['Product setup','Stock in or out','Movement recorded','Dashboard and filters'],
  rules: ['Every movement needs a whole quantity above zero, and stock out never exceeds stock.','No duplicate product names, and negative values are rejected.','Stock value is quantity times price.','On the web, quantity changes only through movements, and history is immutable (Firestore rules forbid editing or deleting).'],
  challenges: [['Moving a terminal program to the web without changing the rules.','A pure JavaScript engine (model.js) separated from the UI and Firestore.'],['Keeping history when products are deleted.','The product name is denormalized in each movement.']],
  security: ['Firebase anonymous authentication and Firestore rules that prevent altering movements.'],
  tests: ['Tests with node --test: rule engine (model.test.mjs), movement transaction, Firestore rules and emulator, plus a Python test (tests/test_estoque.py). Existence confirmed from the repository file listing; the tests were not run in this audit.'],
  learn: ['Separating business rules from the interface allowed reusing the logic in another environment.'],
  status: 'Academic project preserved and evolved. Public code, with the original Python version and the web version, which per the README is on Firebase Hosting (not re-verified).',
  avail: ['Public','Available','Available','Completed']
 }
},
'consumo-energia': {
 pt: {
  ctx: 'Evolução de um projeto acadêmico de cálculo de consumo. O usuário informa aparelhos e tarifa, e o sistema estima consumo, custo e projeção anual.',
  flow: ['Aparelhos e tarifa','Cálculo em kWh','Custo mensal e anual','Maior consumidor'],
  rules: ['Consumo mensal em kWh a partir de potência, horas e dias de uso.','Um cenário por conta, salvo por usuário, com versionamento otimista.','Administrador lista contas e ativa ou desativa, sem acesso à simulação.'],
  challenges: [['Evitar que duas abas sobrescrevam o cenário.','Versionamento otimista no backend, coberto por testes.'],['Guardar senha com segurança.','Hash scrypt com sal aleatório e comparação em tempo constante.']],
  security: ['Sessão JWT em cookie HttpOnly, Secure e SameSite, CORS restrito e consultas parametrizadas.','Exclusão definitiva da conta pela interface.'],
  tests: ['O CI executa testes das regras de cálculo do frontend e, no backend com PostgreSQL 16, testes de segurança, limitador, troca de senha e versionamento otimista.'],
  learn: ['Cálculo puro e testável deixa a interface fina.'],
  status: 'Projeto acadêmico evoluído. Segundo o README (hospedagem e disponibilidade não revalidadas): frontend no Firebase Hosting, backend na Vercel e PostgreSQL no Neon. O README informa que a conta de demonstração está temporariamente indisponível.',
  avail: ['Público','Aplicação no ar, sem conta demo','Disponível','Publicado']
 },
 en: {
  ctx: 'An evolution of an academic energy-use project. Users enter appliances and tariff, and the system estimates consumption, cost and an annual projection.',
  flow: ['Appliances and tariff','kWh calculation','Monthly and annual cost','Top consumer'],
  rules: ['Monthly kWh from power, hours and days of use.','One scenario per account, saved per user, with optimistic versioning.','The administrator lists accounts and activates or deactivates them, with no access to the simulation.'],
  challenges: [['Preventing two tabs from overwriting the scenario.','Optimistic versioning on the backend, covered by tests.'],['Storing passwords safely.','scrypt hashes with random salt and constant-time comparison.']],
  security: ['JWT sessions in HttpOnly, Secure, SameSite cookies, restricted CORS and parameterized queries.','Permanent account deletion from the interface.'],
  tests: ['CI runs frontend calculation tests and, on the backend with PostgreSQL 16, security, rate limiter, password change and optimistic versioning tests.'],
  learn: ['Pure, testable calculation keeps the interface thin.'],
  status: 'Academic project evolved. Per the README (hosting and availability not re-verified): frontend on Firebase Hosting, backend on Vercel and PostgreSQL on Neon. The README states that the demo account is temporarily unavailable.',
  avail: ['Public','App online, no demo account','Available','Published']
 }
},
'calculadora-python': {
 pt: {
  ctx: 'Um dos primeiros projetos da faculdade: calculadora de desktop em Python com Tkinter. Em 2026 ganhou uma versão web com a mesma lógica.',
  flow: ['Entrada (teclado ou botões)','Avaliação encadeada','Resultado ou erro explícito','Histórico e memória'],
  rules: ['Avaliação encadeada ao trocar de operador.','Divisão por zero é erro explícito, e a vírgula é o separador decimal.','Memória M+, M−, MR e MC, e histórico dos últimos cálculos.','A versão Python mostra até dez casas decimais e a web até doze dígitos significativos, por decisão de produto.'],
  challenges: [['Manter o comportamento do original na web.','A versão web preserva a semântica do original e o mesmo mapa de teclas.']],
  security: ['Roda no navegador, sem backend e sem coleta de dados.'],
  tests: ['Testes com node --test (tests/calculator.test.mjs).'],
  learn: ['Preservar o original ao lado da evolução mostra o que mudou e o que não mudou.'],
  status: 'Projeto acadêmico preservado e evoluído. Código público, com a versão desktop e a web, que segundo o README está no Firebase Hosting (não revalidado).',
  avail: ['Público','Disponível','Disponível','Concluído']
 },
 en: {
  ctx: 'One of the first projects of the degree: a desktop calculator in Python with Tkinter. In 2026 it gained a web version using the same logic.',
  flow: ['Input (keyboard or buttons)','Chained evaluation','Result or explicit error','History and memory'],
  rules: ['Chained evaluation when the operator changes.','Division by zero is an explicit error, and the comma is the decimal separator.','Memory M+, M−, MR and MC, and a history of recent calculations.','The Python version shows up to ten decimal places and the web version up to twelve significant digits, by product decision.'],
  challenges: [['Keeping the original behavior on the web.','The web version preserves the original semantics and the same key map.']],
  security: ['Runs in the browser, with no backend and no data collection.'],
  tests: ['Tests with node --test (tests/calculator.test.mjs).'],
  learn: ['Keeping the original beside its evolution shows what changed and what did not.'],
  status: 'Academic project preserved and evolved. Public code, with the desktop version and the web version, which per the README is on Firebase Hosting (not re-verified).',
  avail: ['Public','Available','Available','Completed']
 }
}
};
