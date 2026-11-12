import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/tree-visit.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
function load(window) { const exports = {}; runInNewContext(outputText, { exports, Math, ...(window ? { window } : {}) }); return exports; }
const api = load();
for (const previous of ['christmas', 'ice', 'shush']) {
  const chosen = new Set();
  for (const random of [0, .49, .5, .99, 1, -1, NaN, Infinity]) {
    const variant = api.chooseTreeVariant(previous, random);
    assert.notEqual(variant, previous);
    assert.ok(['christmas', 'ice', 'shush'].includes(variant));
    chosen.add(variant);
  }
  assert.equal(chosen.size, 2);
}
assert.equal(api.getTreeVisit().variant, 'christmas', 'SSR uses a stable fallback');
const memory = new Map();
const storage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
const client = load({ localStorage: storage, sessionStorage: storage });
const first = client.getTreeVisit();
assert.equal(client.getTreeVisit(), first, 'StrictMode and SPA keep one document selection');
const next = load({ localStorage: storage, sessionStorage: storage }).getTreeVisit();
assert.notEqual(next.variant, first.variant, 'fresh document avoids last selection');
const blocked = load(Object.defineProperties({}, { localStorage: { get() { throw Error('blocked'); } }, sessionStorage: { get() { throw Error('blocked'); } } }));
assert.ok(['christmas', 'ice', 'shush'].includes(blocked.getTreeVisit().variant));
assert.equal(blocked.getTreeVisit(), blocked.getTreeVisit());
console.log('Tree visit passed: all variants, invalid values, no consecutive repeat, SSR, SPA and blocked storage.');
