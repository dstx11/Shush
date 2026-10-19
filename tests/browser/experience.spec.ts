import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('Home never presents internal calendar windows as confirmed matches', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-06-30T16:59:00Z') });
  await page.goto('/?matchday=week-2-day-1');
  await expect(page.locator('.team-cover-player')).toHaveCount(3);
  await expect(page.locator('.matchday')).toHaveCount(0);
  await page.goto('/esports/valorant/premier');
  await expect(page.locator('.matchday-empty')).toContainText('sem data confirmada');
  await page.clock.fastForward(120_000);
  await expect(page.locator('.matchday-empty')).toContainText('sem data confirmada');
});

test('Character Select: player DNA, individual art direction and reduced motion', async ({ page }, testInfo) => {
  await page.goto('/esports/valorant/roster?player=lyel');
  await expect(page.locator('.player-page')).toHaveAttribute('data-player', 'lyel');
  await expect(page.locator('.player-dna')).toContainText('Iniciador / Flex');
  await expect(page.locator('.character-number')).toHaveText('16');
  await expect(page.locator('.character-copy')).not.toContainText('XXL');
  await expect(page.locator('.character-media > img')).toHaveCSS('animation-name', 'none');
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  await page.locator('#selected-player').screenshot({ path: testInfo.outputPath('character-select.png') });
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('.player-page')).toHaveAttribute('data-player', 'tz');
  await expect(page.locator('.player-dna')).toBeVisible();
});

test('Initial content stays visible while the JavaScript loads', async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/assets/index-*.js', async route => { await ready; await route.continue(); });
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.home-lineup > a')).toHaveCount(7);
  await expect(page.locator('.shush-loading')).toHaveCount(0);
  release();
  await expect(page.locator('.navigation-toggle')).toBeEnabled();
});

test('Loading: branded route fallback is removed as soon as the route is ready', async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/assets/HomePage-*.js', async route => { await ready; await route.continue(); });
  await page.goto('/company');
  await expect(page.locator('.navigation-toggle')).toBeEnabled();
  await page.locator('header .brand-mark').click();
  await expect(page.locator('.shush-loading')).toBeVisible();
  await expect(page.getByText('O silêncio antes do round.')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.loading-orbit')).toHaveCSS('animation-name', 'loading-turn');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.loading-orbit')).toHaveCSS('animation-name', 'none');
  release();
  await expect(page.locator('.team-cover-player')).toHaveCount(3);
  await expect(page.locator('.shush-loading')).toHaveCount(0);
});


test('Character Select: arrow keys, Home/End, stable focus and preserved query parameters', async ({ page }) => {
  await page.goto('/esports/valorant/roster?player=dstx&origin=community');
  const buttons = page.getByRole('group', { name: 'Selecionar jogador' }).getByRole('button');
  await buttons.first().press('ArrowLeft');
  await expect(buttons.last()).toBeFocused();
  await expect(page.locator('#selected-player-name')).toHaveText('Catty');
  await buttons.last().press('Home');
  await expect(buttons.first()).toBeFocused();
  await buttons.first().press('ArrowRight');
  await expect(page.locator('#selected-player-name')).toHaveText('More');
  await buttons.nth(1).press('End');
  await expect(buttons.last()).toBeFocused();
  expect(new URL(page.url()).searchParams.get('origin')).toBe('community');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('Home leads with real players and sourced results, while the jersey belongs to Drop', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.team-cover-player')).toHaveCount(3);
  await expect(page.locator('.opening img[src*="/assets/jersey/"]')).toHaveCount(0);
  await expect(page.locator('.verified-match')).toHaveCount(0);
  await expect(page.locator('.team-cover img')).toHaveCount(3);
});

test('Character Select: swipe intent, cancellation and player jersey link', async ({ page }) => {
  await page.goto('/esports/valorant/roster?player=lyel&origin=community');
  const media = page.locator('.character-media');
  // Vertical browsing and cancelled gestures must not select another player.
  await media.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 200, clientY: 100 });
  await media.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 180, clientY: 240 });
  await expect(page.locator('#selected-player-name')).toHaveText('Lyel');
  await media.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 200, clientY: 100 });
  await media.dispatchEvent('pointercancel');
  await media.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 50, clientY: 100 });
  await expect(page.locator('#selected-player-name')).toHaveText('Lyel');
  await media.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 200, clientY: 100 });
  await media.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 90, clientY: 110 });
  await expect(page.locator('#selected-player-name')).toHaveText('TZ');
  expect(new URL(page.url()).searchParams.get('origin')).toBe('community');
  await page.getByRole('link', { name: 'Ver camisola TZ' }).click();
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue('TZ');
  await expect(page.getByLabel('Número', { exact: true })).toHaveValue('10');
  await expect(page.getByLabel('Pré-visualização: TZ 10')).toBeVisible();
});

test('Motion: portrait arrival completes and reduced motion can be enabled at runtime', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/esports/valorant/roster?player=catty');
  const portrait = page.locator('.character-media > img');
  await expect(portrait).toHaveCSS('animation-name', 'portrait-arrive');
  await expect.poll(() => portrait.evaluate(el => el.getAnimations().every(animation => animation.playState === 'finished'))).toBe(true);
  await expect(portrait).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath('roster-motion-settled.png'), fullPage: true });
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
  await expect.poll(() => portrait.evaluate(el => el.getAnimations().every(animation => animation.playState === 'finished'))).toBe(true);
  await expect(page.locator('.portrait-depart')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(portrait).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('More');
  await expect(portrait).toHaveCSS('animation-name', 'none');
});
