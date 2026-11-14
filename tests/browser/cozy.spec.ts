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
