import { test, expect } from '@playwright/test';

// Christmas is now a dated campaign. Exercise it with a deterministic Lisbon date.
test.beforeEach(async ({ page }) => { await page.clock.setFixedTime(new Date('2026-12-12T12:00:00Z')); });

test('tree pauses on request or offscreen and keeps the selected motion preference', async ({ page }) => {
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const pending = new Set<number>();
    window.requestAnimationFrame = callback => {
      const id = request(time => { pending.delete(id); callback(time); });
      pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = id => { pending.delete(id); cancel(id); };
    Object.defineProperty(window, 'shushPendingFrames', { get: () => pending.size });
  });
  const pending = () => page.evaluate(() => (window as unknown as { shushPendingFrames: number }).shushPendingFrames);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Saltar apresentação' }).click();
  const canvas = page.locator('.winter-tree-canvas');
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(pending).toBe(1);
  await page.getByRole('button', { name: /Pausar/ }).click();
  await expect.poll(pending).toBe(0);
  await page.getByRole('button', { name: /Reproduzir/ }).click();
  await expect.poll(pending).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(pending).toBe(1);
  const preference = page.getByRole('button', { name: 'Movimento suave', exact: true });
  await preference.click();
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(pending).toBe(0);
  await canvas.press('ArrowRight');
  await expect.poll(pending).toBe(0);
  await preference.click();
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(pending).toBe(1);
  // Scroll to the footer so the tree's observer stops its loop.
  await page.locator('.shush-footer').scrollIntoViewIfNeeded();
  await expect.poll(pending).toBe(0);
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(pending).toBe(1);
});
