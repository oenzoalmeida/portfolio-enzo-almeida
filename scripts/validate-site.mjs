import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const html = readFileSync("index.html", "utf8");

assert.ok(html.length > 10000, "Página está incompleta");
assert.match(html, /<!doctype html>/i);
assert.match(html, /<html[^>]+lang=["']pt-BR["']/i);
assert.match(html, /<main(?:\s|>)/i);
assert.match(html, /name=["']viewport["']/i);
assert.match(html, /https:\/\/www\.linkedin\.com\/in\/enzolara\//);
assert.doesNotMatch(html, /linkedin\.com\/in\/oenzoalmeida\//);

for (const name of ["QueueFlow", "PratoJá", "EventPass", "AutoCiclo", "ConfereVision"]) {
  assert.ok(html.includes(name), "Projeto ausente: " + name);
}

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "IDs duplicados no documento");
const knownIds = new Set(ids);
for (const [, destination] of html.matchAll(/\bhref=["'](?:index\.html)?#([^"']+)["']/g)) {
  assert.ok(knownIds.has(destination), "Âncora sem destino: #" + destination);
}

const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
for (const tag of imageTags) {
  assert.match(tag, /\balt=["'][^"']*["']/i, "Imagem sem texto alternativo");
}

let javascriptFiles = 0;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const [, attrs, code] = match;
  if (/type=["']application\/ld\+json["']/i.test(attrs)) {
    JSON.parse(code);
  } else if (code.trim()) {
    new Script(code, { filename: "index.html" });
    javascriptFiles++;
  }
}
assert.ok(javascriptFiles >= 1, "Nenhum script JavaScript localizado");
assert.doesNotMatch(html, /-----BEGIN [A-Z ]*PRIVATE KEY-----/);
console.log(`OK: HTML, ${ids.length} âncoras, ${imageTags.length} imagens e ${javascriptFiles} scripts validados.`);
