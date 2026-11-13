import {test,expect} from '@playwright/test';
import {AxeBuilder} from '@axe-core/playwright';

test('Cinematic chapters preserve content, source provenance and viewport boundaries',async ({page})=>{
 await page.clock.install({time:new Date('2026-11-13T12:00:00Z')});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('.cinema-transmission')).toHaveCount(2);
 await expect(page.locator('.shush-cinema-chapter')).toHaveCount(3);
 await expect(page.locator('.shush-cinema-cameos img')).toHaveCount(3);
 await expect(page.getByRole('heading',{name:/Não é só o que se vê/i})).toBeVisible();
 await expect(page.locator('.home-records-heading')).toContainText('13 de novembro de 2026');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 const axe=await new AxeBuilder({page}).include('.shush-cinema').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.goto('/esports/valorant/premier');
 await expect(page.locator('.verified-match')).toHaveCount(10);
 await expect(page.locator('.verified-match').first()).toContainText('EnLitro');
});

test('The optional camera follows a fine pointer but remains still with reduced motion',async ({page},info)=>{
 test.skip(info.project.name!=='desktop-1366','Desktop pointer coverage');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 await expect(page.locator('.brand-intro')).toHaveCount(0,{timeout:7000});
 const camera=page.locator('.shush-hero-visual');
 await camera.hover({position:{x:100,y:100}});
 await expect.poll(()=>camera.evaluate(e=>(e as HTMLElement).style.getPropertyValue('--lens-x'))).not.toBe('');
 await page.mouse.move(0,0);
 await expect.poll(()=>camera.evaluate(e=>(e as HTMLElement).style.getPropertyValue('--lens-x'))).toBe('');
 await page.emulateMedia({reducedMotion:'reduce'});
 await camera.hover({position:{x:100,y:100}});
 await expect(camera).not.toHaveAttribute('style',/--lens-x/);
});

test('The seasonal cinema keeps its hierarchy when Christmas is active',async ({page},info)=>{
 test.skip(!['desktop-1366','mobile-390'].includes(info.project.name),'Representative seasonal widths');
 await page.clock.install({time:new Date('2026-12-12T12:00:00Z')});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('.winter-tree-stage')).toBeVisible();
 await expect(page.locator('.shush-cinema-chapter')).toHaveCount(3);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
});
