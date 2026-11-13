import { test, expect } from '@playwright/test';

const representative = (name: string) => ['desktop-1366', 'mobile-390', 'mobile-webkit'].includes(name);
test('ready resources reveal the page within the exit transition and resume its animations', async ({ page }, info) => {
  test.skip(!representative(info.project.name), 'Representative entrance engines');
  const now = Date.parse('2026-11-13T12:00:00Z');
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now + 100);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'true');
  await expect(page.locator('.shush-hero h1')).toHaveCSS('animation-play-state', 'paused');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.allSettled([...document.querySelectorAll<HTMLImageElement>('.route-frame img:not([loading="lazy"])')].map(img => img.decode()));
  });
  await page.clock.fastForward(500);
  await expect(page.getByRole('dialog', { name: 'Entrada SHUSH' })).toHaveCount(0);
  await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
  await expect(page.locator('.shush-hero h1')).toHaveCSS('animation-play-state', 'running');
  await page.reload();
  await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
  await expect(page.getByRole('dialog', { name: 'Entrada SHUSH' })).toHaveCount(0);
});

test('header and footer motion preferences stay in sync', async ({ page }, info) => {
  test.skip(!representative(info.project.name), 'Representative controls');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: 'Entrada SHUSH' })).toHaveCount(0);
  if ((page.viewportSize()?.width ?? 0) < 768) await page.getByRole('button', { name: 'Abrir navegação' }).click();
  const quick = page.getByRole('button', { name: 'Animações da página' });
  await quick.click();
  await expect(quick).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  if ((page.viewportSize()?.width ?? 0) < 768) await page.keyboard.press('Escape');
  const footer = page.getByRole('button', { name: 'Reduzir animações', exact: true });
  await expect(footer).toHaveAttribute('aria-pressed', 'true');
  await footer.click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'system');
  if ((page.viewportSize()?.width ?? 0) < 768) await page.getByRole('button', { name: 'Abrir navegação' }).click();
  await expect(page.getByRole('button', { name: 'Animações da página' })).toHaveAttribute('aria-pressed', 'false');
});

test('the drop explains availability before personalisation and retains saving controls', async ({ page }) => {
  await page.goto('/products/jersey');
  await expect(page.locator('.drop-availability')).toContainText('ainda não está disponível para encomenda');
  await page.getByLabel('Nick', { exact: true }).fill('A MINHA TAG');
  await expect(page.locator('.audit-live-print').first()).toContainText('A MINHA TAG');
  await expect(page.getByRole('button', { name: 'Descarregar TXT' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Partilhar personalização' })).toBeEnabled();
});

test('spring secrets preserve the revised brand story', async ({ page }) => {
  await page.clock.install({ time: new Date('2027-03-28T12:00:00Z') });
  await page.goto('/');
  for (const button of await page.locator('.season-hidden-grid button').all()) await button.click();
  await expect(page.locator('.season-hidden-grid')).not.toContainText(/Less|aspas|LOUD/);
});
