import { test, expect } from '@playwright/test';

// State transitions that were not covered by the original happy-path journeys.
test('postcard keeps the background still, padding open and accessible field names stable', async ({ page }, info) => {
  test.skip(!['desktop-1366', 'mobile-390'].includes(info.project.name), 'Representative modal layouts');
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /Criar o meu postal/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Um postal à tua maneira.' });
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
  const message = dialog.getByRole('textbox', { name: 'Mensagem', exact: true });
  await message.fill('W'.repeat(95));
  await expect(message).toHaveAccessibleDescription('95/95 caracteres');
  const bounds = (await dialog.boundingBox())!;
  await page.mouse.click(bounds.x + 5, bounds.y + Math.min(150, bounds.height / 2));
  await expect(dialog).toBeVisible();
  await dialog.screenshot({ path: info.outputPath('postcard-long-word.png') });
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('postcard export failure recovers and a closed editor ignores late export callbacks', async ({ page }, info) => {
  test.skip(!['desktop-1366', 'mobile-390'].includes(info.project.name), 'Representative modal layouts');
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    const mock = window as unknown as { restoreExport: () => void; finishExport: () => void };
    const callbacks: BlobCallback[] = [];
    mock.restoreExport = () => { HTMLCanvasElement.prototype.toBlob = original; };
    mock.finishExport = () => callbacks.shift()?.(null);
    HTMLCanvasElement.prototype.toBlob = function(callback) { callbacks.push(callback); };
  });
  await page.goto('/');
  await page.getByRole('button', { name: /Criar o meu postal/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Descarregar postal PNG' }).click();
  await expect(dialog.getByRole('button', { name: 'A preparar PNG…' })).toBeDisabled();
  await page.evaluate(() => (window as unknown as { finishExport: () => void }).finishExport());
  await expect(dialog.getByRole('status')).toContainText('Não foi possível criar a imagem');
  await expect(dialog.getByRole('button', { name: 'Descarregar postal PNG' })).toBeEnabled();
  await dialog.getByRole('button', { name: 'Descarregar postal PNG' }).click();
  await page.keyboard.press('Escape');
  await page.evaluate(() => (window as unknown as { finishExport: () => void }).finishExport());
  await page.getByRole('button', { name: /Criar o meu postal/ }).click();
  await expect(dialog.locator('.winter-card-feedback')).toBeEmpty();
  await page.evaluate(() => (window as unknown as { restoreExport: () => void }).restoreExport());
  const downloaded = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Descarregar postal PNG' }).click();
  expect((await downloaded).suggestedFilename()).toBe('shush-boas-festas-2026.png');
});

test('enabling reduced motion removes a departing portrait immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/esports/valorant/roster');
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portrait-depart')).toHaveCount(0);
  await expect(page.locator('#selected-player-name')).toHaveText('More');
});

test('editing invalidates an old transfer without clearing a newer busy state', async ({ page }) => {
  await page.addInitScript(() => {
    const releases: (() => void)[] = [];
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => new Promise<void>(resolve => releases.push(resolve)) } });
    (window as unknown as { releaseCopy: () => void }).releaseCopy = () => releases.shift()?.();
  });
  await page.goto('/products/jersey');
  const copy = page.getByRole('button', { name: 'Copiar resumo' });
  await copy.click();
  await expect(copy).toBeDisabled();
  await page.getByRole('textbox', { name: 'Nick' }).fill('NOVA');
  await expect(copy).toBeEnabled();
  await copy.click();
  await page.evaluate(() => (window as unknown as { releaseCopy: () => void }).releaseCopy());
  await expect(copy).toBeDisabled();
  await expect(page.getByRole('status')).toContainText('A copiar o resumo');
  await page.evaluate(() => (window as unknown as { releaseCopy: () => void }).releaseCopy());
  await expect(copy).toBeEnabled();
  await expect(page.getByRole('status')).toContainText('Resumo copiado.');
});

test('a pending roster transfer cannot update the newly selected player', async ({ page }) => {
  await page.addInitScript(() => {
    let release: (() => void) | undefined;
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => new Promise<void>(resolve => { release = resolve; }) } });
    (window as unknown as { releaseCopy: () => void }).releaseCopy = () => release?.();
  });
  await page.goto('/esports/valorant/roster');
  await page.getByRole('button', { name: 'Copiar Riot ID' }).click();
  await expect(page.getByRole('button', { name: 'Partilhar jogador' })).toBeDisabled();
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await page.evaluate(() => (window as unknown as { releaseCopy: () => void }).releaseCopy());
  await expect(page.getByRole('button', { name: 'Copiar Riot ID' })).toBeEnabled();
  await expect(page.locator('.player-utilities [role="status"]')).toBeEmpty();
});

test('navigation reconstructs metadata even when the previous schema is malformed', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => { document.getElementById('shush-schema')!.textContent = '{broken'; });
  await page.locator('.home-closing a[href="/company"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A culpa foi');
  const graph = await page.locator('#shush-schema').textContent();
  expect(JSON.parse(graph!)['@graph'].some((item: { '@type': string }) => item['@type'] === 'AboutPage')).toBe(true);
  expect(errors).toEqual([]);
});

