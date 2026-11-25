// Gera os quatro documentos profissionais (Premium PT/EN e ATS PT/EN) a partir
// da fonte centralizada em scripts/resume-data.mjs.
// Uso: npm run resumes
// Os PDFs são gravados em assets/ e versionados no repositório, para que o
// build estático (Vercel/CI) não dependa de um navegador instalado.
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as d from './resume-data.mjs';

const OUT = {
  'premium-pt': 'assets/perfil-profissional-enzo-almeida.pdf',
  'premium-en': 'assets/professional-profile-enzo-almeida.pdf',
  'ats-pt': 'assets/curriculo-enzo-almeida.pdf',
  'ats-en': 'assets/curriculo-enzo-almeida-en.pdf',
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function contactLinks(lang, cls) {
  const c = d.identity.contacts;
  const items = [
    `<a class="${cls}" href="mailto:${c.email}">${c.email}</a>`,
    `<a class="${cls}" href="${c.github}">${c.githubLabel}</a>`,
    `<a class="${cls}" href="${c.linkedin}">${c.linkedinLabel}</a>`,
    `<a class="${cls}" href="${c.portfolio}">${c.portfolioLabel}</a>`,
    `<span class="${cls}">${esc(d.identity.location[lang])}</span>`,
  ];
  return items.join('\n');
}

const premiumCss = `
@page { size: A4; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { font-family: 'Carlito', 'Liberation Sans', sans-serif; color: #080D18; }
.page { width: 210mm; height: 297mm; page-break-after: always; position: relative; background: #FFFFFF; overflow: hidden; }
.page:last-child { page-break-after: auto; }
.band { background: #080D18; color: #FFFFFF; padding: 16mm 16mm 10mm; }
.band .name { font-size: 28pt; font-weight: 700; letter-spacing: 0.4pt; }
.band .name .dot { color: #9DE7D3; }
.band .role { color: #9DE7D3; font-size: 11.5pt; font-weight: 700; margin-top: 1.6mm; letter-spacing: 0.3pt; }
.band .contacts { margin-top: 4.5mm; display: flex; flex-wrap: wrap; gap: 2mm 6mm; }
.band .contacts a, .band .contacts span { color: #F2F5FA; font-size: 8.4pt; text-decoration: none; border-bottom: 0.4pt solid #274D87; padding-bottom: 0.6mm; }
.band .contacts span { border-bottom-color: transparent; }
.body { padding: 9mm 16mm 16mm; }
.section { margin-bottom: 8mm; }
h2.st { color: #274D87; font-size: 10.8pt; text-transform: uppercase; letter-spacing: 1.3pt; border-bottom: 0.7pt solid #9DE7D3; padding-bottom: 1.6mm; margin-bottom: 3.4mm; }
.profile { font-size: 10pt; line-height: 1.58; color: #1B2536; text-align: justify; }
.cols { display: flex; gap: 9mm; }
.cols .main { flex: 1.85; }
.cols .side { flex: 1; }
.job { margin-bottom: 5.8mm; }
.job:last-child { margin-bottom: 0; }
.job .head { display: flex; justify-content: space-between; align-items: baseline; }
.job .head .title { font-size: 10.5pt; font-weight: 700; }
.job .head .period { font-size: 8.2pt; font-weight: 700; color: #FFFFFF; background: #274D87; border-radius: 2mm; padding: 0.7mm 2.6mm; white-space: nowrap; }
.job .where { font-size: 8.8pt; color: #274D87; font-weight: 700; margin-top: 0.5mm; }
.job ul { margin: 1.8mm 0 0 4mm; }
.job li { font-size: 9.5pt; line-height: 1.52; margin-bottom: 1mm; }
.sideblock { background: #F2F5FA; border-radius: 2.5mm; padding: 5.5mm 5.5mm; margin-bottom: 6mm; }
.sideblock:last-child { margin-bottom: 0; }
.sideblock h2.st { border-bottom: none; margin-bottom: 2mm; padding-bottom: 0; }
.edu .title { font-size: 10.2pt; font-weight: 700; }
.edu .meta { font-size: 9pt; color: #1B2536; margin-top: 1mm; line-height: 1.45; }
.skill { margin-bottom: 3.4mm; }
.skill:last-child { margin-bottom: 0; }
.skill .group { font-size: 9.1pt; font-weight: 700; color: #274D87; }
.skill .items { font-size: 9.1pt; line-height: 1.5; color: #1B2536; }
.foot { position: absolute; left: 16mm; right: 16mm; bottom: 7mm; display: flex; justify-content: space-between; font-size: 7.8pt; color: #5A6B85; border-top: 0.5pt solid #E1E8F2; padding-top: 1.8mm; }
.p2band { padding: 7mm 16mm 5mm; }
.p2band .name { font-size: 14pt; }
.p2band .doct { color: #9DE7D3; font-size: 8.8pt; font-weight: 700; margin-top: 1mm; letter-spacing: 0.5pt; }
.intro { font-size: 9.2pt; line-height: 1.45; color: #1B2536; margin-bottom: 4mm; text-align: justify; }
.proj { margin-bottom: 3.2mm; padding: 2.8mm 3.6mm; background: #F2F5FA; border-left: 1.1mm solid #274D87; border-radius: 0 2mm 2mm 0; }
.proj .head { display: flex; justify-content: space-between; align-items: baseline; }
.proj .pname { font-size: 10.4pt; font-weight: 700; }
.proj .tag { font-size: 8.4pt; color: #274D87; font-weight: 700; }
.proj .desc { font-size: 8.8pt; color: #1B2536; margin-top: 0.8mm; }
.proj .stack { margin-top: 1.6mm; display: flex; flex-wrap: wrap; gap: 1.4mm; }
.proj .stack span { font-size: 7.6pt; font-weight: 700; color: #274D87; background: #FFFFFF; border: 0.4pt solid #C9D6EA; border-radius: 1.6mm; padding: 0.5mm 2mm; }
.proj ul { margin: 1.2mm 0 0 4mm; }
.proj li { font-size: 8.4pt; line-height: 1.34; margin-bottom: 0.4mm; }
`;

function premium(lang) {
  const t = (o) => o[lang];
  const jobs = d.experience.map((j) => `
    <div class="job">
      <div class="head"><span class="title">${esc(t(j.title))}</span><span class="period">${esc(t(j.period))}</span></div>
      <div class="where">${esc(t(j.company))}</div>
      <ul>${j.items[lang].map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
  const edu = d.education.map((e) => `
    <div class="edu"><div class="title">${esc(t(e.title))}</div><div class="meta">${esc(t(e.school))}<br>${esc(t(e.period))}</div></div>`).join('');
  const skillBlocks = d.skills.map((s) => `
    <div class="skill"><div class="group">${esc(t(s.group))}</div><div class="items">${esc(s.items.join(' · '))}</div></div>`).join('');
  const projs = d.projects.map((p) => `
    <div class="proj">
      <div class="head"><span class="pname">${esc(p.name)}</span><span class="tag">${esc(t(p.tagline))}</span></div>
      <div class="desc">${esc(t(p.description))}</div>
      <div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      <ul>${p.points[lang].map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
  const foot1 = `<div class="foot"><span>${esc(d.identity.name)} · ${esc(d.documentTitles.premium[lang])}</span><span>${esc(d.updated[lang])} · 1/2</span></div>`;
  const foot2 = `<div class="foot"><span>${esc(d.identity.name)} · ${esc(d.documentTitles.premium[lang])}</span><span>${esc(d.updated[lang])} · 2/2</span></div>`;
  return `<!DOCTYPE html><html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"><head><meta charset="utf-8"><title>${esc(d.identity.name)} · ${esc(d.documentTitles.premium[lang])}</title><style>${premiumCss}</style></head><body>
<div class="page">
  <div class="band">
    <div class="name">${esc(d.identity.name)}<span class="dot">.</span></div>
    <div class="role">${esc(t(d.identity.role))}</div>
    <div class="contacts">${contactLinks(lang, 'c')}</div>
  </div>
  <div class="body">
    <div class="section"><h2 class="st">${esc(t(d.sectionTitles.profile))}</h2><p class="profile">${esc(d.profile[lang])}</p></div>
    <div class="cols">
      <div class="main"><div class="section"><h2 class="st">${esc(t(d.sectionTitles.experience))}</h2>${jobs}</div></div>
      <div class="side">
        <div class="sideblock"><h2 class="st">${esc(t(d.sectionTitles.education))}</h2>${edu}</div>
        <div class="sideblock"><h2 class="st">${esc(t(d.sectionTitles.skills))}</h2>${skillBlocks}</div>
      </div>
    </div>
  </div>
  ${foot1}
</div>
<div class="page">
  <div class="band p2band"><div class="name">${esc(d.identity.name)}<span class="dot">.</span></div><div class="doct">${esc(t(d.sectionTitles.projects))} · ${esc(d.documentTitles.premium[lang])}</div></div>
  <div class="body">
    <p class="intro">${esc(d.projectsIntro[lang])}</p>
    ${projs}
  </div>
  ${foot2}
</div>
</body></html>`;
}

const atsCss = `
@page { size: A4; margin: 16mm 18mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { font-family: 'Carlito', 'Liberation Sans', sans-serif; color: #000000; }
.page { width: 100%; }
h2.pb { break-before: page; }
h1 { font-size: 19pt; font-weight: 700; }
.role { font-size: 11.5pt; font-weight: 700; margin-top: 1.2mm; }
.contacts { margin-top: 2.6mm; font-size: 9.4pt; line-height: 1.6; }
.contacts a { color: #000000; }
h2 { font-size: 11.5pt; text-transform: uppercase; letter-spacing: 0.6pt; border-bottom: 0.6pt solid #000000; margin: 6mm 0 2.6mm; padding-bottom: 1mm; }
p, li { font-size: 9.8pt; line-height: 1.45; }
ul { margin: 1mm 0 1mm 5mm; }
.job { margin-bottom: 3.6mm; }
.job .title { font-weight: 700; font-size: 10.2pt; }
.job .meta { font-size: 9.6pt; }
.proj { margin-bottom: 3.2mm; }
.proj .title { font-weight: 700; font-size: 10.2pt; }
.avoid { page-break-inside: avoid; }
`;

function ats(lang) {
  const t = (o) => o[lang];
  const c = d.identity.contacts;
  const jobs = d.experience.map((j) => `
    <div class="job avoid">
      <div class="title">${esc(t(j.title))}, ${esc(t(j.company))}</div>
      <div class="meta">${esc(t(j.period))}</div>
      <ul>${j.items[lang].map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
  const edu = d.education.map((e) => `<p>${esc(t(e.title))}, ${esc(t(e.school))}. ${esc(t(e.period))}.</p>`).join('');
  const skillLines = d.skills.map((s) => `<p><strong>${esc(t(s.group))}:</strong> ${esc(s.items.join(', '))}.</p>`).join('');
  const projs = d.projects.map((p) => `
    <div class="proj avoid">
      <div class="title">${esc(p.name)}: ${esc(t(p.tagline))}</div>
      <p>${esc(t(p.description))} ${esc(lang === 'pt' ? 'Tecnologias' : 'Technologies')}: ${esc(p.stack.join(', '))}.</p>
      <ul>${p.points[lang].map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
  return `<!DOCTYPE html><html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"><head><meta charset="utf-8"><title>${esc(d.identity.name)} · ${esc(d.documentTitles.ats[lang])}</title><style>${atsCss}</style></head><body>
<div class="page">
  <h1>${esc(d.identity.name)}</h1>
  <div class="role">${esc(t(d.identity.role))}</div>
  <div class="contacts">
    <a href="mailto:${c.email}">${c.email}</a><br>
    <a href="${c.github}">${c.githubLabel}</a><br>
    <a href="${c.linkedin}">${c.linkedinLabel}</a><br>
    <a href="${c.portfolio}">${c.portfolioLabel}</a><br>
    ${esc(d.identity.location[lang])}
  </div>
  <h2>${esc(t(d.sectionTitles.profile))}</h2>
  <p>${esc(d.profile[lang])}</p>
  <h2>${esc(t(d.sectionTitles.experience))}</h2>
  ${jobs}
  <h2>${esc(t(d.sectionTitles.education))}</h2>
  ${edu}
  <h2>${esc(t(d.sectionTitles.skills))}</h2>
  ${skillLines}
  <h2 class="${lang === 'pt' ? 'pb' : ''}">${esc(t(d.sectionTitles.projects))}</h2>
  <p>${esc(d.projectsIntro[lang])}</p>
  ${projs}
</div>
</body></html>`;
}

function findChrome() {
  for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try { execFileSync('which', [bin], { stdio: 'pipe' }); return bin; } catch {}
  }
  return null;
}

const docs = {
  'premium-pt': premium('pt'),
  'premium-en': premium('en'),
  'ats-pt': ats('pt'),
  'ats-en': ats('en'),
};

const chrome = findChrome();
if (!chrome) {
  for (const target of Object.values(OUT)) {
    if (!existsSync(target)) throw new Error('Navegador indisponível e PDF versionado ausente: ' + target);
  }
  console.log('Navegador indisponível; mantidos os quatro PDFs versionados em assets/.');
  process.exit(0);
}

const dir = join(tmpdir(), 'portfolio-resumes');
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

for (const [key, html] of Object.entries(docs)) {
  const src = join(dir, key + '.html');
  const target = OUT[key];
  writeFileSync(src, html);
  execFileSync(chrome, [
    '--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-pdf-header-footer', '--print-to-pdf=' + join(dir, key + '.pdf'),
    '--virtual-time-budget=10000', 'file://' + src,
  ], { stdio: 'pipe' });
  const pdf = join(dir, key + '.pdf');
  const info = execFileSync('pdfinfo', [pdf], { encoding: 'utf8' });
  const pages = Number((info.match(/^Pages:\s+(\d+)/m) || [])[1] || 0);
  const limit = key.startsWith('premium') ? 2 : 3;
  if (!pages || pages > limit) throw new Error(key + ': ' + pages + ' páginas (limite ' + limit + ')');
  if (key.startsWith('premium') && pages !== 2) throw new Error(key + ': Premium deve ter exatamente 2 páginas, gerou ' + pages);
  writeFileSync(target, execFileSync('cat', [pdf]));
  const size = execFileSync('stat', ['-c', '%s', target], { encoding: 'utf8' }).trim();
  console.log(key + ' -> ' + target + ' (' + pages + ' páginas, ' + size + ' bytes)');
}
console.log('Quatro documentos gerados a partir de scripts/resume-data.mjs.');
