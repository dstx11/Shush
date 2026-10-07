import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const dist = join(root.pathname, 'dist');

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
expect(index, 'rel="canonical" href="https://shush.pt"', 'canonical URL');
expect(index, 'rel="preload" as="image" href="/assets/jersey/frontjersey.webp"', 'hero image preload');

expect(notFound, '<meta name="robots" content="noindex,nofollow"', '404 noindex');
expect(notFound, '<title>404 — SHUSH</title>', '404 title');

for (const route of [
  '/esports/valorant/premier /index.html 200',
  '/esports/valorant/roster /index.html 200',
  '/content /index.html 200',
  '/products/jersey /index.html 200',
  '/company /index.html 200',
]) {
  expect(redirects, route, `SPA route ${route.split(' ')[0]}`);
}

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

console.log(`Distribution validation passed (${requiredFiles.length} required files + metadata/routes/security checks).`);

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
