import {test,expect} from '@playwright/test';

test('copy feedback changes visibly without moving the controls',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390','mobile-webkit'].includes(info.project.name),'Representative pointer/touch engines');
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{}},configurable:true}));
 for(const [path,name,success] of [['/esports/valorant/roster','Copiar Riot ID','Riot ID copiado.'],['/products/jersey','Copiar resumo','Resumo copiado.']]){
  await page.goto(path);
  const button=page.getByRole('button',{name,exact:true});
  const before=await button.boundingBox();
  await button.click();
  await expect(button).toContainText('Copiado');
  await expect(button).toHaveAttribute('data-transfer','success');
  await expect(page.getByRole('status').filter({hasText:success})).toBeVisible();
  const after=await button.boundingBox();
  expect(Math.abs(after!.width-before!.width)).toBeLessThan(1);
  expect(Math.abs(after!.height-before!.height)).toBeLessThan(1);
  await expect(button).toBeEnabled();
 }
});

test('reset can be undone with configuration, view, URL and focus restored',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390','mobile-webkit'].includes(info.project.name),'Representative form engines');
 await page.goto('/products/jersey?drop=1&nick=MORE&number=13&size=L&phrase=Round');
 const original=page.url();
 await page.getByRole('button',{name:'Repor',exact:true}).click();
 await expect(page.getByLabel('Nick',{exact:true})).toHaveValue('SHUSH');
 await page.getByRole('button',{name:'Desfazer reposição',exact:true}).click();
 await expect(page.getByLabel('Nick',{exact:true})).toHaveValue('MORE');
 await expect(page.getByLabel('Número',{exact:true})).toHaveValue('13');
 await expect(page.getByRole('radio',{name:'L',exact:true})).toBeChecked();
 await expect(page.getByLabel('Frase opcional',{exact:true})).toHaveValue('Round');
 await expect(page).toHaveURL(original);
 await expect(page.getByLabel('Pré-visualização: MORE 13',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Repor',exact:true})).toBeFocused();
 await expect(page.getByRole('button',{name:'Desfazer reposição',exact:true})).toHaveCount(0);
});

test('pointer and button feedback leave the content geometry stable',async ({page},info)=>{
 test.skip(info.project.name!=='desktop-1366','Fine-pointer geometry');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/esports/valorant/roster');
 await expect(page.getByRole('dialog',{name:'Entrada SHUSH'})).toHaveCount(0,{timeout:6500});
 const image=page.locator('.character-media>img');
 await image.scrollIntoViewIfNeeded();
 const position=()=>image.evaluate(node=>{const r=node.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY};});
 const before=await position();
 await page.locator('.character-media').hover({position:{x:80,y:140}});
 await expect.poll(()=>page.locator('.character-media').evaluate(node=>(node as HTMLElement).style.getPropertyValue('--lens-x'))).not.toBe('');
 const after=await position();
 expect(Math.abs(after.x-before.x)).toBeLessThan(1);
 expect(Math.abs(after.y-before.y)).toBeLessThan(1);
 const button=page.getByRole('button',{name:'Copiar Riot ID',exact:true});
 await button.scrollIntoViewIfNeeded();
 const initial=await button.boundingBox();
 await button.hover();
 const hovered=await button.boundingBox();
 expect(Math.abs(initial!.x-hovered!.x)).toBeLessThan(1);
 expect(Math.abs(initial!.y-hovered!.y)).toBeLessThan(1);
});

