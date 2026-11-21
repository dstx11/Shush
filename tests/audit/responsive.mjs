import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4173';
const output = process.env.AUDIT_OUTPUT || 'test-results/site-audit';
const routes = {
  home: '/', premier: '/esports/valorant/premier', roster: '/esports/valorant/roster',
  creators: '/content', about: '/company',
};
const sizes = [[320,740],[375,812],[390,844],[430,932],[600,900],[768,1024],[900,900],
  [1024,900],[1280,800],[1366,900],[1440,900],[1920,1080],[2560,1440]];
await mkdir(output, {recursive:true});

function observeVitals() {
  const vitals = { lcpMs: null, cls: 0 };
  window.shushAuditVitals = vitals;
  let start = 0, last = -Infinity, sum = 0;
  for (const type of ['largest-contentful-paint', 'layout-shift']) {
    if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (type === 'largest-contentful-paint') vitals.lcpMs = Math.round(entry.startTime);
        else if (!entry.hadRecentInput) {
          if (entry.startTime - last >= 1000 || entry.startTime - start >= 5000) {
            start = entry.startTime; sum = 0;
          }
          last = entry.startTime;
          sum += entry.value;
          vitals.cls = Math.max(vitals.cls, sum);
        }
      }
    }).observe({type, buffered:true});
  }
}

const browser = await chromium.launch();
const rows = [];
try {
  for (const [width, height] of sizes) {
    for (const [route, path] of Object.entries(routes)) {
      const row = {route, width, issues: [], axe: null};
      rows.push(row);
      const context = await browser.newContext({ viewport: {width, height},
        isMobile: width < 768, hasTouch: width <= 1024, deviceScaleFactor: 1 });
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        const firstParty = url => url.startsWith(origin + '/');
        page.on('pageerror', err => row.issues.push('runtime: ' + err.message));
        page.on('console', msg => { if (msg.type() === 'error') row.issues.push('console: ' + msg.text()); });
        page.on('response', r => { if (firstParty(r.url()) && r.status() >= 400) row.issues.push(r.status() + ' ' + r.url()); });
        page.on('requestfailed', req => {
          if (firstParty(req.url()) && req.failure()?.errorText !== 'net::ERR_ABORTED')
            row.issues.push('network: ' + req.url() + ' ' + req.failure()?.errorText);
        });
        await page.addInitScript(observeVitals);
        await page.goto(origin + path);
        await page.locator('#shush-boot-stage').waitFor({state:'detached'});
        await page.locator('dialog[open]').waitFor({state:'hidden'});
        await page.getByRole('heading', {level:1}).waitFor();
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.allSettled(Array.from(document.images)
            .filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0)
            .map(img => img.decode()));
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        Object.assign(row, await page.evaluate(() => ({
          ...window.shushAuditVitals, sampleMs: Math.round(performance.now()),
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          headings: document.querySelectorAll('main h1').length, main: document.querySelectorAll('main').length,
        })));
        if (row.documentWidth > row.viewportWidth + 1) row.issues.push('horizontal overflow');
        if (row.headings !== 1 || row.main !== 1) row.issues.push('heading or main count');
        if ([390,1440].includes(width)) {
          await page.screenshot({path:output + '/' + route + '-' + width + '.jpg',type:'jpeg',quality:68,fullPage:true,timeout:30000});
          const {violations} = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22a','wcag22aa']).analyze();
          row.axe = violations.map(v => ({id:v.id,impact:v.impact,nodes:v.nodes.map(n => ({target:n.target, failure:n.failureSummary}))}));
          row.issues.push(...row.axe.map(v => 'axe: ' + v.id + ' (' + v.nodes.length + ')'));
        }
      } catch (e) { row.issues.push(String(e)); }
      finally { await context.close(); }
      console.log(JSON.stringify({route,width,lcpMs:row.lcpMs,cls:row.cls,issues:row.issues}));
    }
  }
} finally {
  await browser.close();
  await writeFile(output + '/responsive.json',JSON.stringify(rows,null,2));
}
const failed = rows.filter(r => r.issues.length);
console.log('Responsive audit: ' + (rows.length-failed.length) + ' / ' + rows.length + ' clean samples');
if (failed.length) process.exitCode = 1;
