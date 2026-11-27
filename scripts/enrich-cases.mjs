import { readFileSync, writeFileSync } from 'node:fs';
import { cases } from '../content/cases.mjs';
const L = {
 pt: { dir: 'projetos', h: ['Disponibilidade','Contexto e problema','Fluxo de funcionamento','Regras de negócio','Desafios técnicos e soluções','Segurança e privacidade','Testes e evidências','Aprendizados','Situação atual'], lab: ['Código-fonte','Demonstração','Estudo de caso','Situação'], challenge: 'Desafio', solution: 'Solução', flow: 'Fluxo de funcionamento', anchor: 'Evidências documentadas' },
 en: { dir: 'en/projetos', h: ['Availability','Context and problem','How it works','Business rules','Technical challenges and solutions','Security and privacy','Tests and evidence','Lessons learned','Current status'], lab: ['Source code','Demo','Case study','Status'], challenge: 'Challenge', solution: 'Solution', flow: 'Simplified flow', anchor: 'Documented evidence' }
};
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ul = (a) => '<ul>' + a.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
export function block(id, lang) {
 const c = cases[id][lang], l = L[lang];
 const av = '<dl class="availability">' + c.avail.map((v, i) => '<div><dt>' + l.lab[i] + '</dt><dd>' + esc(v) + '</dd></div>').join('') + '</dl>';
 const flow = '<ol class="architecture-flow" aria-label="' + l.flow + '">' + c.flow.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol>';
 const ch = '<ul class="challenges">' + c.challenges.map(([a, b]) => '<li><strong>' + l.challenge + ':</strong> ' + esc(a) + ' <strong>' + l.solution + ':</strong> ' + esc(b) + '</li>').join('') + '</ul>';
 return '<!--extra-->' + '<h2>' + l.h[0] + '</h2>' + av + '<h2>' + l.h[1] + '</h2><p>' + esc(c.ctx) + '</p><h2>' + l.h[2] + '</h2>' + flow + '<h2>' + l.h[3] + '</h2>' + ul(c.rules) + '<h2>' + l.h[4] + '</h2>' + ch + '<h2>' + l.h[5] + '</h2>' + ul(c.security) + '<h2>' + l.h[6] + '</h2>' + ul(c.tests) + '<h2>' + l.h[7] + '</h2>' + ul(c.learn) + '<h2>' + l.h[8] + '</h2><p>' + esc(c.status) + '</p><!--/extra-->';
}
export function applyEnrichment(root = '.') {
 for (const id of Object.keys(cases)) for (const lang of ['pt', 'en']) {
  const f = root + '/' + L[lang].dir + '/' + id + '/index.html';
  let s = readFileSync(f, 'utf8');
  s = s.replace(/<!--extra-->[\s\S]*?<!--\/extra-->/, '');
  if (id === 'mountrack' || id === 'dona-joana') s = s.replace('Código-fonte privado. Esta página não disponibiliza demonstração pública.', 'Código-fonte privado. A aplicação publicada está indicada em Disponibilidade.').replace('Private source code. No public demonstration is offered on this page.', 'Private source code. The published application is listed under Availability.');
  const a = '<h2>' + L[lang].anchor + '</h2>';
  if (!s.includes(a)) throw Error('âncora ausente: ' + f);
  s = s.replace(a, block(id, lang) + a);
  writeFileSync(f, s);
 }
 return Object.keys(cases).length * 2;
}
