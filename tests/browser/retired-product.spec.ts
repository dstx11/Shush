import { expect, test } from '@playwright/test';

test('old product bookmarks lead to the missing-page screen with working recovery', async ({ page }) => {
  await page.goto('/products/jersey?drop=1&nick=SHUSH');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Fora do.*mapa/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.getByRole('link', { name: 'Conhecer o roster' }).click();
  await expect(page.getByRole('heading', { name: 'DSTX', exact: true })).toBeVisible();
  await expect(page.locator('a[href^="/products/jersey"]')).toHaveCount(0);
});
