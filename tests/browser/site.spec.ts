import { test, expect } from '@playwright/test';

const routes = [
  ['home', '/'], ['premier', '/esports/valorant/premier'],
  ['roster', '/esports/valorant/roster'], ['creators', '/content'],
  ['drop', '/products/jersey'], ['about', '/company'],
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
    ['dstx', 'dstx', 'Nivox#zero'], ['more', 'More', 'moreNO#less'],
    ['th0maz7', 'Th0maz7', 'Th0maz7#愛してる彼'], ['lyel', 'lyel', 'xyz#off'],
    ['tz', 'tz', 'tz one more time#1757'], ['catty', 'Catty', 'catty#111'],
    ['levi', 'Levi', 'the creator#weed'],
  ];
  const trackerRequests: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).hostname.endsWith('tracker.gg')) trackerRequests.push(request.url()); });
  await page.goto('/esports/valorant/roster?player=invalid');
  await expect(page.locator('#selected-player-name')).toHaveText('dstx');
  const selectors = page.getByRole('group', { name: 'Selecionar jogador' }).getByRole('button');
  await expect(selectors).toHaveCount(7);
  const cardLinks = page.getByRole('group', { name: 'Selecionar jogador' }).getByRole('link');
  await expect(cardLinks).toHaveCount(7);
  for (const [index, [id, name, riotId]] of confirmed.entries()) {
    const cardLink = cardLinks.nth(index);
    await expect(cardLink).toHaveAccessibleName(`Consultar ${name} no Tracker.gg (abre numa nova janela)`);
    await expect(cardLink).toBeVisible();
    await expect(cardLink).toHaveAttribute('target', '_blank');
    await expect(cardLink).toHaveAttribute('rel', /noopener/);
    const cardUrl = new URL((await cardLink.getAttribute('href'))!);
    expect(decodeURIComponent(cardUrl.pathname.split('/')[4])).toBe(riotId);
    const cardBounds = await cardLink.boundingBox();
    expect(cardBounds!.height).toBeGreaterThanOrEqual(44);
    await selectors.nth(index).focus();
    await page.keyboard.press('Tab');
    await expect(cardLink).toBeFocused();
    await selectors.nth(index).click();
    await expect(page).toHaveURL(new RegExp(`player=${id}`));
    await expect(selectors.nth(index)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#selected-player-name')).toHaveText(name);
    await expect(page.locator('.competitive-identity')).toContainText(riotId);
    const link = page.locator('#selected-player').getByRole('link', { name: `Consultar ${name} no Tracker.gg (abre numa nova janela)`, exact: true });
    await expect(link).toHaveAttribute('href', cardUrl.href);
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.origin).toBe('https://tracker.gg');
    expect(decodeURIComponent(url.pathname.split('/')[4])).toBe(riotId);
    expect(url.searchParams.get('playlist')).toBe(id === 'dstx' ? 'competitive' : 'premier');
    expect(url.searchParams.get('season')).toBe(id === 'dstx' ? '8102cd81-43a0-d0d7-bd59-47b8fe9bed1b' : null);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('dstx');
  await expect(page.getByText('Ligação à temporada selecionada no perfil, não à temporada atual.')).toBeVisible();
  await page.getByRole('button', { name: 'Jogador anterior' }).press('Enter');
  await expect(page.locator('#selected-player-name')).toHaveText('Levi');
  await page.reload();
  await expect(page.locator('#selected-player-name')).toHaveText('Levi');
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('PlayerSelect.');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('slow initial Home does not steal focus after the menu closes', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 768, 'Mobile menu only');
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/assets/HomePage-*.js', async (route) => {
    await ready;
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const open = page.getByRole('button', { name: 'Abrir navegação' });
  await open.click();
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  release();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(open).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('Drop: real front/back preview and manual request values', async ({ page }, testInfo) => {
  await page.goto('/products/jersey');
  await page.getByLabel('Nick', { exact: true }).fill('SHUSH');
  await page.getByLabel('Número', { exact: true }).fill('07');
  await page.getByRole('radio', { name: 'L', exact: true }).check();
  await page.getByLabel('Frase opcional', { exact: true }).fill('Só rounds.');
  await page.getByRole('button', { name: /Verso/ }).click();
  await expect(page.getByRole('button', { name: /Verso/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Pré-visualização: SHUSH 07')).toBeVisible();
  const summary = page.getByLabel('Resumo do pedido', { exact: true });
  await expect(summary).toHaveValue(/SHUSH/);
  await expect(summary).toHaveValue(/07/);
  await expect(summary).toHaveValue(/Só rounds\./);
  await expect(summary).toHaveValue(/Tamanho: L/);
  const image = await page.locator('.audit-drop-image').boundingBox();
  const print = await page.getByLabel('Pré-visualização: SHUSH 07').boundingBox();
  expect(image).not.toBeNull();
  expect(print).not.toBeNull();
  expect(Math.abs(image!.width - image!.height)).toBeLessThan(2);
  expect(print!.y).toBeGreaterThan(image!.y + image!.height * .1);
  expect(print!.y + print!.height).toBeLessThan(image!.y + image!.height * .55);
  expect(Math.abs((print!.x + print!.width / 2) - (image!.x + image!.width / 2))).toBeLessThan(2);
  await page.locator('.audit-drop-gallery').screenshot({ path: testInfo.outputPath('drop-back.png') });
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
  const bounds = await page.locator('.character-strip').boundingBox();
  expect(bounds!.height).toBeLessThan(280);
  const selector = page.getByRole('group', { name: 'Selecionar jogador' });
  await selector.getByRole('button').last().click();
  await expect(page.locator('#selected-player-name')).toHaveText('Levi');
  await page.getByRole('button', { name: 'Abrir navegação' }).click();
  await expect(page.locator('#main-content')).toHaveJSProperty('inert', true);
  await page.locator('#mobile-navigation').getByRole('link', { name: 'About', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Fechar navegação' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'About', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#main-content')).toHaveJSProperty('inert', false);
});

test('Premier: filters, real call-ups, missing states and calendar download', async ({ page }) => {
  await page.goto('/esports/valorant/premier');
  await expect(page.getByText('Jun — Jul')).toBeVisible();
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
  await page.getByRole('button', { name: 'Todas', exact: true }).click();
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
  await expect(features.nth(1).getByRole('heading', { level: 2 })).toHaveText('Th0maz7');
  await expect(features.nth(1).getByRole('link', { name: 'Abrir YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/@Th0maaz_7');
  for (const [index, id] of ['more', 'th0maz7'].entries()) {
    await expect(features.nth(index).locator('.creator-roster')).toHaveAttribute('href', '/esports/valorant/roster?player=' + id);
    await expect(features.nth(index).locator('.creator-channel')).toHaveAttribute('rel', /noopener/);
  }
});

test('Drop: URL restore, Unicode bounds, TXT, share, reset and explicit local draft', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { document.body.dataset.copied = text; } }, configurable: true });
  });
  const family = '👨‍👩‍👧‍👦';
  await page.goto('/products/jersey?drop=1&nick=' + encodeURIComponent(family.repeat(15)) + '&number=999&size=huge');
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue(family.repeat(14));
  await expect(page.getByLabel('Número', { exact: true })).toHaveValue('01');
  await expect(page.getByRole('radio', { name: 'M', exact: true })).toBeChecked();
  await expect(page.getByRole('status').filter({ hasText: 'valores inválidos' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('shush:drop01:draft:v1'))).toBeNull();
  await page.getByLabel('Nick', { exact: true }).fill('愛してる彼');
  await page.getByLabel('Número', { exact: true }).fill('07');
  await page.getByRole('radio', { name: 'XL', exact: true }).check();
  await page.getByLabel('Frase opcional', { exact: true }).fill('Só rounds. ' + family);
  await page.getByRole('button', { name: 'Copiar resumo' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-copied', /Nick: 愛してる彼\nNúmero: 07\nTamanho: XL/);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descarregar TXT' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('shush-drop01.txt');
  const text = Buffer.concat(await (await download.createReadStream())!.toArray()).toString('utf8');
  expect(text).toContain('Frase: Só rounds. ' + family);
  await page.getByRole('button', { name: 'Partilhar personalização' }).click();
  const shared = new URL((await page.locator('body').getAttribute('data-copied'))!);
  expect(shared.searchParams.get('nick')).toBe('愛してる彼');
  expect(shared.searchParams.get('size')).toBe('XL');
  await page.goto(shared.href);
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue('愛してる彼');
  await expect(page.getByLabel('Frase opcional', { exact: true })).toHaveValue('Só rounds. ' + family);
  await expect(page.getByLabel('Pré-visualização: 愛してる彼 07')).toBeVisible();
  await page.locator('.drop-draft summary').click();
  await page.getByRole('button', { name: 'Guardar rascunho', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Rascunho guardado' })).toBeVisible();
  await page.getByRole('button', { name: 'Repor', exact: true }).click();
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue('SHUSH');
  expect(new URL(page.url()).searchParams.has('drop')).toBe(false);
  await page.getByRole('button', { name: 'Recuperar rascunho', exact: true }).click();
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue('愛してる彼');
  await page.getByRole('button', { name: 'Remover rascunho', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('shush:drop01:draft:v1'))).toBeNull();
});

test('Drop: blocked APIs recover without losing fields', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('blocked'); } }, configurable: true });
    Object.defineProperty(Storage.prototype, 'setItem', { value: () => { throw new DOMException('blocked', 'SecurityError'); }, configurable: true });
  });
  await page.goto('/products/jersey');
  await page.getByLabel('Nick', { exact: true }).fill('SHUSH 愛');
  await page.getByRole('button', { name: 'Copiar resumo' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Seleciona o resumo' })).toBeVisible();
  await expect(page.getByLabel('Resumo do pedido')).toHaveValue(/Nick: SHUSH 愛/);
  await page.getByRole('button', { name: 'Partilhar personalização' }).click();
  await expect(page.getByLabel('Ligação para copiar')).toHaveValue(/drop=1/);
  await page.locator('.drop-draft summary').click();
  await page.getByRole('button', { name: 'Guardar rascunho', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'não permitiu guardar' })).toBeVisible();
  await expect(page.getByLabel('Nick', { exact: true })).toHaveValue('SHUSH 愛');
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
  await expect(page.locator('#selected-player-name')).toHaveText('dstx');
  await page.goto('/404.html');
  await expect(page).toHaveTitle('404 — SHUSH');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await expect(page.getByRole('navigation', { name: 'Recuperar navegação' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('static-404.png'), fullPage: true });
});
