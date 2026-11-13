import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Observation, not a synthetic Core Web Vitals certification or a speed gate.
test('record initial and repeat loading measurements', async ({ page }, info) => {
  test.skip(!['mobile-390', 'desktop-1366'].includes(info.project.name), 'Representative Chromium viewports');
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const data = { lcpCandidate: 0, shifts: [] as [number, number][], longTasks: [] as number[] };
    Object.assign(window, { shushLoadingMetrics: data });
    const observe = (type: string, consume: (entry: PerformanceEntry) => void) => {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) return;
      new PerformanceObserver(list => list.getEntries().forEach(consume)).observe({ type, buffered: true });
    };
    observe('largest-contentful-paint', entry => { data.lcpCandidate = entry.startTime; });
    observe('layout-shift', entry => {
      const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
      if (!shift.hadRecentInput) data.shifts.push([shift.startTime, shift.value]);
    });
    observe('longtask', entry => data.longTasks.push(entry.duration));
  });
  const samples = [];
  for (let run = 0; run < 3; run++) {
    await page.goto('/');
    if (run === 0) await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    // Each pair starts with an unseen intro and then repeats in the same context.
    await page.evaluate(() => {
      for (const storage of [localStorage, sessionStorage]) {
        for (const key of Object.keys(storage)) if (key.startsWith('shush:intro:')) storage.removeItem(key);
      }
    });
    for (const visit of ['initial', 'repeat']) {
      await page.reload();
      await expect(page.locator('.shush-root')).toHaveAttribute('data-entering', 'false');
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.allSettled([...document.querySelectorAll<HTMLImageElement>('.opening img')].map(img => img.decode()));
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      await expect.poll(() => page.evaluate(() => (window as unknown as { shushLoadingMetrics: { lcpCandidate: number } }).shushLoadingMetrics.lcpCandidate)).toBeGreaterThan(0);
      const metrics = await page.evaluate(() => {
        const data = (window as unknown as { shushLoadingMetrics: { lcpCandidate: number; shifts: [number, number][]; longTasks: number[] } }).shushLoadingMetrics;
        let cls = 0, session = 0, start = 0, last = -Infinity;
        for (const [time, value] of data.shifts) {
          if (time - last > 1000 || time - start > 5000) { session = 0; start = time; }
          session += value; cls = Math.max(cls, session); last = time;
        }
        return {
          sampledAtMs: performance.now(), lcpCandidateMs: data.lcpCandidate, observedCls: cls,
          fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
          longTaskCount: data.longTasks.length, longTaskTotalMs: data.longTasks.reduce((a, b) => a + b, 0),
          resourceCount: performance.getEntriesByType('resource').length,
          season: document.querySelector('.shush-root')?.getAttribute('data-season'),
        };
      });
      expect(metrics.lcpCandidateMs).toBeGreaterThan(0);
      samples.push({ run: run + 1, visit, ...metrics });
    }
  }
  const report = { viewport: page.viewportSize(), browser: 'Chromium', samples,
    limitations: 'Local CI preview, no CPU/network throttling; navigation uses an existing browser context and cache. Initial means unseen intro, not a cold browser cache. LCP candidate and CLS cover only startup until resources settle. No field INP, full-session CLS, mobile-device or production-network claim.' };
  const json = JSON.stringify(report, null, 2);
  await writeFile(info.outputPath('loading-metrics.json'), json);
  await info.attach('loading-metrics', { body: json, contentType: 'application/json' });
});
