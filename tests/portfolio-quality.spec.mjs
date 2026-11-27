import {test,expect} from '@playwright/test';
const ids=["pentefino","mountrack","dona-joana","cofre","devjourney","queueflow","conferevision","eventpass","pratoja","autociclo","taskflow","sistema-estoque","consumo-energia","calculadora-python"];
const privateIds=["pentefino","mountrack","dona-joana","cofre","devjourney"];
for(const prefix of ['', '/en']){
 test('uniform cover frames '+prefix,async({page})=>{
  await page.goto(prefix+'/');
  const covers=page.locator('#projetos .uniform-cover');await expect(covers).toHaveCount(14);
  for(const cover of await covers.all()){
   await cover.scrollIntoViewIfNeeded();await expect(cover.locator('.uniform-cover-heading')).toBeVisible();await expect(cover.locator('.uniform-cover-media')).toBeVisible();
   const b=await cover.boundingBox();expect(Math.abs(b.width/b.height-1200/630)).toBeLessThan(.04);
   expect(await cover.evaluate(e=>e.scrollHeight<=e.clientHeight+1&&e.scrollWidth<=e.clientWidth+1)).toBe(true);
  }
  await expect(covers.locator('img')).toHaveCount(9);await expect(covers.locator('.cover-illustration')).toHaveCount(5);
 });
 test('case study structure '+prefix,async({page})=>{
  for(const id of ids){await page.goto(prefix+'/projetos/'+id+'/');const article=page.locator('main article');await expect(article.locator('.architecture-flow')).toHaveCount(1);await expect(article.locator('h2')).not.toHaveCount(0);expect(await article.locator('h2').count()).toBeGreaterThanOrEqual(6);await expect(article.locator('.evidence')).toHaveCount(1);await expect(article.getByRole('heading',{name:prefix?'Main features':'Principais funcionalidades',exact:true})).toHaveCount(1);if(privateIds.includes(id))await expect(page.locator('main a[href*="github.com/oenzoalmeida/"]')).toHaveCount(0);}
 });
}
