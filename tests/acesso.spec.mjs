import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
// Cobertura especifica das 12 paginas novas de acesso (6 projetos, PT+EN).
const dests={
 pentefino:{name:'PenteFino',system:null,github:null},
 queueflow:{name:'QueueFlow',system:'https://queueflow-backend-oe.azurewebsites.net',github:'https://github.com/oenzoalmeida/queueflow'},
 conferevision:{name:'ConfereVision',system:'https://conferevision.vercel.app',github:'https://github.com/oenzoalmeida/ConfereVision'},
 eventpass:{name:'EventPass',system:'https://eventpass.3.149.24.102.sslip.io/demo',github:'https://github.com/oenzoalmeida/eventpass'},
 pratoja:{name:'PratoJá',system:'https://18.220.70.13.sslip.io',github:'https://github.com/oenzoalmeida/pratoja'},
 autociclo:{name:'AutoCiclo',system:'https://autociclo.vercel.app',github:'https://github.com/oenzoalmeida/autociclo'}};
for(const [slug,d] of Object.entries(dests)){
 for(const en of [false,true]){
  test('acesso '+slug+(en?' EN':' PT'),async({page},info)=>{
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const external=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8000')&&!r.url().startsWith('data:'))external.push(r.url());});
   const path=(en?'/en':'')+'/acesso/'+slug+'/';
   await page.goto(path);
   await expect(page.locator('html')).toHaveAttribute('lang',en?'en':'pt-BR');
   await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('h1')).toHaveText(d.name);
   // Botoes por disponibilidade validada
   const btns=page.locator('main a.btn');
   const expected=(d.system?1:0)+(d.github?1:0)+1;
   await expect(btns).toHaveCount(expected);
   if(d.system){const b=page.locator('main a.btn.primary').first();await expect(b).toHaveAttribute('href',d.system);await expect(b).toHaveAttribute('rel',/noopener/);}
   if(d.github){await expect(page.locator('main a.btn[href="'+d.github+'"]')).toHaveCount(1);}
   else{await expect(page.locator('main a[href*="github.com"]')).toHaveCount(0);}
   const details=page.locator('main a.btn[href$="/projetos/'+slug+'/"]');
   await expect(details).toHaveCount(1);
   // Sem duplicidade de destinos na pagina
   const hrefs=await btns.evaluateAll(els=>els.map(e=>e.getAttribute('href')));
   expect(new Set(hrefs).size).toBe(hrefs.length);
   // Navegacao: detalhes abrem o estudo de caso
   await details.click();
   await expect(page).toHaveURL(new RegExp((en?'/en':'')+'/projetos/'+slug+'/$'));
   await page.goto(path);
   // Troca de idioma por link (sem scripts)
   const langLink=page.locator('.lang a', {hasText: en?'PT':'EN'});
   await langLink.click();
   await expect(page).toHaveURL(new RegExp((en?'':'/en')+'/acesso/'+slug+'/$'));
   await page.goto(path);
   // Link "voltar"
   await expect(page.locator('a.back')).toHaveAttribute('href',en?'/en/':'/');
   // Responsividade
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   // Sem scripts nem recursos externos (CSP do site)
   expect(await page.locator('script').count()).toBe(0);
   expect(errors).toEqual([]);
   expect(external).toEqual([]);
   await page.screenshot({path:info.outputPath('acesso-'+slug+(en?'-en':'-pt')+'.png'),fullPage:true});
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   expect(audit.violations.map(v=>v.id)).toEqual([]);
  });
 }
}
// Uma unica pagina de acesso por projeto (sem duplicidades na secao)
test('sem duplicidades de acesso',async({page})=>{
 for(const slug of Object.keys(dests)){
  const r1=await page.request.get('/acesso/'+slug+'/');expect(r1.ok()).toBeTruthy();
  const r2=await page.request.get('/en/acesso/'+slug+'/');expect(r2.ok()).toBeTruthy();
 }
});
