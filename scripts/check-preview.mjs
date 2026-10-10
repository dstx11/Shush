import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

// Cloudflare documents lowercase branch aliases with non-alphanumerics
// replaced by hyphens. A URL argument also supports immutable deploy audits.
const branch = process.env.SHUSH_PREVIEW_BRANCH;
const base = process.argv[2] ?? (branch ? `https://${branch.toLowerCase().replace(/[^a-z0-9]/g, '-')}.shush-4n1.pages.dev` : undefined);
if (!base || new URL(base).protocol !== 'https:') throw new Error('Pass an HTTPS preview URL or SHUSH_PREVIEW_BRANCH.');
const routes = ['/', '/esports/valorant/premier', '/esports/valorant/roster', '/content', '/products/jersey', '/company'];
const localIndex = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const entry = localIndex.match(/<script[^>]+src="([^"]+)"/)?.[1];
assert.ok(entry, 'production entry script must exist');

async function get(path) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(10_000), redirect: 'manual', cache: 'no-store' });
}

// Wait for this build, not just a successful response from an older deploy.
let ready = false;
for (let attempt = 0; attempt < 20; attempt++) {
  try {
    const response = await get('/');
    const html = await response.text();
    if (response.status === 200 && html.includes(`src="${entry}"`)) { ready = true; break; }
    assert.ok(![401, 403, 429].includes(response.status), `Preview access refused: ${response.status}`);
  } catch (error) {
    if (error instanceof assert.AssertionError) throw error;
    if (attempt === 19) throw error;
  }
  console.log('Waiting for the current Cloudflare build...');
  await setTimeout(10_000);
}
assert.ok(ready, 'Cloudflare did not publish the current build within the bounded wait.');

function checkSecurity(response) {
  assert.match(response.headers.get('content-security-policy') ?? '', /frame-ancestors 'none'/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('cross-origin-opener-policy'), 'same-origin');
  assert.match(response.headers.get('permissions-policy') ?? '', /camera=\(\)/);
}

for (const path of routes) {
  const local = await readFile(new URL(`../dist/${path === '/' ? 'index' : path.slice(1)}.html`, import.meta.url), 'utf8');
  const response = await get(path);
  assert.equal(response.status, 200, path);
  checkSecurity(response);
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
  const html = await response.text();
  for (const pattern of [/<title>.*?<\/title>/, /<link rel="canonical"[^>]+>/, /<meta property="og:title"[^>]+>/, /<meta property="og:image"[^>]+>/, /<meta name="twitter:title"[^>]+>/]) {
    const expected = local.match(pattern)?.[0];
    assert.ok(expected && html.includes(expected), `${path}: static metadata differs from this build`);
  }
  console.log(`PASS ${path}: 200, route metadata, security and preview noindex`);
}

const missing = await get('/shush-audit-unknown-route');
assert.equal(missing.status, 404, 'unknown direct URLs must return a real 404');
assert.match(await missing.text(), /noindex/);
checkSecurity(missing);
const redirect = await get('/products');
assert.equal(redirect.status, 301);
assert.equal(new URL(redirect.headers.get('location'), base).pathname, '/products/jersey');
const asset = await get(entry);
assert.equal(asset.status, 200, 'current production entry asset must be available');
console.log('PASS real 404, canonical redirect and current entry asset.');
