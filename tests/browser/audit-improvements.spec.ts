import { test, expect } from '@playwright/test';

const representative = (name: string) => ['desktop-1366', 'mobile-390', 'mobile-webkit'].includes(name);
test('the first route becomes interactive without waiting for image decoding', async ({ page }, info) => {
  test.skip(!representative(info.project.name), 'Representative entrance engines');
  await page.addInitScript(() => { HTMLImageElement.prototype.decode = () => new Promise<void>(() => {}); });
  await page.goto('/');
  await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
  await expect(page.locator('#shush-boot-stage')).toHaveCount(0);
  await page.getByRole('link', {name: 'Conhecer o roster'}).click();
  await expect(page).toHaveURL(/roster$/);
  await expect(page.locator('#selected-player-name')).toBeVisible();
});

test('optional quiet motion persists across pages and can be reversed', async ({page}, info) => {
  test.skip(!representative(info.project.name), 'Representative controls');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/?intro=1', {waitUntil:'domcontentloaded'});
  await page.getByRole('button', {name:'Saltar apresentação'}).click();
  const control = page.getByRole('button', {name:'Movimento suave'});
  await expect(control).toHaveAttribute('aria-pressed','false');
  await control.click();
  await expect(page.locator('html')).toHaveAttribute('data-quiet-motion','');
  await expect(page.locator('.scene-light')).toHaveCount(0);
  await page.goto('/content');
  await expect(control).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.scene-light')).toHaveCount(0);
  await control.click();
  await expect(page.locator('.creator-feature .scene-light')).toHaveCount(2);
});

test('spring secrets preserve the revised brand story', async ({ page }) => {
  await page.clock.install({ time: new Date('2027-03-28T12:00:00Z') });
  await page.goto('/');
  for (const button of await page.locator('.season-hidden-grid button').all()) await button.click();
  await expect(page.locator('.season-hidden-grid')).not.toContainText(/Less|aspas|LOUD/);
});
