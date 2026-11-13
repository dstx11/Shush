import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const representative=(name:string)=>['desktop-1366','mobile-390','mobile-webkit'].includes(name);
test.beforeEach(async ({page},info)=>{
 test.skip(!representative(info.project.name),'LAB tested on representative desktop, mobile and WebKit');
 await page.clock.setFixedTime(new Date('2026-11-13T12:00:00Z'));
 await page.goto('/');
});
async function openLab(page:import('@playwright/test').Page){
 await expect(page.getByRole('dialog',{name:'Entrada SHUSH'})).toHaveCount(0,{timeout:6500});
 await page.keyboard.press('Alt+Shift+S');
 await expect(page.getByRole('dialog',{name:'SHUSH LAB'})).toBeVisible();
}
test('LAB has a real keyboard entrance, usable sections and accessible modal',async ({page})=>{
 await openLab(page);
 const lab=page.getByRole('dialog',{name:'SHUSH LAB'});
 await expect(lab).toContainText('LAB');
 await expect(lab.locator('.lab-top strong')).toBeVisible();
 await lab.locator('.lab-side').getByRole('button',{name:/Componentes/}).click();
 await lab.getByRole('button',{name:/Selecionar este estado/}).click();
 await expect(lab.getByRole('button',{name:/Selecionado/})).toHaveAttribute('aria-pressed','true');
 const axe=await new AxeBuilder({page}).include('.shush-lab').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(axe.violations.map(v=>({id:v.id,target:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.keyboard.press('Escape');
 await expect(lab).toHaveCount(0);
});
test('season preview can be cancelled; committed choice persists and resets',async ({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','base');
 await openLab(page);
 let lab=page.getByRole('dialog',{name:'SHUSH LAB'});
 await lab.locator('.lab-side').getByRole('button',{name:/Seasons/}).click();
 await lab.locator('.lab-season-choice').last().click();
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','halloween');
 await lab.getByRole('button',{name:'Cancelar pré-visualização'}).click();
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','base');
 await lab.locator('.lab-season-choice').last().click();
 await lab.getByRole('button',{name:'Aplicar esta edição'}).click();
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','halloween');
 await lab.getByRole('button',{name:/Fechar SHUSH LAB/}).click();
 await page.reload();
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','halloween');
 await openLab(page);
 lab=page.getByRole('dialog',{name:'SHUSH LAB'});
 await lab.locator('.lab-side').getByRole('button',{name:/Seasons/}).click();
 await lab.getByRole('button',{name:'Usar calendário automático'}).click();
 await expect(page.locator('.shush-root')).toHaveAttribute('data-season','base');
});
test('motion controls change an actual animation; observatory shows browser data',async ({page})=>{
 await openLab(page);
 const lab=page.getByRole('dialog',{name:'SHUSH LAB'});
 await lab.locator('.lab-side').getByRole('button',{name:/Motion/}).click();
 await expect(lab.locator('.lab-demo')).toHaveAttribute('style',/--demo-duration: 850ms/);
 await lab.locator('.lab-controls input[type="range"]').first().focus();
 await page.keyboard.press('End');
 await expect(lab.locator('.lab-demo')).toHaveAttribute('style',/--demo-duration: 1800ms/);
 await lab.getByRole('button',{name:'Pausar'}).click();
 await expect(lab.locator('.lab-demo-object')).toHaveClass(/is-paused/);
 await lab.locator('.lab-side').getByRole('button',{name:/Performance/}).click();
 await expect(lab.locator('.lab-metrics')).toContainText('Recursos carregados');
 await expect(lab.locator('.lab-metrics')).not.toContainText('A medir…',{timeout:5000});
});
test('exact browser title stays Shush on public routes and missing pages',async ({page})=>{
 for(const path of ['/','/esports/valorant/premier','/esports/valorant/roster','/content','/company','/products/jersey','/missing-shush-page']){
  await page.goto(path);
  await expect(page).toHaveTitle('Shush');
 }
});
