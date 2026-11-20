import { patterns, categories, filterPatterns } from './catalog.js';
import { sources, sourceForPattern, formatStars, popularityDate } from './sources.js';
import { mountPattern } from './patterns.js';
import { sortPatterns } from './sorting.js';

const root = document.getElementById('atlas-grid');
const count = document.getElementById('atlas-count');
const search = document.getElementById('atlas-search');
const categoriesRoot = document.getElementById('atlas-categories');
const sort = document.getElementById('atlas-sort');
const speed = document.getElementById('atlas-speed');
const speedLabel = document.getElementById('atlas-speed-value');
const references = document.getElementById('source-list');
const announcement = document.getElementById('announcement');

let category = 'All';
let observer = null;
let cleanups = [];
let renderFrame = null;
const reduced = () => document.documentElement.dataset.motion === 'reduced' ||
  (document.documentElement.dataset.motion === 'auto' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

function makeElement(tag, className, label = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (label) element.textContent = label;
  return element;
}

function makeCard(pattern, i) {
  const source = sourceForPattern(pattern.id);
  const card = makeElement('article', 'atlas-card');
  card.dataset.pattern = pattern.id;
  card.dataset.category = pattern.category;
  const head = makeElement('div', 'atlas-card-head');
  head.append(makeElement('span', 'atlas-number', String(i + 1).padStart(2, '0') + ' / MOTION'));
  head.append(makeElement('span', 'atlas-engine', pattern.engine));

  const stage = makeElement('div', 'atlas-stage');
  stage.innerHTML = pattern.preview; // These static templates are owned by the project, never user input.
  const details = makeElement('div', 'atlas-body');
  const title = makeElement('h3', '', pattern.title);
  const description = makeElement('p', '', pattern.description);
  details.append(title, description);

  const footer = makeElement('div', 'atlas-card-footer');
  const sourceLink = makeElement('a', 'atlas-source', source.name + ' · ★ ' + formatStars(source.stars));
  sourceLink.href = source.url;
  sourceLink.rel = 'noopener noreferrer';
  sourceLink.target = '_blank';
  sourceLink.title = 'Reference library popularity, not likes for this animation';
  const recipe = makeElement('details', 'atlas-recipe');
  const summary = makeElement('summary', '', 'View recipe');
  const pre = makeElement('pre');
  const code = makeElement('code');
  code.textContent = pattern.code;
  pre.append(code);
  const copy = makeElement('button', 'atlas-copy', 'Copy recipe');
  copy.type = 'button';
  copy.dataset.copyRecipe = pattern.id;
  recipe.append(summary, pre, copy);
  footer.append(sourceLink, recipe);
  card.append(head, stage, details, footer);
  return card;
}

function dispose() {
  observer?.disconnect();
  observer = null;
  for (const cleanup of cleanups) cleanup();
  cleanups = [];
}
function applyPlaybackRate(container = root) {
  const multiplier = Number(speed.value);
  if (!Number.isFinite(multiplier) || multiplier < .4 || multiplier > 2) return;
  for (const animation of container.getAnimations?.({ subtree: true }) || []) {
    if (!animation.effect) continue;
    if (typeof animation.updatePlaybackRate === 'function') {
      animation.updatePlaybackRate(multiplier);
    } else {
      animation.playbackRate = multiplier;
    }
  }
}

function render() {
  renderFrame = null;
  dispose();
  const visible = sortPatterns(filterPatterns(patterns, category, search.value), sort.value);
  count.textContent = visible.length + ' of ' + patterns.length + ' original demos';
  const fragment = document.createDocumentFragment();
  visible.forEach((pattern, i) => fragment.append(makeCard(pattern, i)));
  root.replaceChildren(fragment);

  if (typeof IntersectionObserver === 'undefined') {
    for (const card of root.querySelectorAll('.atlas-card')) {
      card.classList.add('is-visible');
      cleanups.push(mountPattern(card, card.dataset.pattern, {
        enabled: () => !reduced(),
        speed: () => Number(speed.value)
      }));
      applyPlaybackRate(card);
    }
    return;
  }
  const mounted = new WeakSet();
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
      if (entry.isIntersecting && !mounted.has(entry.target)) {
        mounted.add(entry.target);
        cleanups.push(mountPattern(entry.target, entry.target.dataset.pattern, {
          enabled: () => !reduced(),
          speed: () => Number(speed.value)
        }));
        applyPlaybackRate(entry.target);
      }
    }
  }, { rootMargin: '140px 0px', threshold: 0.04 });
  for (const card of root.querySelectorAll('.atlas-card')) observer.observe(card);
}
function scheduleRender() {
  if (renderFrame !== null) return;
  renderFrame = requestAnimationFrame(render);
}

for (const label of categories) {
  const button = makeElement('button', 'atlas-category', label);
  button.type = 'button';
  button.setAttribute('aria-pressed', String(label === category));
  button.addEventListener('click', () => {
    category = label;
    for (const current of categoriesRoot.children) {
      current.setAttribute('aria-pressed', String(current === button));
    }
    scheduleRender();
  });
  categoriesRoot.append(button);
}
search.addEventListener('input', scheduleRender);
sort.addEventListener('change', scheduleRender);
speed.addEventListener('input', () => {
  speedLabel.textContent = Number(speed.value).toFixed(1) + '×';
  document.documentElement.style.setProperty('--atlas-speed', String(Number(speed.value)));
  applyPlaybackRate();
});

root.addEventListener('click', async (event) => {
  const copy = event.target.closest('[data-copy-recipe]');
  if (!copy) return;
  const pattern = patterns.find((item) => item.id === copy.dataset.copyRecipe);
  if (!pattern) return;
  try {
    await navigator.clipboard.writeText(pattern.code);
    announcement.textContent = 'Copied ' + pattern.title + ' recipe.';
    copy.textContent = 'Copied ✓';
  } catch {
    announcement.textContent = 'Clipboard unavailable. Select the visible recipe text to copy it manually.';
  }
});

const orderedSources = Object.values(sources).sort((a, b) => b.stars - a.stars);
for (const entry of orderedSources) {
  const link = makeElement('a', 'source-tile');
  link.href = 'https://github.com/' + entry.repo;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  const name = makeElement('strong', '', entry.name);
  const repo = makeElement('span', '', entry.repo);
  const popularity = makeElement('b', '', '★ ' + formatStars(entry.stars));
  link.title = 'GitHub stars at ' + popularityDate + ' · License: ' + entry.license;
  link.append(name, repo, popularity);
  references.append(link);
}
document.getElementById('atlas-total').textContent = String(patterns.length + 3);
document.getElementById('atlas-sources-total').textContent = String(orderedSources.length);
document.getElementById('atlas-stars-date').textContent = popularityDate;

render();
