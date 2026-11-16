import {test,expect} from '@playwright/test';
import {routeMetadata} from '../../src/data/meta';

// The before reference is the deployed website, captured before this PR is merged.
// These are evidence files, not automatically approved screenshot baselines.
for(const [name,path] of Object.entries({home:'/',roster:'/esports/valorant/roster?player=more',premier:'/esports/valorant/premier',drop:'/products/jersey',creators:'/content',about:'/company'})){
 test(`review before and after: ${name}`,async({page},info)=>{
  test.setTimeout(60000);
  await page.addInitScript(()=>{localStorage.setItem('shush:motion:v1','reduce');localStorage.setItem('shush:season:v1','base');localStorage.setItem('shush:home:rotation:v1','3');});
  for(const version of ['before','after']){
   await page.goto(version==='before'?`https://shush.pt${path}`:path);
   await expect(page.locator('.shush-root')).toHaveAttribute('data-entering','false');
   await expect(page.getByRole('heading',{level:1})).toBeVisible();
   await page.evaluate(async()=>{for(const image of document.images)image.loading='eager';await Promise.allSettled([...document.images].map(image=>image.decode()));await document.fonts.ready;window.scrollTo(0,0);});
   await page.mouse.move(0,0);
   await page.screenshot({path:info.outputPath(`${name}-${version}.png`),fullPage:true,animations:'disabled'});
   if(version==='after'){
    await expect(page).toHaveTitle(routeMetadata[path.split('?')[0]].title);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   }
  }
 });
}

const representative=(project:string)=>['desktop-1366','mobile-390','mobile-webkit'].includes(project);
test('identity and jersey cards export the exact preview and recover focus',async({page},info)=>{
 test.skip(!representative(info.project.name),'Representative image export engines');
 for(const kind of ['player','jersey']){
  await page.goto(kind==='player'?'/esports/valorant/roster?player=more':'/products/jersey?drop=1&nick=東京%20SHUSH&number=07&size=L&phrase=S%C3%B3%20rounds.');
  if(kind==='player')await page.getByRole('button',{name:'Abrir dossier de More',exact:true}).click();
  const trigger=page.getByRole('button',{name:kind==='player'?'Criar cartão do jogador':'Criar cartão da camisola',exact:true});
  await trigger.click();
  const dialog=page.getByRole('dialog',{name:kind==='player'?'Cartão do jogador':'Cartão da camisola',exact:true});
  await expect(dialog).toBeVisible();
  const png=dialog.getByRole('button',{name:'Descarregar PNG ↓',exact:true});
  await expect(png).toBeEnabled();
  await page.keyboard.press('ArrowRight');
  if(kind==='player')await expect(page.getByRole('dialog',{name:'More',exact:true})).toBeVisible();
  const canvas=dialog.locator('canvas');
  expect(await canvas.evaluate(node=>[node.width,node.height])).toEqual([1080,1350]);
  await dialog.getByRole('button',{name:'Quadrado',exact:true}).click();
  await dialog.getByRole('button',{name:'Vertical',exact:true}).click();
  await expect(png).toBeEnabled();
  expect(await canvas.evaluate(node=>node.height)).toBe(1350);
  const preview=await canvas.evaluate(node=>node.toDataURL('image/png').split(',')[1]);
  const download=page.waitForEvent('download');await png.click();
  const file=await download;
  expect(file.suggestedFilename()).toMatch(/1080x1350\.png$/);
  const bytes=Buffer.concat(await (await file.createReadStream())!.toArray());
  expect(bytes.equals(Buffer.from(preview,'base64'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  if(kind==='player'){await expect(page.getByRole('dialog',{name:'More',exact:true})).toBeVisible();await page.keyboard.press('Escape');}
 }
});

test('card resource failure can retry and an export error never loses the studio',async({page},info)=>{
 test.skip(!representative(info.project.name),'Representative failures');
 let failed=true;
 await page.route('**/assets/jersey/backjersey.webp',route=>failed?route.abort():route.continue());
 await page.goto('/products/jersey');
 await page.getByRole('button',{name:'Criar cartão da camisola',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Cartão da camisola',exact:true});
 await expect(dialog.getByRole('alert')).toContainText('Não foi possível preparar');
 await expect(dialog.getByRole('button',{name:'Descarregar PNG ↓'})).toBeDisabled();
 failed=false;await dialog.getByRole('button',{name:'Tentar novamente'}).click();
 const png=dialog.getByRole('button',{name:'Descarregar PNG ↓'});await expect(png).toBeEnabled();
 await page.evaluate(()=>{HTMLCanvasElement.prototype.toBlob=function(callback){callback(null);};});
 await png.click();await expect(dialog.getByRole('alert')).toContainText('Não foi possível exportar');
 await expect(dialog).toBeVisible();await expect(png).toBeEnabled();
});

test('fast player selection has one current portrait and a stable stage',async({page},info)=>{
 test.skip(!representative(info.project.name),'Representative selector behavior');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/esports/valorant/roster');
 await expect(page.locator('.shush-root')).toHaveAttribute('data-entering','false');
 const stage=page.locator('.character-spotlight');
 const width=(await stage.boundingBox())!.width;
 for(const key of ['7','2','6','3','1'])await page.keyboard.press(key);
 await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
 await expect(page.locator('.player-card-select[aria-pressed="true"]')).toHaveCount(1);
 await expect(page.locator('.character-media>img')).toHaveCount(1);
 await expect(page.locator('.portrait-depart')).toHaveCount(0,{timeout:2000});
 expect((await stage.boundingBox())!.width).toBe(width);
});
