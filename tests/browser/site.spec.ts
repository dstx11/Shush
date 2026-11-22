import { test, expect } from '@playwright/test';

const routes = [
  ['home', '/'], ['premier', '/esports/valorant/premier'],
  ['roster', '/esports/valorant/roster'], ['creators', '/content'],
  ['about', '/company'],
] as const;

for (const [name, path] of routes) {
  test(`${name}: responsive layout, assets and metadata`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // Hidden lazy images belong to disclosures; exercise those UI states first.
    if (name === 'premier') {
      await page.locator('.legacy-archive > summary').click();
      await expect(page.locator('.match-week')).toHaveCount(7);
      for (const week of await page.locator('.match-week').all()) await week.locator('summary').click();
    }
    // Render lazy images before recording the full-page visual evidence.
    for (const image of await page.locator('main img:visible').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      await expect(image).not.toHaveJSProperty('naturalWidth', 0);
    }
    if (name === 'premier') {
      await page.locator('.match-week').first().screenshot({ path: testInfo.outputPath('premier-week-open.png') });
      for (const week of await page.locator('.match-week').all()) await week.locator('summary').click();
    }
    if (name === 'home') {
      await page.locator('#plantel').screenshot({ path: testInfo.outputPath('plantel.png') });
      const channels = page.locator('#canais');
      await expect(channels.getByRole('link', { name: 'Twitch de More, kandimba13' })).toHaveAttribute('href', 'https://www.twitch.tv/kandimba13');
      await expect(channels.getByRole('link', { name: 'YouTube de Th0maz, @Th0maaz_7' })).toHaveAttribute('href', 'https://www.youtube.com/@Th0maaz_7');
      await channels.screenshot({ path: testInfo.outputPath('canais.png') });
    }
    if (name === 'roster') await page.locator('.character-strip').evaluate((element) => { element.scrollLeft = 0; });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });
    const layout = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      headings: Array.from(document.querySelectorAll('h1, h2')).map((heading) => ({
        text: heading.textContent,
        width: heading.clientWidth,
        scrollWidth: heading.scrollWidth,
      })),
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width + 1);
    for (const heading of layout.headings) {
      expect(heading.scrollWidth, `Clipped heading: ${heading.text}`).toBeLessThanOrEqual(heading.width + 1);
    }
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-PT');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://shush.pt${path === '/' ? '' : path}`);
    expect(errors).toEqual([]);
  });
}

test('roster: seven confirmed accounts, selection, sharing and Unicode', async ({ page }) => {
  const confirmed = [
    ['dstx', 'DSTX', 'dstx#lover'], ['more', 'More', 'moreNO#less'],
    ['th0maz7', 'Th0maz', 'Th0maz7#愛してる彼'], ['lyel', 'Lyel', 'xyz#off'],
    ['tz', 'TZ', 'tz one more time#1757'], ['levi', 'Levi', 'the creator#weed'],
    ['catty', 'Catty', 'catty#111'],
  ];
  const trackerRequests: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).hostname.endsWith('tracker.gg')) trackerRequests.push(request.url()); });
  await page.goto('/esports/valorant/roster?player=invalid');
  await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
  const selectors = page.getByRole('group', { name: 'Selecionar jogador' }).getByRole('button');
  await expect(selectors).toHaveCount(7);
  for (const [index, [id, name, riotId]] of confirmed.entries()) {
    await selectors.nth(index).click();
    await expect(page).toHaveURL(new RegExp(`player=${id}`));
    await expect(selectors.nth(index)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#selected-player-name')).toHaveText(name);
    await expect(page.locator('.competitive-identity')).toContainText(riotId);
    const link = page.locator('.competitive-profile').getByRole('link', { name: `Consultar ${name} no Tracker.gg (abre numa nova janela)`, exact: true });
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.origin).toBe('https://tracker.gg');
    expect(decodeURIComponent(url.pathname.split('/')[4])).toBe(riotId);
    expect(url.searchParams.get('playlist')).toBe('competitive');
    expect(url.searchParams.get('season')).toBeNull();
    await expect(link).toBeVisible();
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
  await expect(page.locator('.competitive-profile .tracker-button')).toContainText('Partidas Competitive');
  await page.getByRole('button', { name: 'Jogador anterior' }).press('Enter');
  await expect(page.locator('#selected-player-name')).toHaveText('Catty');
  await page.reload();
  await expect(page.locator('#selected-player-name')).toHaveText('Catty');
  expect(trackerRequests).toEqual([]);
});

