import {test,expect} from '@playwright/test';

// Calendar, live DOM theme, and the interactions that make each edition meaningful.
const cases=[
 ['base','2026-11-12','O nome é SHUSH.'],
 ['christmas','2026-12-12','O lobby ainda'],
 ['newyear','2026-12-30','Mudou o ano.'],
 ['carnival','2027-02-09','Hoje ninguém joga'],
 ['valentines','2027-02-14','Há duos'],
 ['easter','2027-03-28','Deixámos pistas.'],
 ['summer','2027-07-15','Só mais uma.'],
 ['halloween','2027-10-31','Há passos.']
] as const;
for(const [season,date,headline] of cases){
 test('Edition '+season+' activates with correct intro and hero',async ({page},info)=>{
  test.skip(!['desktop-1366','mobile-390'].includes(info.project.name),'Representative campaign coverage');
  await page.clock.install({time:new Date(date+'T12:00:00Z')});
  await page.goto('/');
  await expect(page.locator('.shush-root')).toHaveAttribute('data-season',season);
  await expect(page.getByRole('heading',{level:1})).toContainText(headline);
  if(season==='christmas'){
   await expect(page.locator('.winter-tree-canvas')).toBeAttached();
   await expect(page.locator('.winter-player-ornament')).toHaveCount(7);
   await expect(page.locator('.winter-tree-stage canvas')).toHaveCount(1);
   await expect(page.locator('.winter-ornament-tree, .winter-ornament-silhouette')).toHaveCount(0);
   await expect(page.locator('.winter-ornament-constellation')).toBeVisible();
  }else{
   await expect(page.locator('.winter-tree-canvas')).toHaveCount(0);
   await expect(page.locator('.team-cover-player')).toHaveCount(3);
   await expect(page.locator('.season-art')).toBeAttached();
  }
  await page.screenshot({path:info.outputPath(`campaign-${season}.png`),animations:'disabled'});
  const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  expect(width[1]).toBeLessThanOrEqual(width[0]+1);
 });
}
test('Valentine duo preview is immediately editable',async ({page})=>{
 await page.clock.install({time:new Date('2027-02-14T12:00:00Z')});
 await page.goto('/');
 await page.getByRole('textbox',{name:'Primeiro nick'}).fill('More');
 await page.getByRole('textbox',{name:'Segundo nick'}).fill('DSTX');
 await expect(page.locator('.season-duo-output')).toContainText('More + DSTX');
});
test('Carnival reveals a real roster member without changing his identity',async ({page})=>{
 await page.clock.install({time:new Date('2027-02-09T12:00:00Z')});
 await page.goto('/');
 const scene=page.locator('.season-incognito-art');
 await expect(scene).toContainText('???');
 await page.getByRole('button',{name:'Revelar nick'}).click();
 await expect(scene).not.toContainText('???');
 await page.getByRole('button',{name:'Outro jogador'}).click();
 await expect(scene).toContainText('???');
});
test('Easter secrets are explicit and accessible',async ({page})=>{
 await page.clock.install({time:new Date('2027-03-28T12:00:00Z')});
 await page.goto('/');
 const first=page.locator('.season-hidden-grid button').first();
 await expect(first).toHaveAttribute('aria-expanded','false');
 await first.click();
 await expect(first).toHaveAttribute('aria-expanded','true');
 await expect(first).toContainText('2022');
});
test('Summer and Halloween controls change state without a canvas loop',async ({page})=>{
 await page.clock.install({time:new Date('2027-07-15T12:00:00Z')});
 await page.goto('/');
 await page.getByRole('button',{name:'Ver o amanhecer'}).click();
 await expect(page.locator('.season-afterhours')).toHaveClass(/is-day/);
 await page.clock.setFixedTime(new Date('2027-10-31T12:00:00Z'));
 await page.reload();
 await page.getByRole('button',{name:'Acender luzes'}).click();
 await expect(page.locator('.season-dead-silence')).toHaveClass(/is-lit/);
});
test('A suspended tab updates its theme after midnight',async ({page})=>{
 await page.clock.install({time:new Date('2026-12-26T23:59:00Z')});
 await page.goto('/');
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','christmas');
 await page.clock.fastForward(120_000);
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','newyear');
});

test('Christmas styling loads on a direct roster visit and cannot leak into New Year',async ({page})=>{
 await page.clock.install({time:new Date('2026-12-26T23:59:00Z')});
 await page.goto('/esports/valorant/roster');
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','christmas');
 await expect.poll(()=>page.locator('.shush-root').evaluate(node=>getComputedStyle(node).getPropertyValue('--font-heading'))).toContain('SHUSH Hearth');
 await page.clock.fastForward(120_000);
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','newyear');
 await expect.poll(()=>page.locator('.shush-root').evaluate(node=>getComputedStyle(node).getPropertyValue('--font-heading'))).toContain('Manrope');
});
