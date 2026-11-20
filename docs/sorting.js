import { sourceForPattern } from './sources.js';

/** Library popularity only: not individual animation view counts. */
export function sortPatterns(items, strategy = 'popular') {
  const selected = [...items];
  if (strategy === 'name') return selected.sort((a, b) => a.title.localeCompare(b.title));
  if (strategy === 'category') return selected.sort((a, b) =>
    a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  return selected.sort((a, b) =>
    sourceForPattern(b.id).stars - sourceForPattern(a.id).stars ||
    a.title.localeCompare(b.title));
}
