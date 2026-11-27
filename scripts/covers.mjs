// Sistema único de capas: 14 capas 1200x630 geradas no build a partir das capturas originais
// (que permanecem intactas) ou, para Cofre e DevJourney, de uma ilustração identificada.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { indexedPng } from './png-indexed.mjs';
export const SRC = { pentefino: 'pentefino/interface.png', queueflow: 'queueflow/02-dashboard.png', conferevision: 'conferevision/entrada.png', eventpass: 'eventpass/area-publica.png', pratoja: 'pratoja/inicio.png', autociclo: 'autociclo/inicio.png', mountrack: 'mountrack/interface.png', 'dona-joana': 'dona-joana/interface.png', taskflow: 'taskflow/login.png', 'sistema-estoque': 'sistema-estoque/painel.png', 'consumo-energia': 'consumo-energia/simulador.png', 'calculadora-python': 'calculadora-python/calculadora-web.png' };
const ACC = { pentefino: '#a78bfa', queueflow: '#34d399', conferevision: '#22d3ee', eventpass: '#8b5cf6', pratoja: '#fb923c', autociclo: '#f97316', mountrack: '#34d399', 'dona-joana': '#a3e635', cofre: '#60a5fa', taskflow: '#f87171', devjourney: '#fbbf24', 'sistema-estoque': '#facc15', 'consumo-energia': '#bef264', 'calculadora-python': '#d6c9a8' };
export const NAMES = { pentefino: 'PenteFino', queueflow: 'QueueFlow', conferevision: 'ConfereVision', eventpass: 'EventPass', pratoja: 'PratoJá', autociclo: 'AutoCiclo', mountrack: 'MounTrack', 'dona-joana': 'Dona Joana Marmitaria', cofre: 'Cofre', taskflow: 'TaskFlow', devjourney: 'DevJourney', 'sistema-estoque': 'Sistema de Estoque', 'consumo-energia': 'Consumo de Energia', 'calculadora-python': 'Calculadora Python' };
const AX = 0, AY = 0, AW = 1100, AH = 468;
function illustration(id, a) {
  if (id === 'cofre') return '<g transform="translate(' + (AX + AW / 2 - 330) + ',' + (AY + 110) + ')"><rect x="0" y="0" width="360" height="400" rx="26" fill="#14233b" stroke="' + a + '" stroke-width="6"/><circle cx="180" cy="190" r="104" fill="none" stroke="' + a + '" stroke-width="8"/><circle cx="180" cy="190" r="64" fill="#0f1b2e" stroke="' + a + '" stroke-width="5"/><path d="M180 126v128M116 190h128" stroke="' + a + '" stroke-width="6" stroke-linecap="round"/><circle cx="180" cy="190" r="14" fill="' + a + '"/><rect x="-14" y="80" width="14" height="60" rx="5" fill="' + a + '"/><rect x="-14" y="260" width="14" height="60" rx="5" fill="' + a + '"/></g><g transform="translate(' + (AX + AW / 2 + 70) + ',' + (AY + 150) + ')"><rect width="330" height="82" rx="14" fill="#1b2d49"/><rect x="24" y="24" width="34" height="34" rx="9" fill="' + a + '"/><rect x="76" y="26" width="170" height="12" rx="6" fill="#8aa4cc"/><rect x="76" y="48" width="110" height="10" rx="5" fill="#53688b"/><rect y="112" width="330" height="82" rx="14" fill="#1b2d49"/><rect x="24" y="136" width="34" height="34" rx="9" fill="' + a + '"/><rect x="76" y="138" width="140" height="12" rx="6" fill="#8aa4cc"/><rect x="76" y="160" width="190" height="10" rx="5" fill="#53688b"/><rect y="224" width="330" height="82" rx="14" fill="#1b2d49"/><rect x="24" y="248" width="34" height="34" rx="9" fill="' + a + '"/><rect x="76" y="250" width="180" height="12" rx="6" fill="#8aa4cc"/><rect x="76" y="272" width="90" height="10" rx="5" fill="#53688b"/></g>';
  return '<g transform="translate(' + (AX + 150) + ',' + (AY + 90) + ')"><rect width="520" height="390" rx="18" fill="#101a2b" stroke="#2c3f5f" stroke-width="3"/><rect width="520" height="42" rx="18" fill="#1a2a44"/><circle cx="26" cy="21" r="6" fill="#f87171"/><circle cx="48" cy="21" r="6" fill="' + a + '"/><circle cx="70" cy="21" r="6" fill="#34d399"/><path d="M34 90l24 16-24 16" stroke="' + a + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="76" y="98" width="220" height="12" rx="6" fill="#8aa4cc"/><rect x="34" y="152" width="300" height="12" rx="6" fill="#53688b"/><rect x="34" y="186" width="380" height="12" rx="6" fill="#53688b"/><rect x="34" y="220" width="250" height="12" rx="6" fill="#53688b"/><rect x="34" y="272" width="170" height="12" rx="6" fill="' + a + '"/><rect x="34" y="306" width="330" height="12" rx="6" fill="#53688b"/></g><g transform="translate(' + (AX + 760) + ',' + (AY + 120) + ')"><path d="M40 20V320" stroke="#2c3f5f" stroke-width="6"/>' + [0, 1, 2, 3].map((i) => '<circle cx="40" cy="' + (20 + i * 100) + '" r="20" fill="' + (i === 3 ? a : '#1b2d49') + '" stroke="' + a + '" stroke-width="5"/><rect x="86" y="' + (8 + i * 100) + '" width="' + (190 - i * 20) + '" height="14" rx="7" fill="#8aa4cc"/><rect x="86" y="' + (32 + i * 100) + '" width="' + (120 - i * 10) + '" height="10" rx="5" fill="#53688b"/>').join('') + '</g>';
}
const decode = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
const xml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function cardData(html, id) {
  const i = html.indexOf('id="estudo-' + id + '"');
  if (i < 0) throw Error('Cartão ausente: ' + id);
  const j = html.indexOf('id="estudo-', i + 10), blk = html.slice(i, j < 0 ? undefined : j);
  const sub = /<small>([^<]*)<\/small>/.exec(blk)[1];
  const tg = /<div class="tags">([\s\S]*?)<\/div>/.exec(blk)[1];
  const tags = [...tg.matchAll(/<span>([^<]*)<\/span>/g)].map((m) => decode(m[1])).slice(0, 3);
  return { sub: decode(sub), tags };
}
function wrap(t, max) { const out = []; let cur = ''; for (const w of t.split(' ')) { if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; } if (cur) out.push(cur); return out; }
// Composição única: coluna de texto à esquerda, janela de navegador com a captura à direita, selo de origem abaixo da janela.
const FX = 520, FW = 640, BARH = 30, SH = Math.round(FW * 993 / 1920);
export function coverSvg(id, lang, data, assetsDir = 'assets/projects') {
  const a = ACC[id], real = !!SRC[id];
  const badge = real ? (lang === 'pt' ? 'Captura real' : 'Real screenshot') : (lang === 'pt' ? 'Capa ilustrativa' : 'Illustrative cover');
  const fy = Math.round((630 - (BARH + SH)) / 2) - 14;
  let inner;
  if (real) {
    const buf = readFileSync(join(assetsDir, SRC[id]));
    inner = '<image x="' + FX + '" y="' + (fy + BARH) + '" width="' + FW + '" height="' + SH + '" xlink:href="data:image/png;base64,' + buf.toString('base64') + '"/>';
  } else {
    const k = FW / 1100;
    inner = '<g transform="translate(' + FX + ',' + (fy + BARH + (SH - 468 * k) / 2) + ') scale(' + k + ')">' + illustration(id, a) + '</g>';
  }
  const lines = wrap(NAMES[id], 13), nameY = 250;
  const name = lines.map((l, i) => '<text x="60" y="' + (nameY + i * 56) + '" font-family="DejaVu Sans" font-weight="700" font-size="50" fill="#f4f7ff">' + xml(l) + '</text>').join('');
  let y = nameY + (lines.length - 1) * 56 + 40;
  const subLines = wrap(data.sub, 30).slice(0, 2);
  const sub = subLines.map((l, i) => '<text x="60" y="' + (y + i * 28) + '" font-family="DejaVu Sans" font-size="22" fill="#a9b6cc">' + xml(l) + '</text>').join('');
  y += subLines.length * 28 + 14;
  let cx = 60; const chips = data.tags.map((t) => { const w = t.length * 9 + 28; const r = '<rect x="' + cx + '" y="' + y + '" width="' + w + '" height="32" rx="7" fill="#16233a" stroke="#2f4566"/><text x="' + (cx + w / 2) + '" y="' + (y + 21) + '" text-anchor="middle" font-family="DejaVu Sans" font-size="15" fill="#d6e0f2">' + xml(t) + '</text>'; cx += w + 10; return r; }).join('');
  const eyebrow = 'ENZO ALMEIDA · ' + (lang === 'pt' ? 'PROJETOS' : 'PROJECTS');
  const ew = eyebrow.length * 9.6 + 32;
  const bw = badge.length * 9 + 28, bx = FX + FW - bw, by = fy + BARH + SH + 16;
  return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1020"/><stop offset="1" stop-color="#14203a"/></linearGradient><radialGradient id="r" cx=".9" cy=".05" r=".75"><stop offset="0" stop-color="' + a + '" stop-opacity=".30"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity=".035"/></pattern><clipPath id="c"><rect x="' + FX + '" y="' + fy + '" width="' + FW + '" height="' + (BARH + SH) + '" rx="12"/></clipPath></defs><rect width="1200" height="630" fill="url(#g)"/><rect width="1200" height="630" fill="url(#p)"/><rect width="1200" height="630" fill="url(#r)"/>'
    + '<rect x="60" y="116" width="' + ew + '" height="30" rx="15" fill="' + a + '" fill-opacity=".14" stroke="' + a + '" stroke-opacity=".6"/><text x="' + (60 + ew / 2) + '" y="136" text-anchor="middle" font-family="DejaVu Sans" font-weight="700" font-size="13" letter-spacing="2" fill="' + a + '">' + eyebrow + '</text>'
    + name + sub + chips
    + '<text x="60" y="560" font-family="DejaVu Sans" font-size="15" fill="#8b9bb4">portfolio-enzo-almeida.vercel.app</text>'
    + '<g clip-path="url(#c)"><rect x="' + FX + '" y="' + fy + '" width="' + FW + '" height="' + (BARH + SH) + '" fill="#0d1523"/>' + inner + '<rect x="' + FX + '" y="' + fy + '" width="' + FW + '" height="' + BARH + '" fill="#1a2538"/></g>'
    + '<circle cx="' + (FX + 18) + '" cy="' + (fy + 15) + '" r="5" fill="#f87171"/><circle cx="' + (FX + 36) + '" cy="' + (fy + 15) + '" r="5" fill="#fbbf24"/><circle cx="' + (FX + 54) + '" cy="' + (fy + 15) + '" r="5" fill="#34d399"/>'
    + '<text x="' + (FX + 78) + '" y="' + (fy + 19) + '" font-family="DejaVu Sans" font-size="11" fill="#8b9bb4">portfolio-enzo-almeida.vercel.app/projetos/' + id + '</text>'
    + '<rect x="' + FX + '" y="' + fy + '" width="' + FW + '" height="' + (BARH + SH) + '" rx="12" fill="none" stroke="' + a + '" stroke-opacity=".6" stroke-width="2"/>'
    + '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="24" rx="12" fill="' + a + '" fill-opacity="' + (real ? '.22' : '.95') + '"/><text x="' + (bx + bw / 2) + '" y="' + (by + 17) + '" text-anchor="middle" font-family="DejaVu Sans" font-size="13" font-weight="700" fill="' + (real ? '#e8eefc' : '#111827') + '">' + badge + '</text></svg>';
}
export function renderCovers(out) {
  mkdirSync(join(out, 'assets', 'covers'), { recursive: true });
  const html = { pt: readFileSync(join(out, 'index.html'), 'utf8'), en: readFileSync(join(out, 'en', 'index.html'), 'utf8') };
  for (const id of Object.keys(NAMES)) for (const lang of ['pt', 'en']) {
    const png = new Resvg(coverSvg(id, lang, cardData(html[lang], id)), { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } }).render();
    if (png.width !== 1200 || png.height !== 630) throw Error('Dimensão da capa inválida: ' + id);
    writeFileSync(join(out, 'assets', 'covers', id + (lang === 'en' ? '-en' : '') + '.png'), indexedPng(png.pixels, 1200, 630));
  }
  return Object.keys(NAMES).length * 2;
}
const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
export function wireCovers(out) {
  let n = 0;
  for (const lang of ['pt', 'en']) {
    const home = join(out, lang === 'en' ? 'en/index.html' : 'index.html');
    let s = readFileSync(home, 'utf8');
    for (const id of Object.keys(NAMES)) {
      const url = '/assets/covers/' + id + (lang === 'en' ? '-en' : '') + '.png';
      const real = !!SRC[id];
      const alt = real ? (lang === 'pt' ? 'Capa de ' + NAMES[id] + ': captura real da aplicação' : NAMES[id] + ' cover: real application screenshot') : (lang === 'pt' ? 'Capa ilustrativa de ' + NAMES[id] + ': ilustração conceitual, não é uma captura da aplicação' : 'Illustrative cover for ' + NAMES[id] + ': conceptual illustration, not an application screenshot');
      const re = new RegExp('(<a class="project-cover-link" href="/(?:en/)?projetos/' + id + '/"[^>]*>)([\\s\\S]*?)(</a>)');
      s = s.replace(re, (m, a, b, c) => {
        if (real) b = b.replace(/<img alt="[^"]*" src="[^"]*"/, '<img alt="' + esc(alt) + '" src="' + url + '"');
        else b = b.replace(/<div class="cover-illustration"[^>]*>[\s\S]*?<\/svg><span>[^<]*<\/span><\/div>/, '<div class="cover-illustration"><img alt="' + esc(alt) + '" src="' + url + '" loading="lazy" decoding="async"/></div>');
        n++; return a + b + c;
      });
      const page = join(out, lang === 'en' ? 'en/projetos' : 'projetos', id, 'index.html');
      if (existsSync(page) && !real) {
        let p = readFileSync(page, 'utf8');
        p = p.replace(/<img alt="[^"]*" src="\/assets\/og\/[a-z-]+\.svg"/, '<img alt="' + esc(alt) + '" src="' + url + '"');
        writeFileSync(page, p);
      }
    }
    writeFileSync(home, s);
  }
  return n;
}
