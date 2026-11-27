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
