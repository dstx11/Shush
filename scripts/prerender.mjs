import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';

// Render the real React routes at build time. No server is deployed or listened on.
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { staticPage } = await vite.ssrLoadModule('/src/prerender.tsx');
  const { routeMetadata } = await vite.ssrLoadModule('/src/data/meta.ts');
  const { pageSchema, identitySchema } = await vite.ssrLoadModule('/src/data/seo.ts');
  const manifest = JSON.parse(await readFile(new URL('../dist/.vite/manifest.json', import.meta.url), 'utf8'));
  // Exact build filenames avoid overlapping Cache-Control rules and never
  // cache unversioned public images or future hand-authored scripts forever.
  const versioned = new Set(Object.values(manifest).flatMap(entry => [entry.file, ...(entry.css ?? [])])
    .filter(path => path && /-[A-Za-z0-9_-]{8}\.(js|css)$/.test(path)));
  if (versioned.size > 90) throw new Error('Too many asset header rules');
  const headers = await readFile(new URL('../dist/_headers', import.meta.url), 'utf8');
  await writeFile(new URL('../dist/_headers', import.meta.url), headers + '\n' +
    [...versioned].map(path => `/${path}\n  Cache-Control: public, max-age=31536000, immutable\n`).join('\n'));
  const routeEntries = {
    '/': 'HomePage', '/esports/valorant/premier': 'PremierPage',
    '/esports/valorant/roster': 'RosterPage', '/content': 'ContentPage',
    '/products/jersey': 'DropPage', '/company': 'AboutPage',
  };
  function routeStyles(route) {
    const styles = new Set();
    const visited = new Set();
    function collect(key) {
      if (visited.has(key)) return;
      visited.add(key);
      const entry = manifest[key];
      if (!entry) throw new Error(`Missing manifest entry: ${key}`);
      for (const dependency of entry.imports ?? []) collect(dependency);
      for (const css of entry.css ?? []) styles.add(css);
    }
    collect(`src/pages/${routeEntries[route]}.tsx`);
    return styles;
  }
  const siteUrl = 'https://shush.pt';
  const identity = identitySchema();
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
    {
      const links = [...routeStyles(route)].filter(css => !html.includes(`href="/${css}"`))
        .map(css => `<link rel="stylesheet" crossorigin href="/${css}" />`).join('\n');
      html = html.replace('</head>', `${links}\n</head>`);
    }
    html = html.replace('</head>', `<script id="shush-schema" type="application/ld+json">${json}</script>\n</head>`);
    await writeFile(path, html);
    console.log(`Prerendered ${route}`);
  }
} finally { await vite.close(); }
