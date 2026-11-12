import { test, expect } from '@playwright/test';

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

  await page.goto('/');
  const tree = page.locator('.winter-tree-stage canvas');
  await tree.focus();
  await expect(tree).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Tab');
  await expect(tree).not.toBeFocused();
  await expect(page.locator('.winter-palette')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Luzes on/ })).toBeFocused();
});
