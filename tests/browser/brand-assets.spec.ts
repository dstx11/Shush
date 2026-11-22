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
  const silk = hero.locator('.scene-silk');
  await expect(silk).toHaveAttribute('data-active', 'true');
  if (await silk.getAttribute('data-fallback') === 'true') {
    await expect(silk).toHaveCSS('animation-name', 'silk-drift');
    await expect(silk).toHaveCSS('animation-play-state', 'running');
  } else {
    await expect.poll(() => silk.evaluate(el => (el as HTMLCanvasElement).width)).not.toBe(300);
  }

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

test('reading controls remain usable at narrow widths and enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/esports/valorant/premier#verified-results');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const map = page.getByLabel('Mapa', { exact: true });
  await map.selectOption({ index: 1 });
  const chosen = await map.inputValue();
  await page.getByRole('button', { name: 'Vitórias', exact: true }).click();
  await expect(map).toHaveValue(chosen);
  await expect(page.getByRole('searchbox')).toHaveCSS('font-size', '32px');
  await expect(page.getByRole('navigation', { name: 'Navegação de rodapé' })
    .getByRole('link', { name: 'Premier' })).toHaveAttribute('aria-current', 'page');
  await page.goto('/#discover');
  await page.getByRole('navigation', { name: 'Nesta página' }).getByRole('link', { name: 'Canais' }).click();
  await expect(page).toHaveURL(/#canais$/);
});

test('the intro defers the shader and the photographic fallback resumes after dismissal', async ({page}) => {
  await page.clock.setFixedTime(new Date('2026-11-21T12:00:00Z'));
  // An unavailable shader service must leave the photographic and CSS layers usable.
  let rendererRequests = 0;
  await page.route('**/assets/sceneRenderer-*.js', async route => {
    rendererRequests++;
    await route.abort();
  });
  await page.goto('/?intro=1', {waitUntil:'domcontentloaded'});
  const intro = page.getByRole('dialog', {name:'Entrada SHUSH'});
  await expect(intro).toBeVisible();
  const silk = page.locator('.scene-silk');
  await expect(silk).toHaveAttribute('data-active', 'false');
  expect(rendererRequests).toBe(0);
  await intro.getByRole('button', {name:'Saltar apresentação'}).click();
  await expect(silk).toHaveAttribute('data-fallback', 'true');
  await expect(silk).toHaveCSS('animation-play-state', 'running');
  expect(rendererRequests).toBe(1);
  await page.locator('.shush-footer').scrollIntoViewIfNeeded();
  await expect(silk).toHaveCSS('animation-play-state', 'paused');
});
