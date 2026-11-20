import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { patterns, categories, filterPatterns } from '../docs/catalog.js';
import { sources, sourceForPattern, popularityDate, formatStars } from '../docs/sources.js';
import { sortPatterns } from '../docs/sorting.js';
import { clamp01, particleBudget, scrollRatio, mountPattern } from '../docs/patterns.js';

test('Atlas contains exactly 36 independently authored complete effect recipes', () => {
  assert.equal(patterns.length, 36);
  assert.equal(new Set(patterns.map((p) => p.id)).size, patterns.length);
  for (const p of patterns) {
    assert.ok(p.title && p.category && p.engine && p.description && p.preview && p.code, p.id);
    assert.ok(p.code.length >= 30, 'Short recipe for ' + p.id);
    assert.ok(categories.includes(p.category), 'Missing category for ' + p.id);
    assert.doesNotMatch(p.preview, /<script|onerror=|onload=|<iframe/i);
  }
});

test('Search supports case-insensitive titles, descriptions and engine names', () => {
  assert.ok(filterPatterns(patterns, 'All', 'ripple').some((p) => p.id === 'ripple'));
  assert.ok(filterPatterns(patterns, 'All', 'WEB ANIMATIONS').length > 0);
  assert.deepEqual(filterPatterns(patterns, 'Canvas', 'particle').map((p) => p.id), ['comets']);
  assert.equal(filterPatterns(patterns, 'SVG').length, 2);
  assert.equal(filterPatterns(patterns, 'All', 'not-a-real-motion-library').length, 0);
});

test('Category filters preserve records and do not modify the input array', () => {
  const copy = [...patterns];
  const selected = filterPatterns(patterns, 'Interaction');
  assert.ok(selected.length >= 5);
  assert.ok(selected.every((p) => p.category === 'Interaction'));
  assert.deepEqual(patterns, copy);
});

test('Popular sorting uses REFERRING library stars, never invented likes', () => {
  const sorted = sortPatterns(patterns, 'popular');
  assert.equal(sorted.length, patterns.length);
  for (let i = 1; i < sorted.length; i++) {
    assert.ok(sourceForPattern(sorted[i - 1].id).stars >= sourceForPattern(sorted[i].id).stars);
  }
  assert.equal(sortPatterns(patterns, 'name')[0].title,
    [...patterns].sort((a, b) => a.title.localeCompare(b.title))[0].title);
  assert.equal(sortPatterns(patterns, 'category')[0].category,
    [...categories.slice(1)].sort()[0]);
});

test('All effects cite an existing source repository with known license metadata', () => {
  assert.equal(Object.keys(sources).length, 16);
  for (const p of patterns) {
    const source = sourceForPattern(p.id);
    assert.ok(source.url.startsWith('https://github.com/'));
    assert.ok(source.name && source.license);
    assert.ok(source.stars > 100);
  }
  assert.equal(popularityDate, '2026-11-20');
  assert.equal(formatStars(74912), '74.9k');
  assert.equal(formatStars(NaN), '—');
});

test('Scroll ratio is always finite and within 0..1', () => {
  assert.equal(scrollRatio(50, 200, 100), .5);
  assert.equal(scrollRatio(-50, 200, 100), 0);
  assert.equal(scrollRatio(200, 200, 100), 1);
  assert.equal(scrollRatio(0, 100, 200), 0);
  assert.equal(scrollRatio(Infinity, 200, 100), .5);
  assert.equal(clamp01(-100), 0);
  assert.equal(clamp01(100), 1);
});

test('Canvas budget is capped and handles invalid dimensions', () => {
  assert.equal(particleBudget(0, 100), 0);
  assert.equal(particleBudget(Infinity, 100), 0);
  assert.equal(particleBudget(10, 10), 6);
  assert.equal(particleBudget(10000, 10000), 26);
});

test('A mount always exposes an idempotent disposal function', () => {
  assert.throws(() => mountPattern(null, 'accordion'), TypeError);
  const fake = { querySelector() { return null; } };
  const dispose = mountPattern(fake, 'accordion');
  assert.equal(typeof dispose, 'function');
  dispose();
  dispose();
});

test('Static site has accessible search, sorting, source attribution, and reduced-motion controls', () => {
  const html = readFileSync(new URL('../docs/index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../docs/atlas.css', import.meta.url), 'utf8');
  const atlas = readFileSync(new URL('../docs/atlas.js', import.meta.url), 'utf8');
  assert.match(html, /id="atlas-search"/);
  assert.match(html, /id="atlas-sort"/);
  assert.match(html, /id="atlas-categories"/);
  assert.match(html, /id="atlas-grid"/);
  assert.match(html, /id="source-list"/);
  assert.match(atlas, /textContent = pattern.code/);
  assert.match(atlas, /IntersectionObserver/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /atlas-card:not\(\.is-visible\)/);
  assert.match(css, /max-width:590px/);
});
