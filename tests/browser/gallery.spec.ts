import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('Home: jersey gallery zooms, changes views and restores keyboard focus', async ({ page }, testInfo) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Ampliar camisola', exact: true });
  await trigger.click();
  const gallery = page.getByRole('dialog', { name: 'A camisola, ao detalhe.' });
  await expect(gallery).toBeVisible();
  const close = gallery.getByRole('button', { name: 'Fechar ampliação' });
  await expect(close).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await close.press('ArrowRight');
  await expect(gallery.getByRole('button', { name: 'Verso', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(gallery.locator('img')).toHaveAttribute('src', '/assets/jersey/backjersey.webp');
  const art = gallery.locator('.jersey-lightbox-art');
  const normal = (await art.boundingBox())!.width;
  await gallery.getByRole('button', { name: 'Ver detalhes', exact: true }).click();
  await expect.poll(async () => (await art.boundingBox())!.width).toBeGreaterThan(normal * 1.4);
  const stage = gallery.getByRole('region');
  expect(await stage.evaluate((element) => element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight)).toBe(true);
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  }
  await gallery.getByRole('button', { name: 'Ver camisola inteira', exact: true }).click();
  const bounds = (await gallery.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(axe.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('jersey-gallery.png') });
  await page.keyboard.press('Escape');
  await expect(gallery).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('Drop: editing reveals the back and the enlarged preview preserves the design', async ({ page }) => {
  await page.goto('/products/jersey');
  await page.getByLabel('Nick', { exact: true }).fill('Lyel');
  await page.getByLabel('Número', { exact: true }).fill('04');
  await page.getByLabel('Frase opcional', { exact: true }).fill('Só rounds.');
  await expect(page.getByRole('group', { name: 'Vista da jersey', exact: true }).getByRole('button', { name: /Verso/ })).toHaveAttribute('aria-pressed', 'true');
  const trigger = page.getByRole('button', { name: 'Ampliar camisola', exact: true });
  await trigger.click();
  const gallery = page.getByRole('dialog');
  await expect(gallery.getByLabel('Pré-visualização: Lyel 04')).toBeVisible();
  await expect(gallery.getByText('Só rounds.', { exact: true })).toBeVisible();
  await gallery.getByRole('button', { name: 'Frente', exact: true }).click();
  await expect(gallery.getByLabel('Pré-visualização: Lyel 04')).toHaveCount(0);
  await gallery.getByRole('button', { name: 'Verso', exact: true }).click();
  await gallery.getByRole('button', { name: 'Fechar ampliação' }).click();
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel('Resumo do pedido', { exact: true })).toHaveValue(/Nick: Lyel\nNúmero: 04/);
  await expect(page.getByLabel('Resumo do pedido', { exact: true })).toHaveValue(/Só rounds\./);
});
