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
  for (const name of await page.locator('.lux-portrait strong').all()) {
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

test('mobile jersey preview opens at the form and returns without losing the edit position', async ({ page }, info) => {
  test.skip(!['mobile-320', 'mobile-390', 'mobile-webkit'].includes(info.project.name), 'Mobile form journey');
  await page.goto('/products/jersey');
  await page.getByLabel('Nick', { exact: true }).fill('SHUSH 愛');
  await page.getByLabel('Número', { exact: true }).fill('13');
  await page.getByLabel('Frase opcional', { exact: true }).fill('Só rounds.');
  const miniature = page.locator('.drop-mini-image');
  const miniatureHeight = (await miniature.boundingBox())!.height;
  const phraseHeight = (await miniature.locator('.audit-live-print small').boundingBox())!.height;
  expect(phraseHeight).toBeLessThan(miniatureHeight * .08);
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
