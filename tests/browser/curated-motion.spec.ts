import { expect, test } from '@playwright/test';

test('plantel desliza, filtra e abre o perfil escolhido', async ({ page }) => {
  await page.goto('/#plantel');
  const strip = page.locator('#lineup-strip');
  await expect(strip.getByRole('link')).toHaveCount(7);
  const next = page.getByRole('button', { name: 'Jogador seguinte' });
  if (await next.isVisible()) {
    await next.click();
    await expect.poll(() => strip.evaluate(node => node.scrollLeft)).toBeGreaterThan(16);
  }
  await page.getByLabel('Filtrar por função').selectOption('Duelista');
  await expect(strip.getByRole('link')).toHaveCount(2);
  await strip.getByRole('link', {name: /Levi/}).click();
  await expect(page).toHaveURL(/roster\?player=levi/);
});

test('marcador percorre o arquivo e abre a partida selecionada', async ({ page }) => {
  await page.goto('/esports/valorant/premier');
  const card = page.locator('.match-front-page');
  await expect(card).toContainText('EnLitro');
  await page.getByRole('button', {name:'Partida anterior no marcador'}).click();
  await expect(card).toContainText('ILPSNI');
  await page.getByRole('button', {name:'Partida seguinte no marcador'}).click();
  await expect(card).toContainText('EnLitro');
  await page.getByRole('button', {name:'Partida seguinte no marcador'}).click();
  await expect(card).toContainText('VallhallaWolves');
  await card.click();
  await expect(page).toHaveURL(/#match-2026-05-16-vallhalla$/);
  await expect(page.locator('.verified-match.is-linked details')).toHaveAttribute('open', '');
});

test('arquivo interno conserva exportação e ligação direta', async ({ page }) => {
  await page.goto('/esports/valorant/premier#calendar');
  await expect(page.locator('#archive')).toHaveAttribute('open', '');
  const download = page.waitForEvent('download');
  await page.getByRole('button', {name: /Descarregar calendário/}).click();
  expect((await download).suggestedFilename()).toMatch(/\.ics$/);
});

test('menu móvel conserva o foco ao fechar e abre a história', async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width >= 768);
  await page.goto('/');
  const button = page.getByRole('button', {name:'Abrir navegação'});
  await button.click();
  await expect(page.locator('#mobile-navigation a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await button.click();
  await page.locator('#mobile-navigation').getByRole('link', {name:'Sobre'}).click();
  await expect(page.locator('.masked-word')).toHaveText('SHUSH');
});
