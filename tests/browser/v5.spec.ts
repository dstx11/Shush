import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const roster = [['dstx', 'DSTX', '11', 'M'], ['more', 'More', '13', 'M'], ['th0maz7', 'Th0maz', '07', 'M'], ['lyel', 'Lyel', '16', 'XXL'], ['tz', 'TZ', '10', 'M'], ['levi', 'Levi', '09', 'M'], ['catty', 'Catty', '20', 'M']];
test('V5 official jerseys and independent roster indices', async ({ page }) => {
  for (const [index, [id, name, number, size]] of roster.entries()) {
    await page.goto(`/esports/valorant/roster?player=${id}`);
    await expect(page.locator('.character-controls > .mono')).toHaveText(`${String(index + 1).padStart(2, '0')} / 07`);
    await expect(page.locator('.character-number')).toHaveText(number);
    await expect(page.locator('.player-card-number')).toHaveText(['#11', '#13', '#07', '#16', '#10', '#09', '#20']);
    await page.getByRole('link', { name: `Ver camisola ${name}` }).click();
    await expect(page.getByLabel('Nick', { exact: true })).toHaveValue(name);
    await expect(page.getByLabel('Número', { exact: true })).toHaveValue(number);
    await expect(page.getByRole('radio', { name: size, exact: true })).toBeChecked();
    await page.getByLabel('Nick', { exact: true }).fill('EDITADO');
    await expect(page.getByLabel(`Pré-visualização: EDITADO ${number}`)).toBeVisible();
  }
});

test('Home and Creators show real people and dated records', async ({ page }) => {
  await page.goto('/content');
  await expect(page.locator('.creator-art img')).toHaveCount(2);
  for (const link of await page.locator('.creator-channel').all()) await expect(link).toHaveAttribute('target', '_blank');
  await page.goto('/');
  await expect(page.locator('.team-cover-player')).toHaveCount(3);
  await expect(page.locator('.home-lineup > a')).toHaveCount(7);
  await expect(page.locator('.home-score')).toHaveCount(3);
  await expect(page.locator('.home-records-heading')).toContainText('abril–junho 2026');
  await expect(page.locator('.home-creator-links > a')).toHaveCount(2);
});

test('V5 Match Explorer filters and verified map aggregates', async ({ page }) => {
  await page.goto('/esports/valorant/premier');
  await page.getByRole('button', { name: 'Vitórias', exact: true }).click();
  await expect(page.locator('.verified-match')).toHaveCount(2);
  await expect(page.getByLabel('Mapa', { exact: true }).locator('option')).toHaveText(['Todos os mapas', 'Ascent']);
  await page.getByRole('button', { name: 'Derrotas', exact: true }).click();
  await expect(page.locator('.verified-match')).toHaveCount(3);
  await page.getByLabel('Mapa', { exact: true }).selectOption('Haven');
  await expect(page.locator('.verified-match')).toHaveCount(1);
  await expect(page.locator('.verified-match')).toContainText('EnLitro');
  await expect(page.locator('.map-performance-row').filter({ hasText: 'Ascent' })).toContainText('2 partidas · 2 V / 0 D');
  await expect(page.getByLabel('Taxa de vitória em Ascent')).toHaveAttribute('value', '100');
  await page.locator('.match-detail summary').click();
  await expect(page.locator('.verified-match-source')).toContainText('10');
  await expect(page.locator('.verified-match-source a')).toHaveAttribute('href', /tracker.gg\/valorant\/premier\/teams\/.+\/matches$/);
});

