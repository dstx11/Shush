import { expect, test } from '@playwright/test';

test('site motion and silent player selection work with the system set to reduce', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.setFixedTime(new Date('2026-10-08T12:00:00Z'));
  await page.addInitScript(() => {
    localStorage.setItem('shush:motion:v1', 'reduce');
    Object.defineProperty(window, 'AudioContext', { value: class {
      constructor() { document.documentElement.dataset.soundAttempt = 'true'; }
    } });
  });
  await page.goto('/');
  const hero = page.locator('.lux-hero');
  await expect(hero).toBeVisible();
  await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
  await expect.poll(() => hero.evaluate(el => getComputedStyle(el, '::before').animationPlayState)).toBe('running');
  await expect.poll(() => hero.evaluate(el => getComputedStyle(el, '::before').animationName)).toBe('fabric-light');

  await page.goto('/esports/valorant/roster?player=more');
  await expect(page.locator('#selected-player-name')).toHaveText('More');
  await page.keyboard.press('7');
  await expect(page.locator('#selected-player-name')).toHaveText('Catty');
  await expect(page.locator('.roster-portrait img')).toHaveCSS('animation-name', 'archive-portrait-in');
  await page.locator('.roster-shortcuts summary').click();
  await expect(page.locator('.roster-shortcuts p')).toBeVisible();
  await expect(page.locator('.selector-sound, audio, video')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-sound-attempt', 'true');
});
