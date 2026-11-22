import { test, expect } from '@playwright/test';

// Editorial references reviewed in desktop/mobile after the intentional art
// direction change. Keep pixel comparisons active and captures available for review.
const regions = [
  ['home-hero', '/', '.lux-hero'],
  ['player-profile', '/esports/valorant/roster?player=more', '#selected-player'],
  ['about-intro', '/company', '.story-cover'],
] as const;

for (const [name, path, selector] of regions) {
  test(`visual region: ${name}`, async ({ page }, testInfo) => {
    await page.clock.install({ time: Date.UTC(2026, 9, 8, 12) });
    await page.addInitScript(() => {
      localStorage.setItem('shush:home:rotation:v1', '3');
      localStorage.setItem('shush:winter:tree:v2', 'ice');
      Math.random = () => 0;
    });
    if (name === 'home-hero') {
      // Render the live shader at one phase. CSS screenshot animation controls
      // cannot freeze WebGL uniforms, and freezing the page clock during module
      // loading ties the first frame to network and GPU initialization order.
      await page.addInitScript(() => {
        sessionStorage.setItem('shush:signature-intro:1', 'seen');
        if (typeof WebGLRenderingContext === 'undefined') return;
        const proto = WebGLRenderingContext.prototype;
        const locate = proto.getUniformLocation;
        const assign = proto.uniform1f;
        const clocks = new WeakSet<WebGLUniformLocation>();
        proto.getUniformLocation = function (program, uniform) {
          const location = locate.call(this, program, uniform);
          if (location && uniform === 'time' && this.canvas instanceof HTMLCanvasElement &&
              this.canvas.matches('.scene-silk')) clocks.add(location);
          return location;
        };
        proto.uniform1f = function (location, value) {
          if (location && clocks.has(location)) {
            assign.call(this, location, 0.33);
            (this.canvas as HTMLCanvasElement).dataset.snapshotPhase = '1s';
          } else {
            assign.call(this, location, value);
          }
        };
      });
    }
    await page.goto(path);
    await expect(page.locator('#shush-boot-stage')).toHaveCount(0);
    await expect(page.getByRole('dialog',{name:'Entrada SHUSH'})).toHaveCount(0,{timeout:7000});
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const region = page.locator(selector);
    await expect(region).toBeVisible();
    for (const image of await region.locator('img:visible').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      await expect(image).not.toHaveJSProperty('naturalWidth', 0);
      await image.evaluate(element => (element as HTMLImageElement).decode());
    }
    if (name === 'player-profile') {
      // Loading every lazy portrait scrolls the strip. Restore the actual selected player.
      await page.locator('.player-card-select[aria-pressed="true"]').scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, 0));
      // A tall region capture can composite the fixed header over the portrait.
      // A full-page capture preserves the real header and content positions.
      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, animations: 'disabled' });
      await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true, animations: 'disabled' });
    } else if (name === 'home-hero') {
      // A tall element capture can paint off-viewport fixed UI into the hero.
      // Compare the actual visitor viewport, including the header, instead.
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('.scene-silk[data-snapshot-phase="1s"], .scene-silk[data-fallback="true"]')).toHaveCount(1);
      await expect(page).toHaveScreenshot(`${name}.png`, { animations: 'disabled' });
      await page.screenshot({ path: testInfo.outputPath(`${name}.png`), animations: 'disabled' });
    } else {
      if (name === 'about-intro') {
        await expect(region.getByRole('heading', { level: 1 })).toContainText('Um nome.');
        await expect(region).toHaveScreenshot(`${name}.png`, { animations: 'disabled' });
        await region.screenshot({ path: testInfo.outputPath(`${name}.png`), animations: 'disabled' });
      } else {
        await expect(region.locator('img:visible')).not.toHaveCount(0);
        await expect(region).toHaveScreenshot(`${name}.png`, { animations: 'disabled' });
        await region.screenshot({ path: testInfo.outputPath(`${name}.png`), animations: 'disabled' });
      }
    }
  });
}
