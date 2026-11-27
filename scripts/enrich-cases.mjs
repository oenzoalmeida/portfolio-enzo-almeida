import { readFileSync, writeFileSync } from 'node:fs';
import { cases } from '../content/cases.mjs';
const L = {
 pt: { dir: 'projetos', h: ['Disponibilidade','Contexto e problema','Fluxo de funcionamento','Regras de negócio','Desafios técnicos e soluções','Segurança e privacidade','Testes e evidências','Aprendizados','Situação atual'], lab: ['Código-fonte','Demonstração','Estudo de caso','Situação'], app: 'Aplicação', challenge: 'Desafio', solution: 'Solução', flow: 'Fluxo de funcionamento', anchor: 'Evidências documentadas' },
 en: { dir: 'en/projetos', h: ['Availability','Context and problem','How it works','Business rules','Technical challenges and solutions','Security and privacy','Tests and evidence','Lessons learned','Current status'], lab: ['Source code','Demo','Case study','Status'], app: 'Application', challenge: 'Challenge', solution: 'Solution', flow: 'Simplified flow', anchor: 'Documented evidence' }
};
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ul = (a) => '<ul>' + a.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
const ALT = {
 'autociclo/inicio.png': ['Página inicial do AutoCiclo com a chamada "Seu carro em dia, sempre" e indicadores','AutoCiclo home page with the headline "Seu carro em dia, sempre" and indicators'],
 'autociclo/recursos.png': ['Seção de recursos do AutoCiclo: manutenções, revisões, quilometragem, gastos, documentos, alertas e histórico','AutoCiclo features section: maintenance, inspections, mileage, expenses, documents, alerts and history'],
 'conferevision/entrada.png': ['Tela de entrada do ConfereVision com campos de usuário e senha','ConfereVision sign-in screen with username and password fields'],
 'eventpass/area-publica.png': ['Área pública do EventPass com a lista de próximos eventos, vazia na captura','EventPass public area with the upcoming events list, empty in this capture'],
 'eventpass/entrada-painel.png': ['Tela de entrada no painel do organizador do EventPass','EventPass organizer panel sign-in screen'],
 'pratoja/inicio.png': ['Página inicial do PratoJá com a chamada "Seu cardápio, do seu jeito" e foto de prato','PratoJá home page with the headline "Seu cardápio, do seu jeito" and a dish photo'],
 'pratoja/cardapio.png': ['Cardápio do PratoJá com três pratos, preços e botões de personalizar e adicionar','PratoJá menu with three dishes, prices and customize and add buttons'],
 'pratoja/monte-seu-prato.png': ['Tela "Monte seu prato" do PratoJá com escolha de base, proteína e acompanhamentos','PratoJá "Monte seu prato" screen with base, protein and side choices'],
 'queueflow/02-dashboard.png': ['Painel do QueueFlow com indicadores de atendimento e a tabela das últimas senhas','QueueFlow dashboard with service indicators and a table of the latest tickets'],
 'queueflow/03-totem.png': ['Totem do QueueFlow com a escolha entre Atendimento Geral e Financeiro','QueueFlow kiosk with a choice between General Service and Financial'],
 'queueflow/04-totem-senha.png': ['Totem do QueueFlow exibindo a senha emitida A001 e o botão para emitir outra','QueueFlow kiosk showing issued ticket A001 and a button to issue another'],
 'calculadora-python/calculadora-web.png': ['Calculadora web com visor, teclado numérico e painel de histórico','Web calculator with display, number pad and history panel'],
 'consumo-energia/simulador.png': ['Simulador de consumo de energia com consumo por aparelho e lista de aparelhos cadastrados (dados de demonstração)','Energy consumption simulator with consumption per appliance and a list of registered appliances (demo data)'],
 'sistema-estoque/painel.png': ['Painel do controle de estoque com indicadores, lista de produtos e histórico de movimentações (dados de demonstração)','Inventory control panel with indicators, product list and movement history (demo data)'],
 'taskflow/login.png': ['Tela de entrada do TaskFlow com abas Entrar e Criar conta','TaskFlow sign-in screen with Sign in and Create account tabs']
};
function fixAlts(s, i) {
  return s.replace(/<img alt="[^"]*"([^>]*?)src="\/assets\/projects\/([^"]+)"/g, (m, mid, src) => ALT[src] ? '<img alt="' + esc(ALT[src][i]).replace(/"/g, '&quot;') + '"' + mid + 'src="/assets/projects/' + src + '"' : m);
}
export function block(id, lang) {
 const c = cases[id][lang], l = L[lang];
 const av = '<dl class="availability">' + c.avail.map((v, i) => '<div><dt>'  + (i === 1 && cases[id].appAccess ? l.app : l.lab[i]) + '</dt><dd>' + esc(v) + '</dd></div>').join('') + '</dl>';
 const flow = '<ol class="architecture-flow" aria-label="' + l.flow + '">' + c.flow.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol>';
 const ch = '<ul class="challenges">' + c.challenges.map(([a, b]) => '<li><strong>' + l.challenge + ':</strong> ' + esc(a) + ' <strong>' + l.solution + ':</strong> ' + esc(b) + '</li>').join('') + '</ul>';
 return '<!--extra-->' + '<h2>' + l.h[0] + '</h2>' + av + '<h2>' + l.h[1] + '</h2><p>' + esc(c.ctx) + '</p><h2>' + l.h[2] + '</h2>' + flow + '<h2>' + l.h[3] + '</h2>' + ul(c.rules) + '<h2>' + l.h[4] + '</h2>' + ch + '<h2>' + l.h[5] + '</h2>' + ul(c.security) + '<h2>' + l.h[6] + '</h2>' + ul(c.tests) + '<h2>' + l.h[7] + '</h2>' + ul(c.learn) + '<h2>' + l.h[8] + '</h2><p>' + esc(c.status) + '</p><!--/extra-->';
}
export function applyEnrichment(root = '.') {
 for (const id of Object.keys(cases)) for (const lang of ['pt', 'en']) {
  const f = root + '/' + L[lang].dir + '/' + id + '/index.html';
  let s = readFileSync(f, 'utf8');
  s = s.replace(/<!--extra-->[\s\S]*?<!--\/extra-->/, '');
  const a = '<h2>' + L[lang].anchor + '</h2>';
  if (!s.includes(a)) throw Error('âncora ausente: ' + f);
  s = s.replace(a, block(id, lang) + a);
  s = fixAlts(s, lang === 'pt' ? 0 : 1);
  writeFileSync(f, s);
 }
 return Object.keys(cases).length * 2;
}
