import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');

const routeFiles = [
  ['esports/valorant/premier.html', 'https://shush.pt/esports/valorant/premier', 'Premier — SHUSH'],
  ['esports/valorant/roster.html', 'https://shush.pt/esports/valorant/roster', 'Roster — SHUSH'],
  ['content.html', 'https://shush.pt/content', 'Creators — SHUSH'],
  ['products/jersey.html', 'https://shush.pt/products/jersey', 'Drop 01 — SHUSH'],
  ['company.html', 'https://shush.pt/company', 'About — SHUSH'],
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

expect(index, '<html lang="pt-PT">', 'index.html lang');
expect(index, '<meta name="robots" content="index,follow"', 'index.html robots');
expect(index, 'property="og:image" content="https://shush.pt/og-shush.png"', 'absolute OG image');
expect(index, 'property="og:image:alt" content="SHUSH — Sem barulho. Só rounds."', 'root OG image alt');
expect(index, 'rel="canonical" href="https://shush.pt"', 'root canonical URL');
expect(index, 'rel="preload" as="image" href="/assets/jersey/frontjersey.webp"', 'hero image preload');

expect(notFound, '<meta name="robots" content="noindex,nofollow"', '404 noindex');
expect(notFound, '<title>404 — SHUSH</title>', '404 title');

for (const [path, canonical, title] of routeFiles) {
  const html = await readText(path);
  expect(html, `<title>${title}</title>`, `${path} title`);
  expect(html, `rel="canonical" href="${canonical}"`, `${path} canonical`);
  expect(html, `property="og:url" content="${canonical}"`, `${path} OG URL`);
  expect(html, `property="og:image:alt" content="${title}"`, `${path} OG image alt`);
  expect(html, '<meta name="robots" content="index,follow"', `${path} robots`);
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

