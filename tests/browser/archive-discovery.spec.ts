import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('mobile roster overview reveals all seven and restores the selected compact card', async ({ page }, info) => {
  test.skip(!['mobile-320', 'mobile-390', 'compact-hidpi', 'mobile-webkit'].includes(info.project.name), 'Compact roster views');
  await page.goto('/esports/valorant/roster?player=more');
  const stage = page.locator('.character-media');
  const originalHeight = (await stage.boundingBox())!.height;
  const toggle = page.getByRole('button', { name: 'Ver os 7 jogadores', exact: true });
  const choices = page.getByRole('group', { name: 'Selecionar jogador', exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(choices.getByRole('button')).toHaveCount(7);
  const strip = (await choices.boundingBox())!;
  for (const button of await choices.getByRole('button').all()) {
    const box = (await button.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(strip.x - 1);
    expect(box.x + box.width).toBeLessThanOrEqual(strip.x + strip.width + 1);
  }
  await choices.getByRole('button', { name: 'Catty', exact: true }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('Catty');
  await expect(page).toHaveURL(/player=catty/);
  expect((await stage.boundingBox())!.height).toBe(originalHeight);
  const axe = await new AxeBuilder({ page }).include('.player-page').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations.map(item => item.id)).toEqual([]);
  await choices.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('roster-overview.png') });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle).toBeFocused();
  const selected = (await choices.getByRole('button', { name: 'Catty', exact: true }).boundingBox())!;
  const compact = (await choices.boundingBox())!;
  expect(selected.x).toBeGreaterThanOrEqual(compact.x - 1);
  expect(selected.x + selected.width).toBeLessThanOrEqual(compact.x + compact.width + 1);
  expect(compact.height).toBeLessThan(280);
});

test('Premier opponent search combines with map and outcome and sorting preserves the archive', async ({ page }, info) => {
  test.skip(!['mobile-320', 'mobile-390', 'desktop-1366', 'compact-hidpi', 'mobile-webkit'].includes(info.project.name), 'Search and reflow engines');
  await page.goto('/esports/valorant/premier#verified-results');
  const search = page.getByRole('searchbox', { name: 'Procurar adversário', exact: true });
  const outcome = page.getByRole('group', { name: 'Filtrar resultados', exact: true });
  const matches = page.locator('.verified-match');
  await search.fill('  PRÍME   eSports ');
  await expect(matches).toHaveCount(1);
  await expect(matches).toContainText('Prime Esports');
  await page.getByLabel('Mapa', { exact: true }).selectOption('Haven');
  await expect(matches).toHaveCount(0);
  await page.getByLabel('Mapa', { exact: true }).selectOption('Ascent');
  await expect(matches).toHaveCount(1);
  await outcome.getByRole('button', { name: 'Derrotas', exact: true }).click();
  await expect(matches).toHaveCount(0);
  await page.getByRole('button', { name: 'Mostrar todas as partidas', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(outcome.getByRole('button', { name: 'Todas', exact: true })).toBeFocused();
  await expect(matches).toHaveCount(10);
  await page.getByRole('combobox', { name: 'Ordenar', exact: true }).selectOption('oldest');
  await expect(matches.first()).toHaveAttribute('id', 'match-2026-04-11-ilpsni');
  await expect(matches.last()).toHaveAttribute('id', 'match-2026-06-06-enlitro');
  await search.fill('Prime');
  await expect(matches).toHaveCount(1);
  await search.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('premier-search.png') });
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  await expect(matches).toHaveCount(10);
  await expect(matches.first()).toHaveAttribute('id', 'match-2026-06-06-enlitro');
  await expect(page.getByRole('combobox', { name: 'Ordenar', exact: true })).toHaveValue('newest');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});
