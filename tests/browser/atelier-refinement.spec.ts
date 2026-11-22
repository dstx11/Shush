import { test, expect } from '@playwright/test';

test('cover portraits have enough source pixels for their square-image crop', async ({ page }, info) => {
  test.skip(!['mobile-320', 'mobile-390', 'desktop-1366', 'compact-hidpi', 'mobile-webkit'].includes(info.project.name), 'Representative crop and density coverage');
  await page.clock.install({ time: Date.UTC(2026, 9, 8, 12) });
  // Include the longest name in the narrow side frame on every engine.
  await page.addInitScript(() => localStorage.setItem('shush:home:rotation:v1', '0'));
  await page.goto('/');
  const portraits = page.locator('[data-home-roster] img');
  await expect(portraits).toHaveCount(3);
  for (const image of await portraits.all()) {
    await image.evaluate(element => (element as HTMLImageElement).decode());
    const sample = await image.evaluate(element => {
      const image = element as HTMLImageElement;
      const box = image.getBoundingClientRect();
      // naturalWidth is density-corrected for srcset; read the known asset variant.
      const candidate = image.currentSrc.match(/-(160|384)\.webp(?:\?|$)/);
      return { source: candidate ? Number(candidate[1]) : 768, needed: Math.min(768, Math.max(box.width, box.height) * devicePixelRatio) };
    });
    expect(sample.source).toBeGreaterThanOrEqual(sample.needed);
  }
  await page.evaluate(() => document.fonts.ready);
  for (const name of await page.locator('.campaign-frame strong').all()) {
    const size = await name.evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const style = getComputedStyle(element);
      return { lines: range.getClientRects().length, text: range.getBoundingClientRect().width, available: element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) };
    });
    expect(size.lines).toBe(1);
    expect(size.text).toBeLessThanOrEqual(size.available + 1);
  }
});
