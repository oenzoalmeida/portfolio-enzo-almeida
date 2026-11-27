// Reduz capas RGBA opacas a PNG de 256 cores (corte mediano + difusão de erro),
// sem dependências externas, para manter o peso da página dentro do orçamento.
import { deflateSync } from 'node:zlib';
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); };
const DIFF = Number(process.env.DIFF ?? 0.3);
export function indexedPng(rgba, w, h, colors = 256) {
  const bins = new Map();
  for (let i = 0; i < rgba.length; i += 4) { const k = ((rgba[i] >> 3) << 10) | ((rgba[i + 1] >> 3) << 5) | (rgba[i + 2] >> 3); let b = bins.get(k); if (!b) { b = [0, 0, 0, 0]; bins.set(k, b); } b[0]++; b[1] += rgba[i]; b[2] += rgba[i + 1]; b[3] += rgba[i + 2]; }
  let boxes = [[...bins.values()]];
  const range = (bx, c) => { let lo = 255, hi = 0; for (const b of bx) { const v = b[c + 1] / b[0]; if (v < lo) lo = v; if (v > hi) hi = v; } return hi - lo; };
  while (boxes.length < colors) {
    let best = -1, bc = 0, br = 0;
    boxes.forEach((bx, i) => { if (bx.length < 2) return; for (let c = 0; c < 3; c++) { const r = range(bx, c) * Math.log2(2 + bx.reduce((s, b) => s + b[0], 0)); if (r > br) { br = r; best = i; bc = c; } } });
    if (best < 0) break;
    const bx = boxes[best].sort((a, b) => a[bc + 1] / a[0] - b[bc + 1] / b[0]);
    const total = bx.reduce((s, b) => s + b[0], 0); let acc = 0, cut = 1;
    for (let i = 0; i < bx.length - 1; i++) { acc += bx[i][0]; cut = i + 1; if (acc >= total / 2) break; }
    boxes.splice(best, 1, bx.slice(0, cut), bx.slice(cut));
  }
  const pal = boxes.map((bx) => { let n = 0, r = 0, g = 0, b = 0; for (const e of bx) { n += e[0]; r += e[1]; g += e[2]; b += e[3]; } return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]; });
  const cache = new Map();
  const nearest = (r, g, b) => { const k = ((r >> 2) << 12) | ((g >> 2) << 6) | (b >> 2); let v = cache.get(k); if (v !== undefined) return v; let bd = 1e9; v = 0; for (let i = 0; i < pal.length; i++) { const d = (pal[i][0] - r) ** 2 + (pal[i][1] - g) ** 2 + (pal[i][2] - b) ** 2; if (d < bd) { bd = d; v = i; } } cache.set(k, v); return v; };
  const err = [new Float32Array((w + 2) * 3), new Float32Array((w + 2) * 3)];
  const raw = Buffer.alloc((w + 1) * h);
  const cl = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
  for (let y = 0; y < h; y++) {
    const cur = err[y & 1], nxt = err[(y + 1) & 1]; nxt.fill(0);
    raw[y * (w + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4; const e = (x + 1) * 3;
      const r = cl(rgba[i] + cur[e]), g = cl(rgba[i + 1] + cur[e + 1]), b = cl(rgba[i + 2] + cur[e + 2]);
      const idx = nearest(Math.round(r), Math.round(g), Math.round(b)); raw[y * (w + 1) + 1 + x] = idx;
      const q = pal[idx]; const d = [(r - q[0]) * DIFF, (g - q[1]) * DIFF, (b - q[2]) * DIFF];
      for (let c = 0; c < 3; c++) { cur[e + 3 + c] += d[c] * 7 / 16; nxt[e - 3 + c] += d[c] * 3 / 16; nxt[e + c] += d[c] * 5 / 16; nxt[e + 3 + c] += d[c] / 16; }
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 3;
  const plte = Buffer.from(pal.flat());
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('PLTE', plte), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
