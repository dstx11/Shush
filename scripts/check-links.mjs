import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const canonicalRoutes = new Set([
  '/',
  '/esports/valorant/premier',
  '/esports/valorant/roster',
  '/content',
  '/products/jersey',
  '/company',
]);

const files = (await walk(join(root, 'src'))).filter((path) =>
  ['.ts', '.tsx'].includes(extname(path)),
);

const invalid = [];

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const patterns = [
    /href\s*=\s*["']([^"']+)["']/g,
    /href\s*:\s*["']([^"']+)["']/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const href = match[1];
      if (!href.startsWith('/') || href.startsWith('/assets/')) continue;

      const pathname = href.split(/[?#]/, 1)[0] || '/';
      if (!canonicalRoutes.has(pathname)) {
        invalid.push(`${href} in ${file.replace(root, '')}`);
      }
    }
  }
}

if (invalid.length) {
  console.error('Unexpected internal links:');
  for (const item of [...new Set(invalid)]) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Internal link integrity passed.');
  
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const output = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await walk(path)));
    else output.push(path);
  }

  return output;
}
