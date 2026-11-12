import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const headers = readFileSync('public/_headers', 'utf8');
const policy = headers.split('\n').find(line => line.trim().startsWith('Content-Security-Policy:'))!.split('Content-Security-Policy:')[1].trim();

test('production CSP blocks executable injections while the customizer and studio remain usable', async ({ page }, info) => {
  test.skip(!['desktop-1366', 'mobile-390', 'mobile-webkit'].includes(info.project.name), 'Representative CSP engines');
  await page.clock.install({ time: new Date('2026-12-12T12:00:00Z') });
  // Enforce the exact deployment policy on a reserved HTTPS test origin.
  // All bytes still come from the local production preview; no external host is contacted.
  await page.route('https://shush.test/**', async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({ url: `http://127.0.0.1:4173${url.pathname}${url.search}` });
    const nextHeaders = { ...response.headers() };
    if (route.request().isNavigationRequest() && route.request().resourceType() === 'document') nextHeaders['content-security-policy'] = policy;
    await route.fulfill({ response, headers: nextHeaders });
  });
  await page.addInitScript(() => {
    const scope = window as unknown as { policyViolations: string[] }; scope.policyViolations = [];
    document.addEventListener('securitypolicyviolation', event => scope.policyViolations.push(event.effectiveDirective));
  });
  await page.goto('https://shush.test/products/jersey?drop=1&nick=SHUSH&number=07&size=L');
  const nick = page.getByRole('textbox', { name: 'Nick' });
  await nick.fill('<img src=x>');
  await expect(page.locator('.audit-live-print').first()).toContainText('<img src=x>');
  expect(await page.locator('img[src="x"]').count()).toBe(0);
  expect(await page.locator('.audit-drop-image').first().evaluate(element => getComputedStyle(element).getPropertyValue('--print-name-size'))).not.toBe('');
  expect(await page.evaluate(() => (window as unknown as { policyViolations: string[] }).policyViolations)).toEqual([]);
  const probe = await page.evaluate(async () => {
    const scope = window as unknown as { injected?: boolean };
    const violations: string[] = [];
    document.addEventListener('securitypolicyviolation', event => violations.push(event.effectiveDirective));
    const script = document.createElement('script'); script.textContent = 'window.injected=true'; document.head.append(script);
    const style = document.createElement('style'); style.textContent = 'body{display:none!important}'; document.head.append(style);
    const object = document.createElement('object'); object.data = '/og-shush.png'; document.body.append(object);
    await new Promise(resolve => setTimeout(resolve, 100));
    const result = { injected: Boolean(scope.injected), display: getComputedStyle(document.body).display, violations };
    object.remove(); style.remove(); script.remove(); return result;
  });
  expect(probe.injected).toBe(false); expect(probe.display).not.toBe('none');
  expect(probe.violations.some(value => value.startsWith('script-src'))).toBe(true);
  expect(probe.violations).toContain('style-src-elem'); expect(probe.violations).toContain('object-src');
  await page.evaluate(() => { (window as unknown as { policyViolations: string[] }).policyViolations = []; });
  await page.getByRole('link', { name: 'SHUSH — Home', exact: true }).click();
  await page.getByRole('button', { name: /Criar o meu postal/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Descarregar postal PNG' })).toBeEnabled();
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Descarregar postal PNG' }).click();
  expect((await download).suggestedFilename()).toContain('.png');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => (window as unknown as { policyViolations: string[] }).policyViolations)).toEqual([]);
  await page.goto('https://shush.test/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Fora do');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  expect(await page.evaluate(() => (window as unknown as { policyViolations: string[] }).policyViolations)).toEqual([]);
});
