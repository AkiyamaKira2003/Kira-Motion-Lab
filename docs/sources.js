/**
 * Source popularity is the repository's GitHub star count as manually verified
 * on 2026-11-20. Stars are not individual animation likes or unique visits.
 * Inspiration/technique reference only: no code imported or copied from libraries.
 */
export const popularityDate = '2026-11-20';
export const sources = Object.freeze({
  anime: { name: 'Anime.js', repo: 'juliangarnier/anime', stars: 74912, license: 'MIT' },
  bits: { name: 'React Bits', repo: 'DavidHDev/react-bits', stars: 52334, license: 'Mixed; check component terms' },
  swiper: { name: 'Swiper', repo: 'nolimits4web/swiper', stars: 41908, license: 'MIT' },
  motion: { name: 'Motion', repo: 'motiondivision/motion', stars: 35373, license: 'MIT' },
  r3f: { name: 'React Three Fiber', repo: 'pmndrs/react-three-fiber', stars: 33840, license: 'MIT' },
  lottie: { name: 'Lottie-web', repo: 'airbnb/lottie-web', stars: 32525, license: 'MIT' },
  gsap: { name: 'GSAP', repo: 'greensock/GSAP', stars: 30961, license: 'See current license' },
  spring: { name: 'React Spring', repo: 'pmndrs/react-spring', stars: 29319, license: 'MIT' },
  magic: { name: 'Magic UI', repo: 'magicuidesign/magicui', stars: 23380, license: 'MIT' },
  lenis: { name: 'Lenis', repo: 'darkroomengineering/lenis', stars: 17376, license: 'MIT' },
  parallax: { name: 'Parallax.js', repo: 'wagerfield/parallax', stars: 16572, license: 'Check repository' },
  autoanimate: { name: 'AutoAnimate', repo: 'formkit/auto-animate', stars: 13976, license: 'MIT' },
  theatre: { name: 'Theatre.js', repo: 'theatre-js/theatre', stars: 13067, license: 'Apache-2.0' },
  primitives: { name: 'Motion Primitives', repo: 'ibelick/motion-primitives', stars: 6987, license: 'MIT' },
  canvas: { name: 'Canvas Sketch', repo: 'mattdesl/canvas-sketch', stars: 5330, license: 'MIT' },
  flip: { name: 'React Flip Toolkit', repo: 'aholachek/react-flip-toolkit', stars: 4183, license: 'MIT' }
});

const sourceByPattern = {
  magnetic: 'motion', ripple: 'magic', spring: 'spring', flip: 'flip',
  parallax: 'parallax', reveal: 'gsap', 'scroll-progress': 'lenis',
  'text-reveal': 'bits', gradient: 'magic', skeleton: 'autoanimate',
  'svg-draw': 'anime', 'view-transition': 'motion', stagger: 'theatre',
  toast: 'autoanimate', accordion: 'autoanimate', marquee: 'magic',
  stepper: 'primitives', comets: 'canvas', spotlight: 'bits',
  shine: 'magic', underline: 'primitives', typewriter: 'bits',
  counter: 'anime', 'marquee-mask': 'bits', ring: 'anime',
  'morph-blob': 'bits', float: 'r3f', carousel: 'swiper',
  tabs: 'motion', drawer: 'motion', confetti: 'lottie',
  'pulse-dot': 'magic', focus: 'primitives', 'shimmer-text': 'bits',
  sweep: 'gsap', switch: 'primitives'
};

export function sourceForPattern(id) {
  const key = sourceByPattern[id] || 'motion';
  const source = sources[key];
  return { ...source, key, url: 'https://github.com/' + source.repo };
}

export function formatStars(stars) {
  if (!Number.isFinite(stars) || stars < 0) return '—';
  return stars >= 1000 ? (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(stars);
}
