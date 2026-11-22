import { test, expect } from '@playwright/test';

// Christmas is now a dated campaign. Exercise it with a deterministic Lisbon date.
test.beforeEach(async ({ page }) => { await page.clock.install({ time: new Date('2026-12-12T12:00:00Z') }); });

test('Visitors can create a personalized Christmas card, download a real PNG and close the editor', async ({ page }, testInfo) => {
  test.skip(!['desktop-1366', 'mobile-390'].includes(testInfo.project.name), 'Representative desktop and mobile coverage');

  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const open = page.getByRole('button', { name: /Criar o meu postal de Natal/i });
  await open.click();
  const dialog = page.getByRole('dialog', { name: 'Um postal à tua maneira.' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('radio', { name: 'Noite de inverno' }).check();
  await expect(dialog.getByRole('radio', { name: 'Noite de inverno' })).toBeChecked();

  const text = 'Feliz Natal à equipa SHUSH. Mais rounds e boas memórias!';
  await dialog.getByRole('textbox', { name: 'Mensagem' }).fill(text);
  await dialog.getByRole('textbox', { name: 'Assinatura' }).fill('DSTX & amigos');
  if (testInfo.project.name === 'mobile-390') {
    const closeControl = await dialog.getByRole('button', { name: 'Fechar editor de postal' }).boundingBox();
    expect(closeControl).not.toBeNull();
    expect(closeControl!.y).toBeGreaterThanOrEqual(0);
    expect(closeControl!.y + closeControl!.height).toBeLessThanOrEqual(844);
  }
  await dialog.screenshot({ path: testInfo.outputPath('christmas-card-studio.png') });
  const canvas = dialog.locator('canvas');
  await expect(canvas).toHaveJSProperty('width', 1600);
  await expect(canvas).toHaveJSProperty('height', 900);
  const pendingDownload = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Descarregar postal PNG' }).click();
  const file = await pendingDownload;
  expect(file.suggestedFilename()).toBe('shush-boas-festas-2026.png');
  const stream = await file.createReadStream();
  expect(stream).not.toBeNull();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const png = Buffer.concat(chunks);
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect(png.readUInt32BE(16)).toBe(1600);
  expect(png.readUInt32BE(20)).toBe(900);
  await expect(dialog.getByRole('status')).toContainText('descarregamento foi iniciado');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  expect(errors).toEqual([]);
});

test('The Christmas tree supports keyboard rotation and does not trap navigation', async ({ page }, testInfo) => {
  test.skip(!['desktop-1366', 'mobile-390'].includes(testInfo.project.name), 'Representative desktop and mobile coverage');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const intro = page.getByRole('dialog', { name: 'Entrada SHUSH' });
  await expect(intro).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(intro).toHaveCount(0);

  const lights = page.getByRole('button', { name: /Luzes on/ });
  const pause = page.getByRole('button', { name: 'Pausar', exact: true });
  await pause.click();
  const resume = page.getByRole('button', { name: 'Reproduzir', exact: true });
  await expect(resume).toHaveAttribute('aria-pressed', 'true');
  await resume.press('Shift+Tab');
  await expect(lights).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  const tree = page.locator('.winter-tree-stage canvas');
  await expect(tree).toBeFocused();
  await expect(tree).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const frame = () => tree.evaluate((canvas: HTMLCanvasElement) => {
    const sample = document.createElement('canvas');
    sample.width = sample.height = 64;
    sample.getContext('2d')!.drawImage(canvas, 0, 0, 64, 64);
    return sample.toDataURL();
  });
  const original = await frame();
  await page.keyboard.press('ArrowRight');
  expect(await frame()).not.toBe(original);
  await page.keyboard.press('ArrowLeft');
  expect(await frame()).toBe(original);
  await page.keyboard.press('Tab');
  await expect(lights).toBeFocused();
});
