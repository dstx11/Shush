import { test, expect } from '@playwright/test';

// These checks run with motion enabled: static pixel references cannot prove motion.
test('luminous atmosphere moves, pauses offscreen and respects reduced motion', async ({ page }, info) => {
  test.skip(!['desktop-1366', 'mobile-390', 'mobile-webkit'].includes(info.project.name), 'Representative motion engines');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install({ time: Date.UTC(2026, 9, 8, 12) });
  await page.goto('/');
  await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
  const hero = page.locator('.lux-hero');
  await expect(hero).toHaveAttribute('data-scene-visible', 'true');
  const aura = () => hero.evaluate(node => ({ transform: getComputedStyle(node, '::before').transform, animation: getComputedStyle(node, '::before').animationName, state: getComputedStyle(node, '::before').animationPlayState }));
  expect((await aura()).animation).toBe('fabric-light');
  const first = (await aura()).transform;
  await expect.poll(async () => (await aura()).transform).not.toBe(first);
  await page.locator('.lux-people').scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-scene-visible', 'false');
  expect((await aura()).state).toBe('paused');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(hero).toHaveAttribute('data-scene-visible', 'true');
  const action = hero.getByRole('link', { name: 'Conhecer o roster', exact: true });
  if (info.project.name === 'desktop-1366') {
    const reflection = await action.evaluate(node => getComputedStyle(node, '::before').transform);
    await action.hover();
    await expect.poll(() => action.evaluate(node => getComputedStyle(node, '::before').transform)).not.toBe(reflection);
    await page.locator('.lux-header .shush-motion-toggle').click();
  } else {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  }
  await expect.poll(async () => (await aura()).animation).toBe('none');
  await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await hero.locator('h1 em').evaluate(node => getComputedStyle(node).textShadow)).not.toBe('none');
  await page.screenshot({ path: info.outputPath('glow-static-accessible.png') });
});

test('cinematic motion proof records the actual interface', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop-1366', 'One native desktop video proof');
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', viewport: { width: 1366, height: 900 }, reducedMotion: 'no-preference', recordVideo: { dir: info.outputPath('motion-proof'), size: { width: 1366, height: 900 } } });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
    // Deliberate short holds capture the real visual beats in the review clip.
    await page.waitForTimeout(1100);
    await page.getByRole('link', { name: 'Conhecer o roster', exact: true }).hover();
    await page.waitForTimeout(700);
    await page.locator('.campaign-frame').first().hover();
    await page.waitForTimeout(700);
    await page.getByRole('link', { name: 'Conhecer o roster', exact: true }).click();
    await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
    await page.keyboard.press('2');
    await page.waitForTimeout(800);
    await expect(page.locator('#selected-player-name')).toHaveText('More');
    await page.screenshot({ path: info.outputPath('glow-roster.png') });
  } finally {
    await context.close();
  }
  const video = await page.video()!.path();
  await info.attach('SHUSH — glow and motion', { path: video, contentType: 'video/webm' });
});
