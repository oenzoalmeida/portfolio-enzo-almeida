// Sistema único de capas: 14 capas 1200x560 geradas no build a partir das capturas originais
// (que permanecem intactas) ou, para Cofre e DevJourney, de uma ilustração identificada.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
export const SRC = { pentefino: 'pentefino/interface.png', queueflow: 'queueflow/02-dashboard.png', conferevision: 'conferevision/entrada.png', eventpass: 'eventpass/area-publica.png', pratoja: 'pratoja/inicio.png', autociclo: 'autociclo/inicio.png', mountrack: 'mountrack/interface.png', 'dona-joana': 'dona-joana/interface.png', taskflow: 'taskflow/login.png', 'sistema-estoque': 'sistema-estoque/painel.png', 'consumo-energia': 'consumo-energia/simulador.png', 'calculadora-python': 'calculadora-python/calculadora-web.png' };
const ACC = { pentefino: '#a78bfa', queueflow: '#34d399', conferevision: '#22d3ee', eventpass: '#8b5cf6', pratoja: '#fb923c', autociclo: '#f97316', mountrack: '#34d399', 'dona-joana': '#a3e635', cofre: '#60a5fa', taskflow: '#f87171', devjourney: '#fbbf24', 'sistema-estoque': '#facc15', 'consumo-energia': '#bef264', 'calculadora-python': '#d6c9a8' };
export const NAMES = { pentefino: 'PenteFino', queueflow: 'QueueFlow', conferevision: 'ConfereVision', eventpass: 'EventPass', pratoja: 'PratoJá', autociclo: 'AutoCiclo', mountrack: 'MounTrack', 'dona-joana': 'Dona Joana Marmitaria', cofre: 'Cofre', taskflow: 'TaskFlow', devjourney: 'DevJourney', 'sistema-estoque': 'Sistema de Estoque', 'consumo-energia': 'Consumo de Energia', 'calculadora-python': 'Calculadora Python' };
const W = 1200, H = 560, PX = 50, PY = 26, PW = 1100, PH = 508, BAR = 40, AX = PX, AY = PY + BAR, AW = PW, AH = PH - BAR;
function illustration(id, a) {
  if (id === 'cofre') return '<g transform="translate(' + (AX + AW / 2 - 330) + ',' + (AY + 24) + ')"><rect x="0" y="0" width="360" height="400" rx="26" fill="#14233b" stroke="' + a + '" stroke-width="6"/><circle cx="180" cy="190" r="104" fill="none" stroke="' + a + '" stroke-width="8"/><circle cx="180" cy="190" r="64" fill="#0f1b2e" stroke="' + a + '" stroke-width="5"/><path d="M180 126v128M116 190h128" stroke="' + a + '" stroke-width="6" stroke-linecap="round"/><circle cx="180" cy="190" r="14" fill="' + a + '"/><rect x="-14" y="80" width="14" height="60" rx="5" fill="' + a + '"/><rect x="-14" y="260" width="14" height="60" rx="5" fill="' + a + '"/></g><g transform="translate(' + (AX + AW / 2 + 70) + ',' + (AY + 60) + ')"><rect width="330" height="82" rx="14" fill="#1b2d49"/><rect x="24" y="24" width="34" height="34" rx="9" fill="' + a + '"/><rect x="76" y="26" width="170" height="12" rx="6" fill="#8aa4cc"/><rect x="76" y="48" width="110" height="10" rx="5" fill="#53688b"/><rect y="112" width="330" height="82" rx="14" fill="#1b2d49"/><rect x="24" y="136" width="34" height="34" rx="9" fill="' + a + '"/><rect x="76" y="138" width="140" height="12" rx="6" fill="#8aa4cc"/><rect x="76" y="160" width="190" height="10" rx="5" fill="#53688b"/><rect y="224" width="330" height="82" rx="14" fill="#1b2d49"/><rect x="24" y="248" width="34" height="34" rx="9" fill="' + a + '"/><rect x="76" y="250" width="180" height="12" rx="6" fill="#8aa4cc"/><rect x="76" y="272" width="90" height="10" rx="5" fill="#53688b"/></g>';
  return '<g transform="translate(' + (AX + 80) + ',' + (AY + 40) + ')"><rect width="520" height="390" rx="18" fill="#101a2b" stroke="#2c3f5f" stroke-width="3"/><rect width="520" height="42" rx="18" fill="#1a2a44"/><circle cx="26" cy="21" r="6" fill="#f87171"/><circle cx="48" cy="21" r="6" fill="' + a + '"/><circle cx="70" cy="21" r="6" fill="#34d399"/><path d="M34 90l24 16-24 16" stroke="' + a + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="76" y="98" width="220" height="12" rx="6" fill="#8aa4cc"/><rect x="34" y="152" width="300" height="12" rx="6" fill="#53688b"/><rect x="34" y="186" width="380" height="12" rx="6" fill="#53688b"/><rect x="34" y="220" width="250" height="12" rx="6" fill="#53688b"/><rect x="34" y="272" width="170" height="12" rx="6" fill="' + a + '"/><rect x="34" y="306" width="330" height="12" rx="6" fill="#53688b"/></g><g transform="translate(' + (AX + 660) + ',' + (AY + 70) + ')"><path d="M40 20V320" stroke="#2c3f5f" stroke-width="6"/>' + [0, 1, 2, 3].map((i) => '<circle cx="40" cy="' + (20 + i * 100) + '" r="20" fill="' + (i === 3 ? a : '#1b2d49') + '" stroke="' + a + '" stroke-width="5"/><rect x="86" y="' + (8 + i * 100) + '" width="' + (190 - i * 20) + '" height="14" rx="7" fill="#8aa4cc"/><rect x="86" y="' + (32 + i * 100) + '" width="' + (120 - i * 10) + '" height="10" rx="5" fill="#53688b"/>').join('') + '</g>';
}
export function coverSvg(id, lang, assetsDir = 'assets/projects') {
  const a = ACC[id], real = !!SRC[id];
  const badge = real ? (lang === 'pt' ? 'Captura real' : 'Real screenshot') : (lang === 'pt' ? 'Capa ilustrativa' : 'Illustrative cover');
  let inner;
  if (real) {
    const buf = readFileSync(join(assetsDir, SRC[id]));
    const sc = Math.min(AW / 1920, AH / 993), w = Math.round(1920 * sc), h = Math.round(993 * sc);
    inner = '<image x="' + (AX + Math.round((AW - w) / 2)) + '" y="' + (AY + Math.round((AH - h) / 2)) + '" width="' + w + '" height="' + h + '" xlink:href="data:image/png;base64,' + buf.toString('base64') + '"/>';
  } else inner = illustration(id, a);
  const bw = badge.length * 9 + 28;
  return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="#1a2640"/></linearGradient><radialGradient id="r" cx=".85" cy=".1" r=".7"><stop offset="0" stop-color="' + a + '" stop-opacity=".38"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient><clipPath id="c"><rect x="' + PX + '" y="' + PY + '" width="' + PW + '" height="' + PH + '" rx="16"/></clipPath></defs><rect width="' + W + '" height="' + H + '" fill="url(#g)"/><rect width="' + W + '" height="' + H + '" fill="url(#r)"/><g clip-path="url(#c)"><rect x="' + PX + '" y="' + PY + '" width="' + PW + '" height="' + PH + '" fill="#0d1523"/>' + inner + '<rect x="' + PX + '" y="' + PY + '" width="' + PW + '" height="' + BAR + '" fill="#1a2538"/></g><rect x="' + PX + '" y="' + PY + '" width="' + PW + '" height="' + PH + '" rx="16" fill="none" stroke="' + a + '" stroke-opacity=".7" stroke-width="2"/><circle cx="' + (PX + 24) + '" cy="' + (PY + 20) + '" r="6" fill="#64748b"/><circle cx="' + (PX + 44) + '" cy="' + (PY + 20) + '" r="6" fill="#64748b"/><circle cx="' + (PX + 64) + '" cy="' + (PY + 20) + '" r="6" fill="' + a + '"/><rect x="' + (PX + PW - bw - 18) + '" y="' + (PY + 8) + '" width="' + bw + '" height="24" rx="12" fill="' + a + '" fill-opacity="' + (real ? '.22' : '.9') + '"/><text x="' + (PX + PW - bw / 2 - 18) + '" y="' + (PY + 25) + '" text-anchor="middle" font-family="DejaVu Sans" font-size="13" font-weight="700" fill="' + (real ? '#e8eefc' : '#111827') + '">' + badge + '</text></svg>';
}
export function renderCovers(out) {
  mkdirSync(join(out, 'assets', 'covers'), { recursive: true });
  for (const id of Object.keys(NAMES)) for (const lang of ['pt', 'en']) {
    const png = new Resvg(coverSvg(id, lang), { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } }).render();
    if (png.width !== W || png.height !== H) throw Error('Dimensão da capa inválida: ' + id);
    writeFileSync(join(out, 'assets', 'covers', id + (lang === 'en' ? '-en' : '') + '.png'), png.asPng());
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
