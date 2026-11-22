import { test, expect } from '@playwright/test';

test('Unavailable portrait retains identity and selection recovers', async ({ page }) => {
  await page.route('**/assets/avatars/lyel-jersey*.webp', route => route.abort());
  await page.goto('/esports/valorant/roster?player=lyel');
  await expect(page.locator('#selected-player-name')).toHaveText('Lyel');
  await expect(page.locator('.character-media .portrait-placeholder')).toHaveAccessibleName('Retrato indisponível: Lyel');
  await expect(page.locator('.competitive-identity')).toContainText('xyz#off');
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('TZ');
  await expect(page.locator('.roster-portrait > img')).toHaveJSProperty('complete', true);
  await expect(page.locator('.roster-portrait > img')).not.toHaveJSProperty('naturalWidth', 0);
});

test('Back restores the reading position instead of returning to the hero', async ({ page }) => {
  await page.goto('/');
  // The prerender is replaced at boot; exercise history after the app is ready.
  await expect(page.locator('#shush-boot-stage')).toHaveCount(0);
  await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
  // Measure history restoration after web fonts have settled the page geometry.
  await page.evaluate(() => document.fonts.ready);
  const link = page.locator('.lux-closing a[href="/company"]');
  await link.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  const before = await page.evaluate(() => window.scrollY);
  await link.click();
  await expect(page).toHaveURL('/company');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Um nome.');
  await page.goBack();
  await expect(page.locator('.lux-lineup > a')).toHaveCount(7);
  await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThan(100);
});

test('Public pages include their content when JavaScript is unavailable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    for (const path of ['/', '/esports/valorant/roster', '/esports/valorant/premier', '/content', '/company']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.shush-loading')).toHaveCount(0);
      await expect(page.locator('footer a').first()).toBeVisible();
    }
    await expect(page.locator('footer a[href^="/products/"]')).toHaveCount(0);
  } finally { await context.close(); }
});


test('a delayed navigation frame preserves an active opponent search', async ({ page }) => {
  await page.goto('/company');
  await expect(page.locator('#shush-boot-stage')).toHaveCount(0);
  const now = Date.now();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now + 100);
  await page.locator('footer a[href="/esports/valorant/premier"]').press('Enter');
  const search = page.getByRole('searchbox', {name:'Procurar adversário'});
  await search.fill('EnLitro');
  await page.clock.runFor(100);
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('EnLitro');
  await expect(page.locator('.verified-match')).toHaveCount(1);
});
