import { test, expect } from '@playwright/test';

test('prerendered pages remain readable and linked while the entry module is delayed', async ({page}) => {
  let resume!: () => void;
  const gate = new Promise<void>(resolve => { resume = resolve; });
  await page.route('**/assets/index-*.js', async route => { await gate; await route.continue(); });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    const hero = page.getByRole('link', {name:'Conhecer o roster'});
    await expect(hero).toBeVisible();
    await expect(page.locator('#shush-boot-stage')).toHaveCSS('pointer-events', 'none');
    await expect(page.locator('.lux-lineup > a')).toHaveCount(7);
    await hero.focus();
    await expect(hero).toBeFocused();
  } finally { resume(); }
  await expect(page.locator('#shush-boot-stage')).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('The content panels use real records and the origin no longer lists personal nick references',async ({page})=>{
 await page.goto('/');
 await expect(page.locator('.shush-signals')).toContainText('O grupo fica.');
 await expect(page.locator('.lux-score')).toHaveCount(3);
 await expect(page.locator('.lux-lineup > a')).toHaveCount(7);
 await page.goto('/company');
 await expect(page.locator('.story-origin-copy')).not.toContainText('contraponto ao Less');
 await expect(page.locator('.story-origin-copy')).not.toContainText('ao aspas');
 await expect(page.locator('.story-team h2')).toBeVisible();
});
test('Non-JavaScript visits remain usable without the intro overlay',async ({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});
 try{
  const page=await context.newPage();
  await page.goto('/');
  await expect(page.locator('#shush-boot-stage')).toBeHidden();
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page.locator('.lux-lineup>a')).toHaveCount(7);
 }finally{await context.close();}
});
