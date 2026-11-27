import {test,expect} from '@playwright/test';
import {cases} from '../content/cases.mjs';
const ids=Object.keys(cases);
const ptHeadings=['Disponibilidade','Contexto e problema','Fluxo de funcionamento','Regras de negócio','Desafios técnicos e soluções','Segurança e privacidade','Testes e evidências','Aprendizados','Situação atual'];
const enHeadings=['Availability','Context and problem','How it works','Business rules','Technical challenges and solutions','Security and privacy','Tests and evidence','Lessons learned','Current status'];
test('14 projetos documentados', () => { expect(ids).toHaveLength(14); });
for(const id of ids){
 test('equivalência PT/EN '+id, () => {
  const a=cases[id].pt,b=cases[id].en;
  for(const k of ['flow','rules','challenges','security','tests','learn','avail']) expect(b[k].length,k).toBe(a[k].length);
 });
 test('estudo enriquecido '+id, async({page}) => {
  for(const [prefix,heads] of [['',ptHeadings],['/en',enHeadings]]){
   await page.goto(prefix+'/projetos/'+id+'/');
   const article=page.locator('main article');
   for(const h of heads) await expect(article.getByRole('heading',{name:h,exact:true}),prefix+id+h).toHaveCount(1);
   await expect(article.locator('dl.availability > div')).toHaveCount(4);
   const text=await article.innerText();
   expect(text).not.toContain('\u2014');
   expect(text).not.toMatch(/AKIA|BEGIN [A-Z ]*PRIVATE KEY|password\s*[:=]|senha\s*[:=]/i);
   for(const img of await page.locator('main img').all()){ await img.scrollIntoViewIfNeeded(); await expect(img).toHaveJSProperty('complete',true); expect(await img.evaluate(i=>i.naturalWidth)).toBeGreaterThan(0); }
  }
 });
}

const applicationLinks = [
  [
    "queueflow",
    "https://queueflow-backend-oe.azurewebsites.net",
    "Acessar aplicação",
    "Open application",
    "Acesso com login",
    "Sign-in required"
  ],
  [
    "conferevision",
    "https://conferevision.vercel.app",
    "Acessar aplicação",
    "Open application",
    "Acesso com login",
    "Sign-in required"
  ],
  [
    "autociclo",
    "https://autociclo.vercel.app",
    "Conhecer o projeto",
    "Explore the project",
    "Página de apresentação",
    "Public overview"
  ]
];
for (const [id, href, ptLink, enLink, ptAccess, enAccess] of applicationLinks) {
 test('rótulos de acesso PT/EN: ' + id, async ({page}) => {
  for (const [prefix, label, field, access] of [['',ptLink,'Aplicação',ptAccess],['/en',enLink,'Application',enAccess]]) {
   await page.goto(prefix + '/');
   await expect(page.locator('#estudo-' + id).getByRole('link', {name: label + ' ↗', exact: true})).toHaveAttribute('href', href);
   await page.goto(prefix + '/projetos/' + id + '/');
   await expect(page.getByRole('link', {name: label + ' ↗', exact: true})).toHaveAttribute('href', href);
   const availability = page.locator('dl.availability > div').filter({has: page.getByText(field, {exact: true})});
   await expect(availability.locator('dd')).toHaveText(access);
  }
 });
}
