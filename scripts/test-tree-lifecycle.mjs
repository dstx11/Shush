import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Exercise the real component effect with controlled browser scheduling. Canvas
// drawing is stubbed here; visual output remains the browser suite's concern.
const require = createRequire(import.meta.url);
const source = readFileSync(process.argv[2] ?? new URL('../src/components/home/ChristmasTree.tsx', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX,
} });

function mount({ reduced = false, paused = false } = {}) {
  let effect, cleanup, intersection, resize, motion, visibility, refIndex = 0, stateIndex = 0;
  let draws = 0, next = 0;
  const frames = new Map();
  const gradient = { addColorStop() {} };
  const ctx = new Proxy({}, { get: (_, key) => {
    if (key === 'clearRect') return () => draws++;
    if (String(key).startsWith('create')) return () => gradient;
    return () => {};
  } });
  const canvas = { getContext: () => ctx };
  const frame = { getBoundingClientRect: () => ({ width: 550, height: 635 }) };
  const media = { matches: reduced, addEventListener: (_, fn) => { motion = fn; }, removeEventListener: () => { motion = undefined; } };
  const document = { hidden: false, addEventListener: (_, fn) => { visibility = fn; }, removeEventListener: () => { visibility = undefined; } };
  const exports = {};
  runInNewContext(outputText, {
    exports, Math, document, window: { matchMedia: () => media, devicePixelRatio: 1 },
    requestAnimationFrame: fn => { frames.set(++next, fn); return next; },
    cancelAnimationFrame: id => frames.delete(id),
    ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} disconnect() { resize = undefined; } },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() { intersection = undefined; } },
    require: name => name === 'react' ? {
      useRef: value => ({ current: refIndex++ === 0 ? canvas : refIndex === 2 ? frame : value }),
      useState: value => [stateIndex++ === 1 ? paused : value, () => {}],
      useEffect: fn => { effect = fn; },
    } : require(name),
  });
  const tree = exports.ChristmasTree();
  cleanup = effect();
  return {
    frames, get draws() { return draws; },
    visible: (value, ratio = value ? 1 : 0) => intersection([{ isIntersecting: value, intersectionRatio: ratio }]),
    reduced: value => motion({ matches: value }),
    hidden: value => { document.hidden = value; visibility(); },
    tick: time => { const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn(time)); },
    rotate: () => tree.props.children.find(child => child?.type === 'canvas').props.onKeyDown({ key: 'ArrowRight', preventDefault() {} }),
    cleanup: () => { cleanup(); assert.equal(intersection, undefined); assert.equal(resize, undefined); assert.equal(motion, undefined); assert.equal(visibility, undefined); },
  };
}

const active = mount();
assert.equal(active.frames.size, 0, 'wait for visibility before scheduling');
active.visible(true);
assert.equal(active.frames.size, 1);
active.tick(40);
assert.equal(active.frames.size, 1, 'only one loop');
for (const state of ['hidden', 'reduced']) {
  active[state](true);
  assert.equal(active.frames.size, 0, `${state}: cancel pending frame`);
  active[state](false);
  assert.equal(active.frames.size, 1, `${state}: resume one loop`);
}
active.visible(false);
assert.equal(active.frames.size, 0, 'offscreen: stop');
active.visible(true, .01);
assert.equal(active.frames.size, 0, 'less than threshold: stay idle');
active.visible(true);
active.cleanup();
assert.equal(active.frames.size, 0, 'unmount: cancel');

for (const settings of [{ reduced: true }, { paused: true }]) {
  const idle = mount(settings);
  idle.visible(true);
  assert.equal(idle.frames.size, 0, 'static mode never schedules frames');
  const before = idle.draws;
  idle.rotate();
  assert.equal(idle.draws, before + 1, 'manual rotation still redraws in static mode');
  assert.equal(idle.frames.size, 0);
  idle.cleanup();
}
console.log('Tree lifecycle passed: visibility, pause, reduced motion, resume, manual redraw and cleanup.');
