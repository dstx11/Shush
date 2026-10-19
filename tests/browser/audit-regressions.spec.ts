import { test, expect } from '@playwright/test';

test('Unavailable portrait retains identity and selection recovers', async ({ page }) => {
  await page.route('**/assets/avatars/lyel-jersey*.webp', route => route.abort());
  await page.goto('/esports/valorant/roster?player=lyel');
  await expect(page.locator('#selected-player-name')).toHaveText('Lyel');
  await expect(page.locator('.character-media .portrait-placeholder')).toHaveAccessibleName('Retrato indisponível: Lyel');
  await expect(page.locator('.competitive-identity')).toContainText('xyz#off');
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('TZ');
  await expect(page.locator('.character-media > img')).toHaveJSProperty('complete', true);
  await expect(page.locator('.character-media > img')).not.toHaveJSProperty('naturalWidth', 0);
});

test('Back restores the reading position instead of returning to the hero', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('.home-closing a[href="/company"]');
  await link.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  const before = await page.evaluate(() => window.scrollY);
  await link.click();
  await expect(page).toHaveURL('/company');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Antes da SHUSH');
  await page.goBack();
  await expect(page.locator('.home-lineup > a')).toHaveCount(7);
  await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThan(100);
});

test('Public pages include their content when JavaScript is unavailable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    for (const path of ['/', '/esports/valorant/roster', '/esports/valorant/premier', '/content', '/company', '/products/jersey']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.shush-loading')).toHaveCount(0);
      await expect(page.locator('footer a').first()).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Copiar resumo' })).toBeDisabled();
  } finally { await context.close(); }
});