test('V5 posters: exact PNG preview, both formats and focus recovery', async ({ page }, testInfo) => {
  await page.goto('/esports/valorant/premier');
  await page.locator('.match-detail summary').first().click();
  const trigger = page.getByRole('button', { name: 'Criar cartaz' }).first(); await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Cartaz da partida' });
  for (const [label, height] of [['Quadrado', 1080], ['Vertical', 1350]] as const) {
    await dialog.getByRole('button', { name: label, exact: true }).click();
    const downloadButton = dialog.getByRole('button', { name: 'Descarregar PNG' });
    await expect(downloadButton).toBeEnabled();
    const canvas = dialog.locator('canvas');
    await expect(canvas).toHaveJSProperty('width', 1080); await expect(canvas).toHaveJSProperty('height', height);
    const preview = await canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL('image/png').split(',')[1]);
    const pending = page.waitForEvent('download'); await downloadButton.click(); const file = await pending;
    const png = Buffer.concat(await (await file.createReadStream())!.toArray());
    expect(png.toString('base64')).toBe(preview);
    expect(png.readUInt32BE(16)).toBe(1080); expect(png.readUInt32BE(20)).toBe(height);
    await canvas.screenshot({ path: testInfo.outputPath(`poster-${height}.png`) });
  }
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze(); expect(axe.violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
});

test('V5 poster resource failure offers retry without closing the page', async ({ page }) => {
  await page.goto('/esports/valorant/premier'); await expect(page.locator('.verified-match')).toHaveCount(5);
  // WebKit may reuse an already-decoded logo without issuing a request.
  // Inject one decode failure at the resource boundary, independent of cache.
  await page.evaluate(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      HTMLImageElement.prototype.decode = decode;
      return Promise.reject(new DOMException('Invalid image', 'EncodingError'));
    };
  });
  await page.locator('.match-detail summary').first().click(); await page.getByRole('button', { name: 'Criar cartaz' }).first().click();
  const dialog = page.getByRole('dialog'); await expect(dialog.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(dialog.getByRole('button', { name: 'Descarregar PNG' })).toBeEnabled();
});

test('Poster loading cannot hang indefinitely when image decoding stalls', async ({ page }) => {
  await page.goto('/esports/valorant/premier');
  await page.clock.install();
  await page.evaluate(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      HTMLImageElement.prototype.decode = decode;
      document.body.dataset.stalledPoster = 'true';
      return new Promise<void>(() => {});
    };
  });
  await page.locator('.match-detail summary').first().click();
  await page.getByRole('button', { name: 'Criar cartaz' }).first().click();
  await expect(page.locator('body')).toHaveAttribute('data-stalled-poster', 'true');
  await page.clock.fastForward(8001);
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(dialog.getByRole('button', { name: 'Descarregar PNG' })).toBeEnabled();
});

test('V5 intro: bounded initial experience, reduced motion and no SPA replay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.brand-intro')).toHaveCount(0, { timeout: 7000 });
  await page.locator('.home-closing a[href="/company"]').click(); await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.brand-intro')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.brand-intro')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload(); await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.brand-intro')).toHaveCount(0);
});


test('Intro can be skipped with keyboard and is remembered across reloads', async ({ page }) => {
  const now = Date.now();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now + 100);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const intro = page.getByRole('dialog', { name: 'Entrada SHUSH' });
  await expect(intro).toBeVisible();
  await expect(intro).toHaveJSProperty('open', true);
  await expect(intro.getByRole('button', { name: 'Entrar' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(intro).toHaveCount(0);
  await page.reload();
  await expect(intro).toHaveCount(0);
  // Let React commit the lazy route after checking that the intro did not replay.
  await page.clock.runFor(1000);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => sessionStorage.removeItem('shush:intro-seen'));
  await page.reload();
  await expect(intro).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(intro).toHaveCount(0);
});

test('Unavailable session storage never blocks entry to the site', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.goto('/esports/valorant/roster?player=lyel');
  await expect(page.locator('#selected-player-name')).toHaveText('Lyel');
  await expect(page.locator('.brand-intro')).toHaveCount(0);
  await page.getByRole('button', { name: 'Jogador seguinte' }).click();
  await expect(page.locator('#selected-player-name')).toHaveText('TZ');
});
