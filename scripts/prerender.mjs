import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';

// Render the real React routes at build time. No server is deployed or listened on.
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { staticPage } = await vite.ssrLoadModule('/src/prerender.tsx');
  const { routeMetadata } = await vite.ssrLoadModule('/src/data/meta.ts');
  for (const route of Object.keys(routeMetadata)) {
    const content = renderToStaticMarkup(staticPage(route))
      .replace(/<link rel="preload"[^>]*\/>/g, '')
      // These controls require React. Keep native links usable without JS.
      .replace(/<(button|input|select|textarea)(?=[\s>])([^>]*)>/g,
        (tag, name, attrs) => /\bdisabled(?:=|\s|$)/.test(attrs) ? tag : `<${name} disabled=""${attrs}>`);
    if (!content.includes('<h1') || content.includes('shush-loading')) throw new Error(`Incomplete prerender: ${route}`);
    const path = new URL(`../dist/${route === '/' ? 'index' : route.slice(1)}.html`, import.meta.url);
    let html = await readFile(path, 'utf8');
    const start = html.indexOf('<div id="root">');
    const end = html.indexOf('<noscript>', start);
    if (start < 0 || end < 0) throw new Error('Missing static root markers');
    html = html.slice(0, start) + `<div id="root">${content}</div>\n    ` + html.slice(end);
    html = html.replace('Ativa o JavaScript para explorar a equipa, os jogos e personalizar a camisola SHUSH.', 'Podes consultar as páginas e os canais. Ativa o JavaScript para selecionar jogadores e personalizar a camisola.');
    await writeFile(path, html);
    console.log(`Prerendered ${route}`);
  }
} finally { await vite.close(); }