test('layout: navigation is centred and player actions share an alignment',async ({page})=>{
 await page.goto('/esports/valorant/roster');
 await expect(page.locator('#shush-boot-stage')).toHaveCount(0);
 await expect(page.locator('.shush-root')).toHaveAttribute('data-entering','false');
 const navigation=page.locator('.desktop-navigation');
 if(await navigation.isVisible()){
  const menu=await navigation.boundingBox();
  expect(Math.abs(menu!.x+menu!.width/2-(await page.evaluate(()=>document.documentElement.clientWidth))/2)).toBeLessThan(1);
  const brand=await page.locator('header .brand-mark').boundingBox();
  const utilities=await page.locator('.header-utilities').boundingBox();
  expect(menu!.x-brand!.x-brand!.width).toBeGreaterThan(8);
  expect(utilities!.x-menu!.x-menu!.width).toBeGreaterThan(8);
 }
 const copy=await page.getByRole('button',{name:'Copiar Riot ID',exact:true}).boundingBox();
 const share=await page.getByRole('button',{name:'Partilhar jogador',exact:true}).boundingBox();
 expect(Math.abs(copy!.width-share!.width)).toBeLessThan(1);
});

test('dossier: keyboard selection keeps navigation in reach and restores lobby focus',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390','mobile-webkit','landscape-844'].includes(info.project.name),'Representative modal layouts');
 await page.goto('/esports/valorant/roster?player=dstx');
 await page.getByRole('button',{name:'Abrir dossier de DSTX',exact:true}).click();
 let dossier=page.getByRole('dialog',{name:'DSTX',exact:true});
 await expect(dossier).toBeVisible();
 await expect(dossier.getByRole('button',{name:'Voltar ao lobby',exact:true})).toBeFocused();
 await page.keyboard.press('ArrowRight');
 dossier=page.getByRole('dialog',{name:'More',exact:true});
 await expect(dossier).toBeVisible();
 await expect(dossier.getByRole('status')).toHaveText('2 / 7');
 await expect(dossier.getByRole('link',{name:'Personalizar camisola',exact:true})).toHaveAttribute('href',/nick=More&number=13/);
 await expect(dossier.getByRole('button',{name:'Voltar ao lobby',exact:true})).toBeFocused();
 const controls=await dossier.locator('.dossier-navigation').boundingBox();
 expect(controls!.y).toBeGreaterThanOrEqual(0);
 expect(controls!.y+controls!.height).toBeLessThanOrEqual(page.viewportSize()!.height+1);
 await dossier.getByRole('button',{name:'Jogador anterior',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'DSTX',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Abrir dossier de DSTX',exact:true})).toBeFocused();
});

test('draft recovery can be undone without losing unsaved edits, view or saved data',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390','mobile-webkit'].includes(info.project.name),'Representative draft engines');
 await page.goto('/products/jersey?drop=1&nick=MORE&number=13&size=L&phrase=Round');
 await page.locator('.drop-draft summary').click();
 await page.getByRole('button',{name:'Guardar rascunho',exact:true}).click();
 await expect(page.locator('.draft-state')).toHaveText('Guardado');
 await page.getByLabel('Nick',{exact:true}).fill('TEMP');
 await page.getByLabel('Número',{exact:true}).fill('19');
 await page.getByRole('button',{name:/Frente/}).click();
 const original=page.url();
 await expect(page.locator('.draft-state')).toHaveText('Alterações por guardar');
 await page.getByRole('button',{name:'Recuperar rascunho',exact:true}).click();
 await expect(page.getByLabel('Nick',{exact:true})).toHaveValue('MORE');
 await expect(page.locator('.draft-state')).toHaveText('Guardado');
 await page.getByRole('button',{name:'Desfazer recuperação',exact:true}).click();
 await expect(page.getByLabel('Nick',{exact:true})).toHaveValue('TEMP');
 await expect(page.getByLabel('Número',{exact:true})).toHaveValue('19');
 await expect(page).toHaveURL(original);
 await expect(page.locator('.drop-view-control button[aria-pressed="true"]')).toContainText('Frente');
 await expect(page.locator('.draft-state')).toHaveText('Alterações por guardar');
 await expect(page.getByRole('button',{name:'Recuperar rascunho',exact:true})).toBeFocused();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('shush:drop01:draft:v1')!).config);
 expect(stored.nick).toBe('MORE');
 expect(stored.number).toBe('13');
});
