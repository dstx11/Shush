import { test, expect } from '@playwright/test';

// Christmas is now a dated campaign. Exercise it with a deterministic Lisbon date.
test.beforeEach(async ({ page }) => { await page.clock.install({ time: new Date('2026-12-12T12:00:00Z') }); });

test('tree stops scheduling frames when paused or motion is reduced and resumes once', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('shush:intro-seen', '1');
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
  const canvas = page.locator('.winter-tree-canvas');
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(pending).toBe(1);
  await page.getByRole('button', { name: /Pausar/ }).click();
  await expect.poll(pending).toBe(0);
  await page.getByRole('button', { name: /Reproduzir/ }).click();
  await expect.poll(pending).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(pending).toBe(0);
  await canvas.press('ArrowRight');
  await expect(canvas).toBeFocused();
  await expect.poll(pending).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(pending).toBe(1);
  // An explicit preference must also stop the canvas after it comes back onscreen.
  const preference = page.getByRole('button', { name: 'Reduzir animações', exact: true });
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
