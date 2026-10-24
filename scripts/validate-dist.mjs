import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');

const routeFiles = [
  ['esports/valorant/premier.html', 'https://shush.pt/esports/valorant/premier', 'VALORANT Premier: partidas e resultados — SHUSH'],
  ['esports/valorant/roster.html', 'https://shush.pt/esports/valorant/roster', 'Jogadores de VALORANT — SHUSH'],
  ['content.html', 'https://shush.pt/content', 'Creators: More e Th0maz — SHUSH'],
  ['products/jersey.html', 'https://shush.pt/products/jersey', 'Camisola SHUSH Drop 01 — Personalização'],
  ['company.html', 'https://shush.pt/company', 'Sobre a SHUSH — A equipa e a nossa história'],
];

const requiredFiles = [
  'index.html',
  '404.html',
  '_headers',
  '_redirects',
  'robots.txt',
  'sitemap.xml',
  'og-shush.png',
  'assets/brand/favicon.png',
  'assets/brand/shush-logo.webp',
  'assets/jersey/frontjersey.webp',
  'assets/jersey/backjersey.webp',
  ...routeFiles.map(([path]) => path),
];

const failures = [];

for (const path of requiredFiles) {
  try {
    await access(join(dist, path), constants.R_OK);
  } catch {
    failures.push(`Missing dist/${path}`);
  }
}

const index = await readText('index.html');
const notFound = await readText('404.html');
const redirects = await readText('_redirects');
const headers = await readText('_headers');
const robots = await readText('robots.txt');
const sitemap = await readText('sitemap.xml');

expect(index, '<h1', 'prerendered Home heading');
expect(index, 'Quem está no lobby.', 'prerendered Home content');
expect(index, '<html lang="pt-PT">', 'index.html lang');
expect(index, '<meta name="robots" content="index,follow,max-image-preview:large"', 'index.html robots');
expect(index, 'property="og:image" content="https://shush.pt/og-shush.png"', 'absolute OG image');
expect(index, 'property="og:image:alt" content="SHUSH — Equipa de VALORANT e esports"', 'root OG image alt');
expect(index, 'rel="canonical" href="https://shush.pt"', 'root canonical URL');
// Home chooses three portraits per document. A fixed preload would fetch the
// wrong player on most visits; the selected central image has fetchPriority=high.
if (/rel="preload" as="image" href="\/assets\/avatars\//.test(index)) failures.push('Home must not preload a fixed roster member');

expect(notFound, '<meta name="robots" content="noindex,nofollow"', '404 noindex');
expect(notFound, '<title>404 — SHUSH</title>', '404 title');

for (const [path, canonical, title] of routeFiles) {
  const html = await readText(path);
  expect(html, '<h1', `${path} prerendered heading`);
  expectAbsent(html, 'shush-loading', `${path} unfinished loading shell`);
  expect(html, `<title>${title}</title>`, `${path} title`);
  expect(html, `rel="canonical" href="${canonical}"`, `${path} canonical`);
  expect(html, `property="og:url" content="${canonical}"`, `${path} OG URL`);
  expect(html, `property="og:image:alt" content="${title}"`, `${path} OG image alt`);
  expect(html, `name="twitter:title" content="${title}"`, `${path} Twitter title`);
  expect(html, `name="twitter:image:alt" content="${title}"`, `${path} Twitter image alt`);
  expect(html, '<meta name="robots" content="index,follow,max-image-preview:large"', `${path} robots`);

  // Verify the emitted document's actual entry points, not only public source references.
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
    try {
      await access(join(dist, match[1].slice(1)), constants.R_OK);
    } catch {
      failures.push(`Broken built asset ${match[1]} in ${path}`);
    }
  }
}

for (const route of [
  '/esports /esports/valorant/premier 301',
  '/products /products/jersey 301',
  '/company/partners /company#partners 301',
]) {
  expect(redirects, route, `canonical redirect ${route.split(' ')[0]}`);
}

expectAbsent(redirects, '/index.html 200', 'root SPA rewrite that would bypass route metadata');

expect(headers, 'Content-Security-Policy:', 'CSP header');
expect(headers, "frame-ancestors 'none'", 'CSP frame protection');
for (const policy of [
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy:',
  'Cross-Origin-Opener-Policy: same-origin',
]) expect(headers, policy, policy);
expect(robots, 'Sitemap: https://shush.pt/sitemap.xml', 'robots sitemap');


for (const url of [
  'https://shush.pt/',
  'https://shush.pt/esports/valorant/premier',
  'https://shush.pt/esports/valorant/roster',
  'https://shush.pt/content',
  'https://shush.pt/products/jersey',
  'https://shush.pt/company',
]) {
  expect(sitemap, `<loc>${url}</loc>`, `sitemap route ${url}`);
}

// Audit the built HTML, so crawler metadata cannot silently diverge from React.
const seenTitles = new Set();
const seenDescriptions = new Set();
for (const file of ['index.html', ...routeFiles.map(([path]) => path)]) {
  const html = await readText(file);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (!title || seenTitles.has(title)) failures.push(`${file}: missing/duplicate title`);
  if (!description || seenDescriptions.has(description)) failures.push(`${file}: missing/duplicate description`);
  seenTitles.add(title); seenDescriptions.add(description);
  if ([...html.matchAll(/<h1[\s>]/g)].length !== 1) failures.push(`${file}: expected one H1`);
  const scripts = [...html.matchAll(/<script id="shush-schema" type="application\/ld\+json">(.*?)<\/script>/g)];
  try {
    if (scripts.length !== 1) throw new Error('Expected one schema graph');
    const schema = JSON.parse(scripts[0][1]);
    if (schema['@context'] !== 'https://schema.org') throw new Error('Invalid schema context');
    const graph = schema['@graph'];
    const page = graph.find(item => ['WebPage', 'AboutPage'].includes(item['@type']));
    if (page?.url !== canonical || page?.name !== title || page?.description !== description)
      throw new Error('Schema page and metadata disagree');
    if (!graph.some(item => item['@type'] === 'SportsTeam' && item.name === 'SHUSH')) throw new Error('Missing team');
    if (!graph.some(item => item['@type'] === 'WebSite' && item.name === 'SHUSH')) throw new Error('Missing site name');
    if (file !== 'index.html') {
      const trail = graph.find(item => item['@type'] === 'BreadcrumbList');
      if (trail?.itemListElement?.[1]?.item !== canonical) throw new Error('Invalid breadcrumb');
    }
  } catch (error) { failures.push(`${file}: ${error.message}`); }
}
if ([...sitemap.matchAll(/<loc>/g)].length !== routeFiles.length + 1) failures.push('Sitemap contains unexpected URLs');

if (failures.length) {
  console.error('Distribution validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Distribution validation passed (${requiredFiles.length} required files + route metadata + redirects + security checks).`,
);

async function readText(path) {
  try {
    return await readFile(join(dist, path), 'utf8');
  } catch {
    return '';
  }
}

function expect(content, needle, label) {
  if (!content.includes(needle)) failures.push(`Missing ${label}`);
}

function expectAbsent(content, needle, label) {
  if (content.includes(needle)) failures.push(`Unexpected ${label}`);
}

