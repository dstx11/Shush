import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('Matchday: published archive, real call-up links and a usable return to Home', async ({ page }, testInfo) => {
  await page.clock.install({ time: new Date('2026-10-09T12:00:00Z') });
  await page.goto('/?matchday=week-2-day-1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('O round fica.');
  const match = page.locator('.matchday');
  await expect(match).toContainText('Arquivo');
  await expect(match.locator('.matchday-versus')).toContainText('10 : 13');
  await expect(match.locator('.matchday-map')).toContainText('Lotus');
  await expect(match.locator('.matchday-players a')).toHaveCount(5);
  await expect(match.getByRole('link', { name: 'Conhecer Catty' })).toHaveAttribute('href', '/esports/valorant/roster?player=catty');
  await expect(match.locator('.matchday-channels')).toHaveCount(0);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('matchday.png'), fullPage: false });
  await match.getByRole('link', { name: 'Explorar a Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sem barulho. Só rounds.', { useInnerText: true });
});

test('Matchday: automatic home countdown moves into the window and pending result', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-06-30T16:59:00Z') });
  await page.goto('/');
  await expect(page.locator('.matchday-state')).toContainText('0h 01m');
  await page.clock.fastForward(61_000);
  await expect(page.locator('.matchday-state')).toContainText('Janela Premier aberta');
  await expect(page.locator('.matchday-channels')).toContainText('direto não confirmado');
  await page.clock.fastForward(61 * 60_000);
  await expect(page.locator('.matchday-state')).toContainText('Resultado por confirmar');
  await expect(page.locator('.matchday-channels')).toHaveCount(0);
});

test('Character Select: player DNA, individual art direction and reduced motion', async ({ page }, testInfo) => {
  await page.goto('/esports/valorant/roster?player=lyel');
  await expect(page.locator('.player-page')).toHaveAttribute('data-player', 'lyel');
  await page.getByText('Player DNA', { exact: false }).click();
  await expect(page.locator('.player-dna')).toContainText('Iniciador / Flex');
  await expect(page.locator('.player-dna')).toContainText('Ritmo');
  await expect(page.locator('.character-media > img')).toHaveCSS('animation-name', 'none');
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  await page.locator('#selected-player').screenshot({ path: testInfo.outputPath('character-select.png') });
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('.player-page')).toHaveAttribute('data-player', 'tz');
  await expect(page.locator('.player-dna')).not.toHaveAttribute('open');
});

test('Loading: branded route fallback is removed as soon as the route is ready', async ({ page, browserName }, testInfo) => {
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  let releaseEntry!: () => void;
  const entryReady = new Promise<void>(resolve => { releaseEntry = resolve; });
  await page.route('**/assets/index-*.js', async route => { await entryReady; await route.continue(); });
  await page.route('**/assets/HomePage-*.js', async route => { await ready; await route.continue(); });
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.getByRole('link', { name: 'Recarregar página' })).toBeVisible();
  releaseEntry();
  await expect(page.getByRole('link', { name: 'Recarregar página' })).toHaveCount(0);
  await expect(page.locator('.shush-loading')).toBeVisible();
  await expect(page.getByText('O silêncio antes do round.')).toBeVisible();
  // WebKit waits for document load before capture; the intentionally held module prevents it.
  // Keep the loading assertions above and release/removal assertions below on every engine.
  if (browserName !== 'webkit') await page.screenshot({ path: testInfo.outputPath('loading.png') });
  release();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.shush-loading')).toHaveCount(0);
});


test('Character Select: arrow keys, Home/End, stable focus and preserved query parameters', async ({ page }) => {
  await page.goto('/esports/valorant/roster?player=dstx&origin=community');
  const buttons = page.getByRole('group', { name: 'Selecionar jogador' }).getByRole('button');
  await buttons.first().press('ArrowLeft');
  await expect(buttons.last()).toBeFocused();
  await expect(page.locator('#selected-player-name')).toHaveText('Levi');
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
  await expect(page.locator('.opening img[src*="jersey"]')).toHaveCount(0);
  await expect(page.locator('.verified-match')).toHaveCount(3);
  await expect(page.locator('.verified-match').first()).toContainText('EnLitro');
  await expect(page.locator('.verified-match').first()).toContainText('Haven');
  await expect(page.locator('.verified-match-source').first()).toContainText('10');
});

test('Character Select: swipe intent, cancellation and player jersey link', async ({ page }) => {
  await page.goto('/esports/valorant/roster?player=lyel&origin=community');
  const media = page.locator('.character-media');
  // Vertical browsing and cancelled gestures must not select another player.
  await media.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 200, clientY: 100 });
  await media.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 180, clientY: 240 });
  await expect(page.locator('#selected-player-name')).toHaveText('lyel');
  await media.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 200, clientY: 100 });
  await media.dispatchEvent('pointercancel');
  await media.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 50, clientY: 100 });
  await expect(page.locator('#selected-player-name')).toHaveText('lyel');
  await media.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 200, clientY: 100 });
  await media.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 90, clientY: 110 });
  await expect(page.locator('#selected-player-name')).toHaveText('tz');
  expect(new URL(page.url()).searchParams.get('origin')).toBe('community');
  await page.getByRole('link', { name: 'Ver camisola tz' }).click();
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue('tz');
  await expect(page.getByLabel('Número', { exact: true })).toHaveValue('05');
  await expect(page.getByLabel('Pré-visualização: tz 05')).toBeVisible();
});

test('Motion: portrait arrival completes and reduced motion can be enabled at runtime', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/esports/valorant/roster?player=catty');
  const portrait = page.locator('.character-media > img');
  await expect(portrait).toHaveCSS('animation-name', 'portrait-arrive');
  await expect.poll(() => portrait.evaluate(el => el.getAnimations().every(animation => animation.playState === 'finished'))).toBe(true);
  await expect(portrait).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath('roster-motion-settled.png'), fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(portrait).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('Levi');
  await expect(portrait).toHaveCSS('animation-name', 'none');
});
