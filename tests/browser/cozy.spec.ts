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
