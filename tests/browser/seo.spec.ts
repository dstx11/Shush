import { test, expect } from '@playwright/test';

test('SEO follows navigation and canonicalizes player query parameters', async ({ page }) => {
  await page.goto('/esports/valorant/roster?player=lyel');
  await expect(page.locator('#selected-player-name')).toHaveText('Lyel');
  const canonical = 'https://shush.pt/esports/valorant/roster';
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
  const schemaPage = () => page.locator('#shush-schema').evaluate(element =>
    JSON.parse(element.textContent || '{}')['@graph'].find((item: Record<string, unknown>) =>
      item['@type'] === 'WebPage' || item['@type'] === 'AboutPage'));
  expect((await schemaPage()).url).toBe(canonical);
  await page.locator('footer a[href="/company"]').click();
  await expect(page).toHaveTitle('Sobre a SHUSH — A equipa e a nossa história');
  await expect.poll(async () => (await schemaPage()).url).toBe('https://shush.pt/company');
  expect((await schemaPage())['@type']).toBe('AboutPage');
  await page.goBack();
  await expect.poll(async () => (await schemaPage()).url).toBe(canonical);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow,max-image-preview:large');
});