test('mobile navigation: Escape, scroll restoration and SPA focus', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'Mobile menu only');
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Abrir navegação' });
  await open.click();
  const close = page.getByRole('button', { name: 'Fechar navegação' });
  await expect(close).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await open.click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Roster', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Roster. VALORANT / SETE JOGADORES');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('slow initial Home enables the menu and preserves focus after closing', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'Mobile menu only');
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/assets/HomePage-*.js', async (route) => {
    await ready;
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.lux-menu-toggle')).toBeDisabled();
  release();
  await expect(page.locator('.lux-menu-toggle')).toBeEnabled();
  const open = page.getByRole('button', { name: 'Abrir navegação' });
  await open.click();
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(open).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('player actions: exact Unicode clipboard, share URL and manual recovery', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { document.body.dataset.copied = text; } }, configurable: true });
  });
  await page.goto('/esports/valorant/roster?player=th0maz7');
  await page.getByRole('button', { name: 'Copiar Riot ID' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-copied', 'Th0maz7#愛してる彼');
  await expect(page.getByRole('status').filter({ hasText: 'Riot ID copiado.' })).toBeVisible();
  await page.getByRole('button', { name: 'Partilhar jogador' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-copied', /\/esports\/valorant\/roster\?player=th0maz7$/);
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('blocked'); } }, configurable: true }); });
  await page.getByRole('button', { name: 'Copiar Riot ID' }).click();
  await expect(page.getByLabel('Texto para copiar')).toHaveValue('Th0maz7#愛してる彼');
  await page.evaluate(() => { Object.defineProperty(navigator, 'share', { value: async () => { throw new DOMException('Cancelled', 'AbortError'); }, configurable: true }); });
  await page.getByRole('button', { name: 'Partilhar jogador' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Partilha cancelada.' })).toBeVisible();
  await expect(page.getByLabel('Texto para copiar')).toHaveCount(0);
});

test('mobile menu contains keyboard focus and player selector stays compact', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'Mobile layout only');
  await page.goto('/esports/valorant/roster?player=levi');
  await expect(page.locator('#selected-player-name')).toHaveText('Levi');
  await expect(page.locator('.character-strip')).toBeVisible();
  const bounds = await page.locator('.character-strip').boundingBox();
  expect(bounds!.height).toBeLessThan(280);
  const selector = page.getByRole('group', { name: 'Selecionar jogador' });
  await selector.getByRole('button').last().click();
  await expect(page.locator('#selected-player-name')).toHaveText('Catty');
  await page.getByRole('button', { name: 'Abrir navegação' }).click();
  await expect(page.locator('#main-content')).toHaveJSProperty('inert', true);
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Sobre', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Fechar navegação' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Sobre', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#main-content')).toHaveJSProperty('inert', false);
});

