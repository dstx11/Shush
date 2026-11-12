import { chromium } from '@playwright/test';

// Run against an already-running production preview. This is a synthetic lab,
// not a field INP measurement or a CI timing threshold.
const base = process.argv[2] ?? 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath: process.env.SHUSH_CHROMIUM_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    window.postcardLab = { scenePaints: 0, previewCopies: 0, eventDurationsMs: [] };
    const fill = CanvasRenderingContext2D.prototype.fillRect;
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (args[2] === 1600 && args[3] === 900) window.postcardLab.scenePaints++;
      return fill.apply(this, args);
    };
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      if (this.canvas.width === 1600 && this.canvas.height === 900) window.postcardLab.previewCopies++;
      return draw.apply(this, args);
    };
    new PerformanceObserver(list => {
      for (const event of list.getEntries()) if (event.interactionId) window.postcardLab.eventDurationsMs.push(event.duration);
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  });
  await page.goto(base);
  await page.getByRole('button', { name: /Criar o meu postal/ }).click();
  const input = page.getByRole('textbox', { name: /Mensagem/ });
  await input.fill('');
  await page.getByRole('button', { name: 'Descarregar postal PNG' }).waitFor({ state: 'visible' });
  await page.waitForFunction(() => !document.querySelector('.winter-card-download')?.disabled);
  await (await page.context().newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => { window.postcardLab.scenePaints = 0; window.postcardLab.previewCopies = 0; window.postcardLab.eventDurationsMs = []; });
  const text = 'Boas festas. Mais rounds e boas memórias.';
  const start = Date.now();
  await input.pressSequentially(text);
  await page.waitForTimeout(100);
  console.log(JSON.stringify({ ...await page.evaluate(() => window.postcardLab), scenarioDurationMs: Date.now() - start,
    text, cpuThrottle: 4, settleMs: 100, browser: browser.version(), viewport: '390×844', fieldINP: 'not measured' }, null, 2));
} finally { await browser.close(); }
