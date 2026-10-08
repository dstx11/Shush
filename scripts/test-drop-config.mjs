import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(join(tmpdir(), 'shush-drop-'));
try {
  execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '--ignoreConfig',
    'src/lib/drop-config.ts', '--module', 'commonjs', '--moduleResolution', 'bundler', '--target', 'ES2020',
    '--lib', 'ES2020,DOM', '--skipLibCheck', '--outDir', output], { cwd: root, stdio: 'inherit' });
  const require = createRequire(import.meta.url);
  const drop = require(join(output, 'drop-config.js'));
  const family = '👨‍👩‍👧‍👦';
  assert.equal(drop.graphemes(family).length, 1);
  assert.equal(drop.graphemes('a\u0301').length, 1);
  assert.equal(drop.sanitizeDropText(family.repeat(15), 14), family.repeat(14));
  assert.equal(drop.sanitizeDropText('a\u0301'.repeat(15), 14), 'á'.repeat(14));
  assert.equal(drop.sanitizeDropText('A\uD800B\uDC00C\n\u202E', 14), 'ABC');
  assert.equal(drop.sanitizeDropText('x' + '\u0301'.repeat(300), 14), '');
  const config = { nick: '愛してる彼', number: '07', size: 'XL', phrase: 'Só rounds. ' + family };
  const url = new URL(drop.buildDropUrl(config, 'https://shush.pt'));
  assert.equal(url.pathname, '/products/jersey');
  assert.equal(url.searchParams.get('drop'), '1');
  assert.deepEqual(drop.readDropConfig(url.searchParams), { config, corrected: false, shared: true });
  assert.deepEqual(drop.readDropConfig(new URLSearchParams()).config, drop.defaultDropConfig);
  for (const query of ['drop=2&nick=X', 'drop=1&size=HUGE&number=-2', 'drop=1&nick=a&nick=b', 'drop=1&nick=%00%0A', 'drop=1&number=100', 'drop=1&nick=%EF%BF%BD', 'drop=1&nick=' + 'a'.repeat(9000)]) {
    assert.equal(drop.readDropConfig(new URLSearchParams(query)).corrected, true, query.slice(0, 60));
  }
  assert.equal(drop.readDropConfig(new URLSearchParams('drop=1&number=999&size=huge')).config.number, '01');
  assert.equal(drop.readDropConfig(new URLSearchParams('drop=1&number=999&size=huge')).config.size, 'M');
  assert.ok(drop.dropSummary(config).includes('Nick: 愛してる彼\nNúmero: 07'));
  assert.ok(drop.dropSummary({ ...config, nick: '', number: '', phrase: '' }).includes('Nick: SHUSH\nNúmero: 00'));
  assert.deepEqual(drop.readDropDraft(JSON.stringify({ version: 1, config })), config);
  for (const value of ['{', '{}', '{"version":2}', '{"version":1,"config":null}', '{"version":1,"config":{"nick":1}}']) assert.equal(drop.readDropDraft(value), null);
  assert.equal(drop.readDropDraft(JSON.stringify({ version: 1, config: { ...config, size: 'huge' } })), null);
  console.log('Drop config tests passed: Unicode/graphemes, safe bounds, URL round-trip, invalid values, drafts and summary.');
} finally { await rm(output, { recursive: true, force: true }); }
