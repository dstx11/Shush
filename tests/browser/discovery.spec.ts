import { test, expect } from '@playwright/test';

test('Home: roster controls reach the last player and return to the start', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const controls = page.getByRole('group', { name: 'Navegar pelos jogadores' });
  if ((page.viewportSize()?.width ?? 0) > 1000) {
    await expect(controls).toHaveCount(0);
    return;
  }
  const previous = controls.getByRole('button', { name: 'Ver jogadores anteriores' });
  const next = controls.getByRole('button', { name: 'Ver mais jogadores' });
  const rail = page.locator('#home-player-rail');
  await expect(previous).toBeDisabled();
  await next.click();
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100);
  await expect(previous).toBeEnabled();
  await previous.press('Enter');
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeLessThan(3);
  await expect(previous).toBeDisabled();
  const range = controls.locator('[aria-label^="Jogadores visíveis:"]');
  for (let step = 0; step < 7 && await next.isEnabled(); step += 1) {
    const before = await range.getAttribute('aria-label');
    await next.click();
    // Wait for the scroll measurement to update both the range and end control.
    await expect.poll(async () => await next.isDisabled() || await range.getAttribute('aria-label') !== before).toBe(true);
  }
  await expect(next).toBeDisabled();
  const visible = await rail.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const last = element.lastElementChild!.getBoundingClientRect();
    return last.left >= bounds.left && last.right <= bounds.right + 1;
  });
  expect(visible).toBe(true);
  await rail.getByRole('link', { name: 'Conhecer Levi', exact: true }).click();
  await expect(page).toHaveURL(/player=levi$/);
  await expect(page.locator('#selected-player-name')).toHaveText('Levi');
});
