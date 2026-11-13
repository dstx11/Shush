import {test,expect} from '@playwright/test';
const representative=(name:string)=>['desktop-1366','mobile-390','mobile-webkit'].includes(name);

test('The first paint is a full-screen SHUSH experience before JavaScript resolves',async ({page},info)=>{
 test.skip(!representative(info.project.name),'Representative initial-load coverage');
 await page.emulateMedia({reducedMotion:'no-preference'});
 let unblock!:()=>void;
 const gate=new Promise<void>(r=>{unblock=r});
 await page.route('**/assets/index-*.js',async route=>{await gate;await route.continue()});
 await page.goto('/',{waitUntil:'commit'});
 await expect(page.locator('#shush-boot-stage')).toBeVisible();
 await expect(page.locator('.home-lineup > a')).toHaveCount(7);
 expect(await page.evaluate(()=>Boolean(document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('#shush-boot-stage')))).toBe(true);
 unblock();
 await expect(page.locator('#shush-boot-stage')).toHaveCount(0,{timeout:5000});
 await expect(page.getByRole('dialog',{name:'Entrada SHUSH'})).toHaveCount(0,{timeout:7000});
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
});
test('Cinematic intro is automatic, has no Enter button, and remains dismissible by Escape',async ({page},info)=>{
 test.skip(!representative(info.project.name),'Representative accessibility coverage');
 await page.clock.install({time:new Date('2026-11-12T12:00:00Z')});
 await page.clock.pauseAt(Date.parse('2026-11-12T12:00:00Z')+100);
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 const intro=page.getByRole('dialog',{name:'Entrada SHUSH'});
 await expect(intro).toBeVisible();
 await expect(intro.getByRole('button', {name: /Saltar apresentação/})).toBeVisible();
 await expect(intro).toHaveAttribute('aria-describedby','intro-description');
 await page.keyboard.press('Escape');
 await expect(intro).toHaveCount(0);
 await expect(page.locator('#main-content')).toBeFocused();
});
test('Reduced motion disables the blocking intro but preserves the page',async ({page},info)=>{
 test.skip(!representative(info.project.name),'Representative accessibility coverage');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('#shush-boot-stage')).toHaveCount(0);
 await expect(page.getByRole('dialog',{name:'Entrada SHUSH'})).toHaveCount(0);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
});
test('Motion setting is keyboard accessible, persistent and disables visual animations',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390'].includes(info.project.name),'Representative preference persistence');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 await expect(page.getByRole('dialog',{name:'Entrada SHUSH'})).toHaveCount(0,{timeout:7000});
 const toggle=page.getByRole('button',{name:'Reduzir animações'});
 await toggle.focus();
 await page.keyboard.press('Enter');
 await expect(toggle).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('html')).toHaveAttribute('data-motion','reduce');
 await page.reload();
 await expect(page.getByRole('dialog',{name:'Entrada SHUSH'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Reduzir animações'})).toHaveAttribute('aria-pressed','true');
});
test('The content panels use real records and the origin no longer lists personal nick references',async ({page})=>{
 await page.goto('/');
 await expect(page.locator('.shush-signals')).toContainText('O grupo fica.');
 await expect(page.locator('.home-score')).toHaveCount(3);
 await expect(page.locator('.home-lineup > a')).toHaveCount(7);
 await page.goto('/company');
 await expect(page.locator('.about-origin-story')).not.toContainText('contraponto ao Less');
 await expect(page.locator('.about-origin-story')).not.toContainText('ao aspas');
 await expect(page.locator('.about-perspective h2')).toBeVisible();
});
test('Non-JavaScript visits remain usable without the intro overlay',async ({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});
 try{
  const page=await context.newPage();
  await page.goto('/');
  await expect(page.locator('#shush-boot-stage')).toBeHidden();
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page.locator('.home-lineup>a')).toHaveCount(7);
 }finally{await context.close();}
});
