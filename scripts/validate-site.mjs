import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {Script} from 'node:vm';
import { chdir } from 'node:process';
chdir('dist');
const ids=['queueflow','pratoja','conferevision','autociclo','eventpass','pentefino',"taskflow","consumo-energia","sistema-estoque","calculadora-python","mountrack","devjourney","dona-joana","cofre"];
const paths=['index.html',...ids.map(id=>'projetos/'+id+'/index.html')];
paths.push(...paths.map(p=>'en/'+p));
for(const path of paths){const html=readFileSync(path,'utf8');assert.ok(html.includes('lang="'+(path.startsWith("en/")?"en":"pt-BR")+'"'));assert.equal((html.match(/<main(?:\s|>)/g)||[]).length,1,path);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path);assert.match(html,/rel="canonical"/);assert.match(html,/property="og:image"/);assert.match(html,/https:\/\/www\.linkedin\.com\/in\/enzolara\//);const found=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(found).size,found.length,path);for(const [tag] of html.matchAll(/<img\b[^>]*>/g))assert.match(tag,/\balt="[^"]+"/);for(const [,href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)){const [p,hash]=href.split('#');const local=p.endsWith('/')?p+'index.html':p;assert.ok(existsSync('.'+local),href);if(hash)assert.ok(readFileSync('.'+local,'utf8').includes('id="'+hash+'"'),href)}for(const [,hash] of html.matchAll(/href="#([^"]+)"/g))assert.ok(found.includes(hash),hash);assert.doesNotMatch(html,/data:application\/pdf;base64/);}
const home=readFileSync('index.html','utf8');for(const id of ids)assert.ok(home.includes('/projetos/'+id+'/'));new Script(readFileSync('assets/site.js','utf8'));assert.ok(readFileSync('assets/curriculo-enzo-almeida.pdf').subarray(0,5).toString()==='%PDF-');assert.ok(existsSync('og-image.png'));console.log('OK: 30 páginas, links internos, semântica básica, metadados e JS.');
for(const path of paths){const html=readFileSync(path,'utf8');assert.doesNotMatch(html,/raw\.githubusercontent\.com/);const canonical=html.match(/rel="canonical" href="([^"]+)"/)[1];assert.ok(readFileSync('sitemap.xml','utf8').includes(canonical));const og=html.match(/property="og:image" content="https:\/\/portfolio-enzo-almeida\.vercel\.app([^"]+)"/)[1];assert.ok(existsSync('.'+og),og);}

for(const id of ids){const png=readFileSync('assets/og/'+id+'.png');assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);assert.ok(png.length>5000,'Imagem OG possivelmente vazia: '+id);assert.ok(readFileSync('projetos/'+id+'/index.html','utf8').includes('/assets/og/'+id+'.png'));}

// Os quatro PDFs são gerados por `npm run resumes` (scripts/build-resumes.mjs),
// que valida páginas, links e texto na geração. Aqui a checagem é estrutural.
for(const name of ['perfil-profissional-enzo-almeida.pdf','professional-profile-enzo-almeida.pdf','curriculo-enzo-almeida.pdf','curriculo-enzo-almeida-en.pdf']){const pdf=readFileSync('assets/'+name);assert.equal(pdf.subarray(0,5).toString(),'%PDF-',name);assert.ok(pdf.length>20000&&pdf.length<1000000,name+' tamanho inesperado: '+pdf.length);}
for(const [page,docs] of [['index.html',['perfil-profissional-enzo-almeida.pdf','curriculo-enzo-almeida.pdf']],['en/index.html',['professional-profile-enzo-almeida.pdf','curriculo-enzo-almeida-en.pdf']]]){const html=readFileSync(page,'utf8');for(const doc of docs)assert.ok(html.includes('/assets/'+doc),page+' sem link para '+doc);}

// Positioning regression check: inspect public copy in both languages.
for (const path of paths) { const html=readFileSync(path,'utf8'); assert.doesNotMatch(html, /oportunidades profissionais|career opportunities|open to work|disponível para contratação|buscando emprego|seeking (?:a job|new opportunities)/i, path); }
for (const path of ['index.html','en/index.html']) { const html=readFileSync(path,'utf8'); assert.match(html,/Zé Registra/); assert.match(html,/"worksFor"\s*:/); }
