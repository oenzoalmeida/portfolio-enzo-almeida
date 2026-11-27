import { test, expect } from '@playwright/test';

test('efeitos: cursor ilumina cartão, inclina capa e magnetiza botão (ponteiro fino)', async ({ page, isMobile }) => {
  test.skip(isMobile, 'efeitos de cursor só existem com ponteiro fino');
  await page.goto('/');
  const tile = page.locator('#estudo-queueflow');
  await tile.scrollIntoViewIfNeeded();
  const box = await tile.boundingBox();
  await page.mouse.move(box.x + box.width * 0.7, box.y + 80, { steps: 4 });
  await expect.poll(() => tile.evaluate(el => el.style.getPropertyValue('--mx'))).not.toBe('');
  const media = tile.locator('.uniform-cover-media');
  await expect.poll(() => media.evaluate(el => el.style.getPropertyValue('--ry'))).not.toBe('');
  const btn = page.locator('.hero .btn.main').first();
  await btn.scrollIntoViewIfNeeded();
  const bb = await btn.boundingBox();
  await page.mouse.move(bb.x + bb.width * 0.9, bb.y + bb.height * 0.8, { steps: 3 });
  await expect.poll(() => btn.evaluate(el => el.style.getPropertyValue('--tx'))).not.toBe('');
});

test('efeitos: feixe da experiência acompanha a rolagem', async ({ page }) => {
  await page.goto('/');
  const tl = page.locator('.timeline');
  const p0 = Number(await tl.evaluate(el => el.style.getPropertyValue('--p')));
  await tl.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 300);
  await expect.poll(async () => Number(await tl.evaluate(el => el.style.getPropertyValue('--p')))).toBeGreaterThan(p0);
});

test('efeitos: prefers-reduced-motion desliga animações e movimento', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', baseURL: 'http://127.0.0.1:8000' });
  const page = await ctx.newPage();
  for (const path of ['/', '/en/']) {
    await page.goto(path);
    const names = await page.evaluate(() => ['.hero', '.hero .role', '.hero-photo', '.contact', '.hero .btn.main'].flatMap(s => { const e = document.querySelector(s); return ['::before', '::after', null].map(ps => getComputedStyle(e, ps).animationName); }));
    expect(names.every(n => n === 'none')).toBe(true);
    expect(Number(await page.locator('.timeline').evaluate(el => el.style.getPropertyValue('--p')))).toBe(1);
  }
  await ctx.close();
});

test('efeitos: sem rolagem horizontal e capas continuam carregadas em PT e EN', async ({ page }) => {
  for (const path of ['/', '/en/', '/projetos/cofre/', '/en/projetos/queueflow/']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto('/');
  expect(await page.locator('.project-cover-link img').count()).toBe(14);
});

test('navegação em tablet: sem rolagem horizontal, menu até 767 px e uma linha a partir de 768 px', async ({ page }) => {
  for (const w of [700, 720, 768, 820, 900]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const menu = await page.locator('#menu').isVisible();
    expect(menu).toBe(w < 768);
    if (!menu) expect(await page.locator('.navlinks').evaluate(el => el.getBoundingClientRect().height)).toBeLessThan(60);
  }
  await page.setViewportSize({ width: 720, height: 800 });
  await page.goto('/');
  await page.locator('#menu').click();
  await expect(page.locator('#navlinks')).toBeVisible();
  await expect(page.locator('#navlinks a').first()).toBeVisible();
});
