import { test, expect } from '@playwright/test';

// Reviewed Linux Chromium baselines: CI #155. Changes require deliberate review.
const regions = [
  ['home-hero', '/', '.opening'],
  ['player-profile', '/esports/valorant/roster?player=more', '#selected-player'],
  ['drop-preview', '/products/jersey?drop=1&nick=SHUSH&number=07&size=L&phrase=S%C3%B3+rounds.', '.audit-drop-gallery'],
  ['about-intro', '/company', '.about-opening'],
] as const;

for (const [name, path, selector] of regions) {
  test(`visual region: ${name}`, async ({ page }, testInfo) => {
    await page.clock.install({ time: Date.UTC(2026, 9, 8, 12) });
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if (name === 'drop-preview') await page.getByRole('button', { name: /Verso/ }).click();
    const region = page.locator(selector);
    await expect(region).toBeVisible();
    for (const image of await region.locator('img:visible').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      await expect(image).not.toHaveJSProperty('naturalWidth', 0);
    }
    if (name === 'home-hero') {
      // A tall element capture can paint off-viewport fixed UI into the hero.
      // Compare the actual visitor viewport, including the header, instead.
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page).toHaveScreenshot(`${name}.png`, { animations: 'disabled', maxDiffPixelRatio: .001 });
    } else {
      await expect(region).toHaveScreenshot(`${name}.png`, { animations: 'disabled', maxDiffPixelRatio: .001 });
    }
  });
}
