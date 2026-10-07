import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));

const budgets = {
  jsGzip: 100 * 1024,
  cssGzip: 16 * 1024,
};

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(distDir).filter((path) => /\.(?:js|css)$/.test(path));

const totals = files.reduce(
  (acc, path) => {
    const type = path.endsWith('.js') ? 'js' : 'css';
    const raw = readFileSync(path);
    acc[type].raw += statSync(path).size;
    acc[type].gzip += gzipSync(raw).length;
    return acc;
  },
  {
    js: { raw: 0, gzip: 0 },
    css: { raw: 0, gzip: 0 },
  },
);

const kb = (bytes) => (bytes / 1024).toFixed(2);

console.log('Build budget');
console.log(`JS:  ${kb(totals.js.raw)} kB raw / ${kb(totals.js.gzip)} kB gzip`);
console.log(`CSS: ${kb(totals.css.raw)} kB raw / ${kb(totals.css.gzip)} kB gzip`);

const failures = [];

if (totals.js.gzip > budgets.jsGzip) {
  failures.push(`JS gzip budget exceeded: ${kb(totals.js.gzip)} kB > ${kb(budgets.jsGzip)} kB`);
}

if (totals.css.gzip > budgets.cssGzip) {
  failures.push(`CSS gzip budget exceeded: ${kb(totals.css.gzip)} kB > ${kb(budgets.cssGzip)} kB`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('PASS: bundle stays within the SHUSH production budget.');
