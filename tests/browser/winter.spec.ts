import { test, expect } from '@playwright/test';

test('Winter scene is available without compromising the team content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sem barulho');
  await expect(page.locator('.winter-tree-stage canvas')).toBeVisible();
  await expect(page.locator('.team-cover-player')).toHaveCount(3);
  await expect(page.locator('.home-lineup > a')).toHaveCount(7);
  await expect(page.locator('.home-score')).toHaveCount(3);
  await expect(page.locator('.winter-palette button')).toHaveCount(3);
  const lightControl = page.getByRole('button', { name: /Luzes on/ });
  await lightControl.click();
  await expect(page.getByRole('button', { name: /Luzes off/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Luzes off/ }).click();
  const frozen = page.getByRole('button', { name: /Pausar/ });
  await frozen.click();
  await expect(page.getByRole('button', { name: /Reproduzir/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Noite gelada' }).click();
  await expect(page.getByRole('button', { name: 'Gelo' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Reproduzir/ }).click();
  await expect(page.getByRole('button', { name: /Pausar/ })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const viewport = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.width + 1);
});

test('Winter scene remains accessible with reduced motion and keyboard controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const tree = page.locator('.winter-tree-stage canvas');
  await expect(tree).toHaveAttribute('role', 'img');
  await expect(tree).toHaveAttribute('aria-label', /Árvore de Natal/);
  const aurora = page.getByRole('button', { name: 'Natal clássico' });
  await aurora.focus();
  await expect(aurora).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.getByRole('button', { name: 'SHUSH glow' }).click();
  await expect(page.getByRole('button', { name: 'Clássico' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.winter-tree-stage')).toBeVisible();
});
