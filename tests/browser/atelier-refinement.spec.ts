import { test, expect } from '@playwright/test';

test('cover portraits have enough source pixels for their square-image crop', async ({ page }, info) => {
  test.skip(!['mobile-320', 'mobile-390', 'desktop-1366', 'compact-hidpi', 'mobile-webkit'].includes(info.project.name), 'Representative crop and density coverage');
  await page.clock.install({ time: Date.UTC(2026, 9, 8, 12) });
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
});

test('mobile jersey preview opens at the form and returns without losing the edit position', async ({ page }, info) => {
  test.skip(!['mobile-320', 'mobile-390', 'mobile-webkit'].includes(info.project.name), 'Mobile form journey');
  await page.goto('/products/jersey');
  await page.getByLabel('Nick', { exact: true }).fill('SHUSH 愛');
  await page.getByLabel('Número', { exact: true }).fill('13');
  await page.getByLabel('Frase opcional', { exact: true }).fill('Só rounds.');
  const trigger = page.getByRole('button', { name: 'Ampliar a minha personalização', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({ scroll: window.scrollY, hash: location.hash }));
  await trigger.click();
  const preview = page.getByRole('dialog', { name: 'A camisola, ao detalhe.' });
  await expect(preview.getByLabel('Pré-visualização: SHUSH 愛 13', { exact: true })).toBeVisible();
  await expect(preview.getByText('Só rounds.', { exact: true })).toBeVisible();
  await preview.getByRole('button', { name: 'Frente', exact: true }).click();
  await preview.getByRole('button', { name: 'Verso', exact: true }).click();
  await page.screenshot({ path: info.outputPath('mobile-personalization-preview.png') });
  await page.keyboard.press('Escape');
  await expect(preview).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(before.scroll, 0);
  expect(await page.evaluate(() => location.hash)).toBe(before.hash);
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue('SHUSH 愛');
  await expect(page.getByLabel('Número', { exact: true })).toHaveValue('13');
  await page.screenshot({ path: info.outputPath('mobile-personalization-return.png') });
});
