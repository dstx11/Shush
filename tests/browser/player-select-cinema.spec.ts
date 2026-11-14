import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Seven real players have individual signatures and respond to precise navigation',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390','mobile-webkit'].includes(info.project.name),'Representative selectors');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/esports/valorant/roster?player=dstx');
 const scene=page.locator('.character-media');
 await expect(page.locator('.character-geometry-mark path')).toHaveCount(3);
 await expect(page.locator('.character-signature-scene')).toHaveCount(1);
 await expect(page.getByRole('button',{name:'Ativar som de seleção'})).toHaveAttribute('aria-pressed','false');
 await page.keyboard.press('7');
 await expect(page.locator('#selected-player-name')).toHaveText('Catty');
 await expect(page.locator('.character-geometry-mark path')).toHaveCount(3);
 await expect(page).toHaveURL(/player=catty/);
 await page.getByRole('button',{name:'Jogador seguinte'}).click();
 await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
 await page.locator('.player-card-select').nth(2).focus();
 await page.keyboard.press('End');
 await expect(page.locator('#selected-player-name')).toHaveText('Catty');
 await expect(page.locator('.player-card-select').last()).toBeFocused();
 await page.keyboard.press('Home');
 await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
 await expect(page.locator('.player-card-select').first()).toBeFocused();
 await expect(scene).toBeVisible();
 const axe=await new AxeBuilder({page}).include('.player-page').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(axe.violations.map(v=>({id:v.id,target:v.nodes.map(n=>n.target)}))).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
});

test('Cinema pointer is composited; replay and optional audio are explicitly controlled',async ({page},info)=>{
 test.skip(info.project.name!=='desktop-1366','Fine pointer and replay coverage');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/esports/valorant/roster?player=more');
 await expect(page.locator('.brand-intro')).toHaveCount(0,{timeout:6500});
 const scene=page.locator('.character-media');
 await scene.hover({position:{x:80,y:140}});
 await expect.poll(()=>scene.evaluate(node=>(node as HTMLElement).style.getPropertyValue('--lens-x'))).not.toBe('');
 await page.mouse.move(0,0);
 await expect.poll(()=>scene.evaluate(node=>(node as HTMLElement).style.getPropertyValue('--lens-x'))).toBe('');
 const before=await scene.getAttribute('data-stage-visible');
 await page.getByRole('button',{name:'Rever entrada do jogador'}).click();
 await expect(page.locator('.character-geometry-mark')).toBeVisible();
 await page.getByRole('button',{name:'Ativar som de seleção'}).click();
 await expect(page.getByRole('button',{name:'Desativar som de seleção'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Desativar som de seleção'}).click();
 await expect(page.getByRole('button',{name:'Ativar som de seleção'})).toHaveAttribute('aria-pressed','false');
 expect(before).not.toBeNull();
});

test('One Christmas tree and seven interactive ornaments, without a decorative duplicate',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390'].includes(info.project.name),'Representative winter coverage');
 await page.clock.install({time:new Date('2026-12-12T12:00:00Z')});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('.winter-tree-stage canvas')).toHaveCount(1);
 await expect(page.locator('.winter-ornament-silhouette, .winter-ornament-tree')).toHaveCount(0);
 await expect(page.locator('.winter-ornament-constellation')).toBeVisible();
 await expect(page.locator('.winter-player-ornament')).toHaveCount(7);
 await page.getByRole('button',{name:'Ver ornamento de Catty'}).click();
 await expect(page.locator('.winter-lobby-profile')).toContainText('Catty');
 await expect(page.locator('.winter-tree-stage canvas')).toHaveCount(1);
});

test('Season microinteractions convey progress and react to user actions',async ({page},info)=>{
 test.skip(info.project.name!=='desktop-1366','Representative seasonal polish coverage');
 await page.clock.install({time:new Date('2027-03-28T12:00:00Z')});
 await page.goto('/');
 await expect(page.locator('.season-hidden-progress')).toContainText('0 / 03');
 for(const item of await page.locator('.season-hidden-grid button').all()) await item.click();
 await expect(page.locator('.season-hidden-progress')).toContainText('Todas as pistas reveladas');
 await page.clock.setFixedTime(new Date('2027-02-14T12:00:00Z'));
 await page.reload();
 await page.getByRole('textbox',{name:'Primeiro nick'}).fill('More');
 await page.getByRole('textbox',{name:'Segundo nick'}).fill('DSTX');
 await expect(page.locator('.season-duo-link')).toHaveClass(/is-complete/);
 await page.clock.setFixedTime(new Date('2027-10-31T12:00:00Z'));
 await page.reload();
 await expect(page.locator('.season-dead-fog')).toBeVisible();
 await page.getByRole('button',{name:'Acender luzes'}).click();
 await expect(page.locator('.season-dead-silence')).toHaveClass(/is-lit/);
});

test('shared lobby stays mounted and dossier preserves selection and focus',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390','mobile-webkit'].includes(info.project.name),'Representative interaction states');
 await page.goto('/esports/valorant/roster?player=invalid');
 await page.getByRole('button',{name:'Selecionar DSTX no lobby',exact:true}).click();
 await expect(page).toHaveURL(/player=dstx/);
 await page.keyboard.press('7');
 await expect(page.locator('.lobby-person[data-active="true"]')).toHaveAttribute('aria-label','Selecionar Catty no lobby');
 await page.getByRole('button',{name:'Abrir dossier de Catty',exact:true}).click();
 const dossier=page.getByRole('dialog',{name:'Catty',exact:true});
 await expect(dossier).toBeVisible();
 await dossier.getByRole('button',{name:'Jogador seguinte',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'DSTX',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
});
