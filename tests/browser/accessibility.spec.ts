import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const routes = ['/', '/esports/valorant/premier', '/esports/valorant/roster', '/content', '/products/jersey', '/company'];

for (const path of routes) {
  test('WCAG A/AA automated checks: ' + path, async ({ page }, testInfo) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if (path.endsWith('/premier')) await page.locator('.match-week').first().locator('summary').click();
    if (path.endsWith('/roster')) await page.getByRole('group', { name: 'Selecionar jogador' }).getByRole('button').nth(1).click();
    if (path.endsWith('/jersey')) await page.getByRole('button', { name: /Verso/ }).click();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    await testInfo.attach('axe-report', { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
    expect(result.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.map((node) => ({ target: node.target, detail: node.failureSummary })) }))).toEqual([]);
    // Include the fully expanded mobile navigation in accessibility coverage.
    if ((page.viewportSize()?.width ?? 0) < 768) {
      await page.getByRole('button', { name: 'Abrir navegação' }).click();
      const menu = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(menu.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
    }
  });
}

test('a failed lazy route recovers once and exposes usable recovery controls', async ({ page }) => {
  let navigations = 0;
  page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) navigations += 1; });
  await page.route('**/assets/ContentPage-*.js', (route) => route.abort());
  await page.goto('/content', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Não foi possível carregar esta página.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recarregar' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Voltar à Home' })).toHaveAttribute('href', '/');
  expect(navigations).toBeLessThanOrEqual(2);
  expect(Number(await page.evaluate(() => sessionStorage.getItem('shush:preload-recovery-at')))).toBeGreaterThan(0);
});
