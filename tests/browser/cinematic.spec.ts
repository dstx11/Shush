import { test, expect } from '@playwright/test';

// Christmas is now a dated campaign. Exercise it with a deterministic Lisbon date.
test.beforeEach(async ({ page }) => { await page.clock.install({ time: new Date('2026-12-12T12:00:00Z') }); });

const scenes = [
  ['christmas', 'ice', 0, 'Bosque de âmbar'],
  ['ice', 'christmas', 0, 'Silêncio de neve'],
  ['shush', 'christmas', .99, 'Noite de veludo'],
] as const;

for (const [variant, previous, random, title] of scenes) {
  test(`cinematic tree: ${variant} is chosen before display and has no manual selector`, async ({ page }, testInfo) => {
    test.skip(!['desktop-1366', 'mobile-390'].includes(testInfo.project.name), 'Representative visual coverage');
    await page.addInitScript(({ previous, random }) => {
      localStorage.setItem('shush:winter:tree:v2', previous);
      Math.random = () => random;
    }, { previous, random });
    await page.goto('/');
    const frame = page.locator('.winter-tree-stage');
    await expect(frame).toHaveAttribute('data-tree-variant', variant);
    await expect(frame.getByText(title, { exact: true })).toBeVisible();
    await expect(frame.locator('canvas')).toHaveAttribute('data-ready', 'true');
    await expect(frame.locator('.winter-palette')).toHaveCount(0);
    await frame.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await expect(frame).toHaveScreenshot(`scene-${variant}.png`, { animations: 'disabled' });
    await frame.screenshot({ path: testInfo.outputPath(`scene-${variant}.png`), animations: 'disabled' });
    const before = await frame.getAttribute('data-tree-variant');
    await page.getByRole('link', { name: 'Conhecer os sete jogadores' }).click();
    await page.goBack();
    await expect(frame).toHaveAttribute('data-tree-variant', before!);
    const viewport = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(viewport.content).toBeLessThanOrEqual(viewport.width + 1);
  });
}

test('fresh document chooses another tree while unavailable storage remains usable', async ({ page }) => {
  await page.goto('/');
  const frame = page.locator('.winter-tree-stage');
  await expect(frame.locator('canvas')).toHaveAttribute('data-ready', 'true');
  const first = await frame.getAttribute('data-tree-variant');
  await page.reload();
  await expect(frame.locator('canvas')).toHaveAttribute('data-ready', 'true');
  expect(await frame.getAttribute('data-tree-variant')).not.toBe(first);
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } }));
  await page.reload();
  await expect(frame.locator('canvas')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('cinematic entrance is resource-driven, bounded and never replays during SPA navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: /Entrada SHUSH/ })).toHaveCount(0, { timeout: 2200 });
  const canvas = page.locator('.winter-tree-canvas');
  await expect(canvas).toHaveAttribute('data-ready', 'true');
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-revealed', 'true', { timeout: 4000 });
  await page.locator('.home-closing a[href="/company"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('dialog', { name: /Entrada SHUSH/ })).toHaveCount(0);
});
