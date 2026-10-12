import { test, expect } from '@playwright/test';

test('Home: balanced refreshes, three unique profiles and stable SPA return', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('shush:home:rotation:v1', '0'));
  const counts: Record<string, number> = {};
  const centres = new Set<string>();
  let previous: string[] = [];
  for (let visit = 0; visit < 7; visit++) {
    await page.reload();
    const covers = page.locator('.team-cover-player');
    await expect(covers).toHaveCount(3);
    const ids = await covers.evaluateAll(items => items.map(item => item.getAttribute('data-player')!));
    expect(new Set(ids).size).toBe(3);
    expect([...ids].sort()).not.toEqual([...previous].sort());
    ids.forEach(id => { counts[id] = (counts[id] ?? 0) + 1; }); centres.add(ids[1]); previous = ids;
    for (const [index, id] of ids.entries()) await expect(covers.nth(index)).toHaveAttribute('href', `/esports/valorant/roster?player=${id}`);
  }
  expect(Object.values(counts)).toEqual(Array(7).fill(3)); expect(centres.size).toBe(7);
  await page.locator('.team-cover-player').first().click();
  await expect(page).toHaveURL(new RegExp(`player=${previous[0]}`));
  await page.goBack();
  await expect(page.locator('.team-cover-player')).toHaveCount(3);
  expect(await page.locator('.team-cover-player').evaluateAll(items => items.map(item => item.getAttribute('data-player')))).toEqual(previous);
});

test('Home: unavailable storage still renders three stable players', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-11T12:00:00Z') });
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Unavailable'); } }));
  await page.goto('/');
  const players = page.locator('.team-cover-player');
  await expect(players).toHaveCount(3);
  const before = await players.evaluateAll(items => items.map(item => item.getAttribute('data-player')));
  await page.clock.fastForward(120_000);
  expect(await players.evaluateAll(items => items.map(item => item.getAttribute('data-player')))).toEqual(before);
  await page.locator('.discovery-company').click(); await page.goBack();
  await expect(players).toHaveCount(3);
  expect(await players.evaluateAll(items => items.map(item => item.getAttribute('data-player')))).toEqual(before);
});
