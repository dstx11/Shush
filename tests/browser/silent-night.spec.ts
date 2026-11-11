import { test, expect } from '@playwright/test';

test('Silent Night ornaments select every real player and navigate to their profile', async ({ page }) => {
  await page.goto('/');
  const ornaments = page.locator('.winter-player-ornament');
  await expect(ornaments).toHaveCount(7);
  const expected = [
    ['dstx', 'DSTX'], ['more', 'More'], ['th0maz7', 'Th0maz'],
    ['lyel', 'Lyel'], ['tz', 'TZ'], ['levi', 'Levi'], ['catty', 'Catty'],
  ] as const;
  for (const [index, [id, label]] of expected.entries()) {
    const ornament = ornaments.nth(index);
    await ornament.click();
    await expect(ornament).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.winter-lobby-profile h3')).toHaveText(label);
    await expect(page.getByRole('link', { name: `Conhecer ${label} no roster` })).toHaveAttribute('href', `/esports/valorant/roster?player=${id}`);
  }
  const link = page.getByRole('link', { name: 'Conhecer Catty no roster' });
  await link.click();
  await expect(page).toHaveURL(/roster\?player=catty$/);
  await expect(page.locator('#selected-player-name')).toHaveText('Catty');
});

test('Silent Night presents offer direct real routes, keyboard access and no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const gifts = page.locator('.winter-gift-card');
  await expect(gifts).toHaveCount(3);
  await expect(gifts.nth(0)).toHaveAttribute('href', '/esports/valorant/premier');
  await expect(gifts.nth(1)).toHaveAttribute('href', '/products/jersey');
  await expect(gifts.nth(2)).toHaveAttribute('href', '/content');
  await gifts.nth(1).focus();
  await expect(gifts.nth(1)).toBeFocused();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test('Silent Night content renders without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Sete nomes/ })).toBeVisible();
    await expect(page.locator('.winter-gift-card')).toHaveCount(3);
    await expect(page.locator('.winter-player-ornament')).toHaveCount(7);
  } finally {
    await context.close();
  }
});
