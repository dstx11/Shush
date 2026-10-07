import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { extname, join } from 'node:path';

const projectRoot = new URL('../', import.meta.url).pathname;
const publicRoot = join(projectRoot, 'public');
const sourceFiles = [
  join(projectRoot, 'index.html'),
  ...(await walk(join(projectRoot, 'src'))).filter((path) =>
    ['.ts', '.tsx', '.css', '.html'].includes(extname(path)),
  ),
];

const references = new Map();

for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');

  for (const match of source.matchAll(/\/assets\/[A-Za-z0-9_./-]+/g)) {
    const asset = match[0];
    const files = references.get(asset) ?? [];
    files.push(file.replace(projectRoot, ''));
    references.set(asset, files);
  }
}

const failures = [];

for (const [asset, files] of references) {
  try {
    await access(join(publicRoot, asset.slice(1)), constants.R_OK);
  } catch {
    failures.push(`${asset} referenced by ${files.join(', ')}`);
  }
}

if (failures.length) {
  console.error('Broken public asset references:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Asset integrity passed (${references.size} referenced public assets found).`);

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