test('a postcard drawing failure preserves the page and edits and can be retried', async ({ page }) => {
  let documents = 0;
  page.on('request', request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    let blocked = true;
    const state = window as unknown as { postcardFailures: number; restorePostcard: () => void };
    state.postcardFailures = 0;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (blocked && this.closest('.winter-card-preview')) { state.postcardFailures++; return null; }
      return original.apply(this, args);
    } as typeof original;
    state.restorePostcard = () => { blocked = false; };
  });
  await page.goto('/');
  await page.getByRole('button', { name: /Criar o meu postal/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('alert')).toContainText('Não foi possível desenhar');
  await dialog.getByRole('textbox', { name: 'Mensagem', exact: true }).fill('A nossa noite.');
  await expect.poll(() => page.evaluate(() => (window as unknown as { postcardFailures: number }).postcardFailures)).toBeGreaterThanOrEqual(2);
  await expect(dialog.getByRole('alert')).toBeVisible();
  await page.evaluate(() => (window as unknown as { restorePostcard: () => void }).restorePostcard());
  await dialog.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(dialog.getByRole('button', { name: 'Descarregar postal PNG' })).toBeEnabled();
  await expect(dialog.getByRole('textbox', { name: 'Mensagem', exact: true })).toHaveValue('A nossa noite.');
  expect(documents).toBe(1);
});

test('a failed hover prefetch never reloads the current page', async ({ page }) => {
  let documents = 0;
  page.on('request', request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
  await page.route('**/assets/AboutPage-*.js', route => route.abort());
  await page.goto('/products/jersey');
  const input = page.getByRole('textbox', { name: 'Nick' });
  await input.fill('MANTER');
  const failed = page.waitForEvent('requestfailed', request => request.url().includes('/AboutPage-'));
  await page.locator('footer a[href="/company"]').focus();
  await failed;
  await page.waitForLoadState('networkidle');
  await expect(input).toHaveValue('MANTER');
  expect(documents).toBe(1);
});

test('postcards preserve complete Unicode characters and report export failures on match posters', async ({ page }, info) => {
  test.skip(!['desktop-1366', 'mobile-390'].includes(info.project.name), 'Representative export layouts');
  await page.goto('/');
  await page.getByRole('button', { name: /Criar o meu postal/ }).click();
  const studio = page.getByRole('dialog');
  const family = '👨‍👩‍👧‍👦';
  const message = studio.getByRole('textbox', { name: 'Mensagem', exact: true });
  await message.fill(family.repeat(10));
  await studio.getByRole('textbox', { name: 'Assinatura' }).fill(family.repeat(3));
  await expect(message).toHaveValue(family.repeat(10));
  await expect(message).toHaveAccessibleDescription('10/95 caracteres');
  await expect(studio.locator('canvas')).toHaveAccessibleName(new RegExp(family.repeat(3)));
  await expect(studio.getByRole('button', { name: 'Descarregar postal PNG' })).toBeEnabled();
  await page.keyboard.press('Escape');
  await page.goto('/esports/valorant/premier');
  await page.locator('.match-detail summary').first().click();
  await page.getByRole('button', { name: 'Criar cartaz', exact: true }).first().click();
  const poster = page.getByRole('dialog', { name: 'Cartaz da partida' });
  await expect(poster.getByRole('button', { name: /Descarregar PNG/ })).toBeEnabled();
  await page.evaluate(() => { HTMLCanvasElement.prototype.toBlob = callback => callback(null); });
  await poster.getByRole('button', { name: /Descarregar PNG/ }).click();
  await expect(poster.getByRole('alert')).toContainText('Não foi possível exportar');
  await expect(poster.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
});

for (const path of ['/', '/esports/valorant/premier', '/esports/valorant/roster', '/content', '/products/jersey', '/company']) {
  test('200% text remains readable and controls fit: ' + path, async ({ page }, info) => {
    test.skip(!['desktop-1366', 'mobile-390'].includes(info.project.name), 'Representative text-resize widths');
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    if (path.endsWith('/premier')) {
      await page.locator('.legacy-archive > summary').click();
      await page.locator('.match-week').first().locator('summary').click();
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const clipped = await page.evaluate(() => [...document.querySelectorAll('a,button,input,select,textarea')].filter(element => {
      if (!element.checkVisibility() || element.closest('.character-strip,.home-lineup')) return false;
      const bounds = element.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0 && (bounds.left < -1 || bounds.right > innerWidth + 1);
    }).map(element => element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 50)));
    expect(clipped).toEqual([]);
    await page.screenshot({ path: info.outputPath('text-200-percent.png') });
  });
}

test('the postcard works offline and releases its bitmap when closed', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await context.setOffline(true);
  const trigger = page.getByRole('button', { name: /Criar o meu postal/ });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: 'Mensagem', exact: true }).fill('Uma noite tranquila.');
  await expect(dialog.getByRole('button', { name: 'Descarregar postal PNG' })).toBeEnabled();
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Descarregar postal PNG' }).click();
  expect((await download).suggestedFilename()).toBe('shush-boas-festas-2026.png');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.locator('.winter-card-preview canvas')).toHaveAttribute('width', '0');
  await trigger.click();
  await expect(dialog.getByRole('textbox', { name: 'Mensagem', exact: true })).toHaveValue('Uma noite tranquila.');
  await expect(dialog.getByRole('button', { name: 'Descarregar postal PNG' })).toBeEnabled();
  await expect(dialog.locator('canvas')).toHaveAttribute('width', '1600');
});
