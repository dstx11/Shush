import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const direction of ['atelier', 'protocol', 'nocturne']) {
  test(`art-direction evidence: ${direction}`, async ({ page }, info) => {
    test.skip(!['desktop-1366', 'mobile-390'].includes(info.project.name), 'Desktop/mobile design comparison');
    const html = await readFile(new URL(`../../docs/design-explorations/${direction}.html`, import.meta.url), 'utf8');
    await page.route(`**/__design/${direction}`, route => route.fulfill({ contentType: 'text/html', body: html }));
    await page.goto(`/__design/${direction}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Sem barulho.');
    await expect(page.locator('.selection a')).toHaveCount(7);
    for (const image of await page.locator('img').all()) await expect(image).not.toHaveJSProperty('naturalWidth', 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    await page.screenshot({ path: info.outputPath(`concept-${direction}.png`), fullPage: true });
  });
}