test('Premier: filters, real call-ups, missing states and calendar download', async ({ page }) => {
  await page.goto('/esports/valorant/premier');
  await expect(page.locator('.verified-match')).toHaveCount(10);
  await expect(page.locator('.verified-match').first()).toContainText('EnLitro');
  await expect(page.locator('meter')).toHaveCount(6);
  await page.locator('.legacy-archive > summary').click();
  await expect(page.locator('.match-week')).toHaveCount(7);
  const first = page.locator('.match-week').first();
  await first.locator('summary').press('Enter');
  await expect(first).toHaveAttribute('open', '');
  const callups = first.locator('.callup-list a');
  await expect(callups).toHaveCount(5);
  expect(await callups.evaluateAll((links) => links.map((link) => new URL((link as HTMLAnchorElement).href).searchParams.get('player')))).toEqual(['dstx', 'more', 'th0maz7', 'lyel', 'tz']);
  await expect(first.locator('.week-streams a')).toHaveCount(2);
  await expect(first).toContainText('não indicam uma transmissão em direto');
  await page.getByRole('button', { name: 'Com resultado', exact: true }).click();
  await expect(page.locator('.match-week')).toHaveCount(2);
  await page.getByRole('button', { name: 'Janelas publicadas', exact: true }).click();
  await expect(page.locator('.match-week')).toHaveCount(5);
  await page.getByRole('group', { name: 'Filtrar jornadas' }).getByRole('button', { name: 'Todas', exact: true }).click();
  const missing = page.locator('.match-week').nth(2);
  await missing.locator('summary').click();
  await expect(missing).toContainText('Convocatória não publicada.');
  await expect(missing).toContainText('Não existe uma data publicada');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descarregar calendário (.ics)' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('shush-premier-2026.ics');
  const chunks = await (await download.createReadStream())!.toArray();
  const calendar = Buffer.concat(chunks).toString('utf8');
  expect(calendar).toContain('DTSTART:20260612T170000Z');
  expect(calendar).toContain('STATUS:TENTATIVE');
  expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(8);
});

test('Creators: confirmed channels and contextual player destinations', async ({ page }) => {
  await page.goto('/content');
  const features = page.locator('.creator-feature');
  await expect(features).toHaveCount(2);
  await expect(features.nth(0).getByRole('heading', { level: 2 })).toHaveText('More');
  await expect(features.nth(0).getByRole('link', { name: 'Abrir Twitch' })).toHaveAttribute('href', 'https://www.twitch.tv/kandimba13');
  await expect(features.nth(1).getByRole('heading', { level: 2 })).toHaveText('Th0maz');
  await expect(features.nth(1).getByRole('link', { name: 'Abrir YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/@Th0maaz_7');
  for (const index of [0, 1]) {
    await expect(features.nth(index).locator('img')).toHaveCount(1);
    await expect(features.nth(index).locator('img')).toHaveAttribute('src', index === 0 ? '/assets/avatars/more-jersey.webp' : '/assets/avatars/th0maz-jersey.webp');
    await expect(features.nth(index).getByRole('link', { name: 'Conhecer o jogador' })).toHaveAttribute('href', `/esports/valorant/roster?player=${index === 0 ? 'more' : 'th0maz7'}`);
    await expect(features.nth(index).locator('.creator-channel')).toHaveAttribute('rel', /noopener/);
  }
});

test('About: real brand download and partner; static and SPA 404 recovery', async ({ page }, testInfo) => {
  await page.goto('/company');
  await expect(page.getByRole('link', { name: 'Conhecer Backora' })).toHaveAttribute('href', 'https://backora.org/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descarregar logótipo (WebP)' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('shush-logo.webp');
  const image = Buffer.concat(await (await download.createReadStream())!.toArray());
  expect(image.subarray(0, 4).toString()).toBe('RIFF');
  expect(image.subarray(8, 12).toString()).toBe('WEBP');
  await page.goto('/unknown-shush-test');
  await expect(page).toHaveTitle('404 — SHUSH');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await expect(page.getByRole('heading', { name: /Fora do/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('spa-404.png'), fullPage: true });
  await page.getByRole('link', { name: 'Conhecer o roster', exact: true }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('DSTX');
  await page.goto('/404.html');
  await expect(page).toHaveTitle('404 — SHUSH');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await expect(page.getByRole('navigation', { name: 'Recuperar navegação' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('static-404.png'), fullPage: true });
});
