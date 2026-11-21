import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { patterns } from '../docs/catalog.js';
import { fragmentForMotion, parseMotionFragment } from '../docs/permalinks.js';

test('every atlas motion has one stable, safe and reversible fragment', () => {
  const fragments = new Set();
  for (const pattern of patterns) {
    const fragment = fragmentForMotion(pattern.id, patterns);
    assert.match(fragment, /^#motion-[a-z0-9-]+$/);
    assert.equal(parseMotionFragment(fragment, patterns), pattern.id);
    fragments.add(fragment);
  }
  assert.equal(fragments.size, patterns.length);
  assert.equal(fragmentForMotion('ripple', patterns), '#motion-ripple');
});

test('unknown fragments, other page anchors and malformed input fail closed', () => {
  const bad = [null, undefined, 42, {}, '', '#atlas', '#sources', '#top',
    '#motion-', '#motion-unknown', '#motion-__proto__', '#motion-toString',
    '#motion-ripple?utm=1', '#motion-ripple/../', '#motion-%72ipple',
    '#motion-RIPPLE', '#motion-<script>', 'https://example.com/#motion-ripple'];
  for (const value of bad) {
    assert.equal(parseMotionFragment(value, patterns), null, String(value));
  }
  assert.equal(fragmentForMotion('not-in-catalog', patterns), null);
  assert.equal(fragmentForMotion('__proto__', patterns), null);
  assert.equal(fragmentForMotion(null, patterns), null);
});

test('fragments remain stable across filtering and sorting', () => {
  const selected = [...patterns].reverse();
  const fromAll = fragmentForMotion('ripple', patterns);
  const fromReorder = fragmentForMotion('ripple', selected);
  assert.equal(fromAll, fromReorder);
  assert.equal(parseMotionFragment(fromAll, selected), 'ripple');
});

test('atlas card has a semantic permalink and follows dynamic fragments', () => {
  const source = readFileSync(new URL('../docs/atlas.js', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('../docs/atlas.css', import.meta.url), 'utf8');
  assert.match(source, /fragmentForMotion/);
  assert.match(source, /parseMotionFragment/);
  assert.match(source, /hashchange/);
  assert.match(source, /scrollIntoView/);
  assert.match(source, /atlas-permalink/);
  assert.match(source, /card\.id\s*=\s*['"]motion-['"]\s*\+/);
  assert.match(styles, /\.atlas-card:target/);
});
