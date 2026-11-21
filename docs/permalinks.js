/** Stable, whitelist-only fragments for original Motion Atlas demos. */
const fragmentPrefix = '#motion-';
const slug = /^[a-z][a-z0-9-]*$/;

export function fragmentForMotion(id, catalog) {
  if (typeof id !== 'string' || !slug.test(id) ||
      !Array.isArray(catalog) || !catalog.some((pattern) => pattern.id === id)) {
    return null;
  }
  return fragmentPrefix + id;
}

export function parseMotionFragment(fragment, catalog) {
  if (typeof fragment !== 'string' || !fragment.startsWith(fragmentPrefix)) return null;
  const id = fragment.slice(fragmentPrefix.length);
  return fragmentForMotion(id, catalog) === fragment ? id : null;
}
