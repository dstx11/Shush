import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';

// Render the real React routes at build time. No server is deployed or listened on.
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { staticPage } = await vite.ssrLoadModule('/src/prerender.tsx');
  const { routeMetadata } = await vite.ssrLoadModule('/src/data/meta.ts');
  const { pageSchema } = await vite.ssrLoadModule('/src/data/seo.ts');
  const siteUrl = 'https://shush.pt';
  const identity = [
    { '@type': 'SportsTeam', '@id': `${siteUrl}/#organization`, name: 'SHUSH',
      url: siteUrl, sport: 'VALORANT', description: routeMetadata['/'].description,
      logo: `${siteUrl}/assets/brand/shush-logo.webp` },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: 'SHUSH',
      inLanguage: 'pt-PT', publisher: { '@id': `${siteUrl}/#organization` } },
  ];
  // Generate the sitemap from actual published routes; never invent lastmod dates.
  await writeFile(new URL('../dist/sitemap.xml', import.meta.url),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    Object.keys(routeMetadata).map(route => `  <url><loc>${siteUrl}${route}</loc></url>`).join('\n') + '\n</urlset>\n');
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
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': [...identity, ...pageSchema(route)] }).replace(/</g, '\\u003c');
    html = html.replace('</head>', `<script id="shush-schema" type="application/ld+json">${json}</script>\n</head>`);
    await writeFile(path, html);
    console.log(`Prerendered ${route}`);
  }
} finally { await vite.close(); }
