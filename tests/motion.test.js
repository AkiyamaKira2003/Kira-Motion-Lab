import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateTilt, clampFinite, bindTilt } from '../docs/motion.js';

const rect = { left: 10, top: 20, width: 200, height: 100 };

test('centers monogram and tilt transforms at pointer midpoint', () => {
  assert.deepEqual(calculateTilt(110, 70, rect), { rotateX: 0, rotateY: 0 });
});

test('tilt is clamped at the edges and never exceeds configured degrees', () => {
  assert.deepEqual(calculateTilt(10, 20, rect, 9), { rotateX: 9, rotateY: -9 });
  assert.deepEqual(calculateTilt(210, 120, rect, 9), { rotateX: -9, rotateY: 9 });
  assert.deepEqual(calculateTilt(-10000, 40000, rect, 9), { rotateX: -9, rotateY: -9 });
});

test('degenerate rectangles and invalid input cannot produce NaN transforms', () => {
  assert.deepEqual(calculateTilt(1, 1, { left: 0, top: 0, width: 0, height: 50 }), { rotateX: 0, rotateY: 0 });
  assert.equal(clampFinite(Number.NaN, 0, 10), 5);
  assert.deepEqual(calculateTilt(0, 0, rect, Infinity), { rotateX: 0, rotateY: 0 });
});

test('pointer handler batches updates into frames and cleans up listeners', () => {
  const listeners = new Map();
  const styles = new Map();
  const scheduled = [];
  const cancelled = [];
  const element = {
    style: { setProperty: (name, value) => styles.set(name, value) },
    getBoundingClientRect: () => rect,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => {
      if (listeners.get(name) === fn) listeners.delete(name);
    }
  };
  const controller = bindTilt(element, {
    maxDegrees: 10,
    requestFrame: (callback) => { scheduled.push(callback); return scheduled.length; },
    cancelFrame: (id) => cancelled.push(id)
  });
  listeners.get('pointermove')({ pointerType: 'mouse', clientX: 210, clientY: 120 });
  listeners.get('pointermove')({ pointerType: 'mouse', clientX: 110, clientY: 70 });
  assert.equal(scheduled.length, 1, 'Moves are batched into one scheduled frame');
  scheduled[0]();
  assert.equal(styles.get('--rotate-x'), '0.00deg');
  assert.equal(styles.get('--rotate-y'), '0.00deg');
  listeners.get('pointermove')({ pointerType: 'touch', clientX: 210, clientY: 120 });
  assert.equal(scheduled.length, 1, 'Touch input is ignored');
  listeners.get('pointerleave')();
  assert.equal(styles.get('--rotate-x'), '0deg');
  controller.destroy();
  controller.destroy();
  assert.equal(listeners.size, 0);
  assert.ok(Array.isArray(cancelled));
});

test('motion-disabled mode prevents pointer updates', () => {
  const listeners = new Map();
  const styles = new Map();
  const element = {
    style: { setProperty: (key, value) => styles.set(key, value) },
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name)
  };
  const controller = bindTilt(element, { enabled: () => false });
  listeners.get('pointermove')({ pointerType: 'mouse', clientX: 100, clientY: 100 });
  assert.equal(styles.get('--rotate-x'), '0deg');
  controller.destroy();
});

test('standalone site includes accessibility controls and reduced-motion fallbacks', () => {
  const html = readFileSync(new URL('../docs/index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../docs/styles.css', import.meta.url), 'utf8');
  assert.match(html, /id="motion-toggle"/);
  assert.match(html, /id="theme-toggle"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /prefers-reduced-motion|data-motion="auto"/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /transform: rotateX/);
  assert.match(css, /@keyframes orbit/);
  assert.doesNotMatch(html, /https:\/\/(fonts\.googleapis|cdn\.jsdelivr)/);
});
