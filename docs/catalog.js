/**
 * Curated, ORIGINAL micro-interaction examples.
 * Inspired by published patterns in Motion, GSAP, Anime.js and platform docs.
 * No source code, assets or animations are copied from those projects.
 * Every example can be inspected in this repository and runs without a package.
 */
export const patterns = Object.freeze([
  {
    id: 'magnetic', title: 'Magnetic attraction', category: 'Interaction', engine: 'Pointer + RAF',
    description: 'A button follows the pointer within a bounded radius, then returns to center.',
    preview: '<button class="demo-magnetic" type="button">Explore <span aria-hidden="true">↗</span></button>',
    code: "import { mountPattern } from './patterns.js';\n// Pointer coordinates are clamped, RAF-batched, and reset on leave.\nconst cleanup = mountPattern(card, 'magnetic', context);\n// On unmount: cleanup();"
  },
  {
    id: 'ripple', title: 'Click feedback', category: 'Feedback', engine: 'Web Animations',
    description: 'Event-driven radial feedback; no perpetual animation or interval.',
    preview: '<button class="demo-ripple" type="button">Click to ripple<span aria-hidden="true"> ✦</span></button>',
    code: "button.addEventListener('click', event => {\n  const ink = document.createElement('span');\n  ink.className = 'ripple-ink';\n  button.append(ink);\n  const animation = ink.animate([\n    { transform:'translate(-50%, -50%) scale(0)', opacity:.7 },\n    { transform:'translate(-50%, -50%) scale(1)', opacity:0 }\n  ], { duration:520, easing:'ease-out' });\n  animation.finished.finally(() => ink.remove());\n});"
  },
  {
    id: 'spring', title: 'Spring response', category: 'Interaction', engine: 'Web Animations',
    description: 'A tactile press with overshoot, bounded duration, and a static fallback.',
    preview: '<button type="button" class="demo-spring">Press me <span aria-hidden="true">✳</span></button>',
    code: "const animation = button.animate([\n  { transform:'scale(1)' }, { transform:'scale(.89)', offset:.22 },\n  { transform:'scale(1.10)', offset:.58 }, { transform:'scale(1)' }\n], { duration:540, easing:'ease-out' });\n// Use prefers-reduced-motion to skip, and cancel on cleanup."
  },
  {
    id: 'flip', title: 'Accessible card flip', category: 'Interaction', engine: 'CSS 3D',
    description: 'Keyboard-activatable card with readable front and back; no hover-only content.',
    preview: '<button type="button" class="demo-flip" aria-pressed="false" aria-label="Flip the Kira card"><span class="flip-inner"><span class="flip-face flip-front">K<span>FRONT</span></span><span class="flip-face flip-back">✦<span>BACK</span></span></span></button>',
    code: ".flip-inner { transform-style:preserve-3d; transition: transform .55s; }\n.flip-face { backface-visibility:hidden; }\n.flip-back { transform:rotateY(180deg); }\n.is-flipped .flip-inner { transform:rotateY(180deg); }\n// Toggle aria-pressed on click; avoid flipping when motion is reduced."
  },
  {
    id: 'parallax', title: 'Depth parallax', category: 'Interaction', engine: 'Pointer + RAF',
    description: 'Two small layers shift in opposite directions; bounded to avoid visual drift.',
    preview: '<div class="demo-parallax" tabindex="0" aria-label="Two-layer pointer parallax"><span class="parallax-back">◈</span><span class="parallax-front">K</span><span class="parallax-caption">Move your pointer</span></div>',
    code: "const offset = (pointerRatio - .5) * 24; // clamp to ±12px\n// Set CSS custom properties inside one requestAnimationFrame.\n// CSS: transform: translate3d(var(--px),var(--py),0)\n// Respect reduced motion and reset on pointerleave."
  },
  {
    id: 'reveal', title: 'On-view reveal', category: 'Scroll', engine: 'IntersectionObserver',
    description: 'Start only when visible; non-supporting browsers keep content fully visible.',
    preview: '<div class="demo-reveal"><span class="reveal-plate">01</span><span class="reveal-plate">02</span><span class="reveal-plate">03</span></div><button class="demo-secondary" type="button" data-run="reveal">Replay reveal</button>',
    code: "const observer = new IntersectionObserver(entries => {\n  for (const item of entries) if (item.isIntersecting) {\n    item.target.classList.add('shown');\n    observer.unobserve(item.target);\n  }\n}, { threshold: .15 });\n// Never hide essential content before IntersectionObserver is available."
  },
  {
    id: 'scroll-progress', title: 'Scroll-linked progress', category: 'Scroll', engine: 'Passive scroll + RAF',
    description: 'Maps document position to one transform; updates only on scroll and resize.',
    preview: '<div class="demo-progress"><div class="progress-rail" role="progressbar" aria-label="Page scroll progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress-fill"></div></div><strong class="progress-count">0%</strong><span>Scroll this page to update</span></div>',
    code: "const max = document.documentElement.scrollHeight - innerHeight;\nconst progress = max > 0 ? Math.max(0,Math.min(1,scrollY/max)) : 0;\nbar.style.transform = 'scaleX(' + progress + ')';\n// Passive scroll handler queues one frame; update aria-valuenow too."
  },
  {
    id: 'text-reveal', title: 'Editorial text reveal', category: 'Typography', engine: 'CSS stagger',
    description: 'Word-level entry, preserving a single accessible sentence for screen readers.',
    preview: '<div class="demo-type" role="text" aria-label="Design is in the details"><span aria-hidden="true">Design</span><span aria-hidden="true">is in</span><span aria-hidden="true">the details.</span></div><button class="demo-secondary" type="button" data-run="text-reveal">Replay words</button>',
    code: ".word { animation: rise .7s both; animation-delay: calc(var(--index)*100ms); }\n@keyframes rise { from { opacity:0; transform:translateY(16px); }\n  to { opacity:1; transform:translateY(0); } }\n@media (prefers-reduced-motion: reduce) { .word { animation:none; } }"
  },
  {
    id: 'gradient', title: 'Iridescent border', category: 'Ambient', engine: 'CSS transform',
    description: 'A rotating gradient behind a masked card. Idle when outside the viewport.',
    preview: '<div class="demo-gradient"><span>CELESTIAL</span><strong>Gradient ring</strong><small>Composited glow</small></div>',
    code: ".glow::before { content:''; position:absolute; inset:-60%;\n background:conic-gradient(#79d7fa, #c7a9ff, #79d7fa);\n animation: spin 8s linear infinite; }\n.glow::after { content:''; position:absolute; inset:2px; background:var(--surface); }\n@media(prefers-reduced-motion:reduce){.glow::before{animation:none}}"
  },
  {
    id: 'skeleton', title: 'Loading skeleton', category: 'Feedback', engine: 'CSS background',
    description: 'An honest loading placeholder; shimmer stops when content is ready.',
    preview: '<div class="demo-skeleton is-loading"><div class="skeleton-view" aria-hidden="true"><i></i><span><b></b><b></b><b></b></span></div><div class="skeleton-ready" hidden><strong>Content is ready</strong><p>No loading animation needed.</p></div></div><button type="button" class="demo-secondary" data-run="skeleton" aria-pressed="true">Show content</button>',
    code: ".skeleton { background:linear-gradient(100deg,#263b55 20%,#496d8f 45%,#263b55 70%);\n background-size:220% 100%; animation: shimmer 1.8s linear infinite; }\n@keyframes shimmer { to { background-position-x:-220%; } }\n// Stop and hide the skeleton immediately when content is ready."
  },
  {
    id: 'svg-draw', title: 'SVG line drawing', category: 'SVG', engine: 'Web Animations',
    description: 'Trace a lightweight vector path only when requested; no idle drawing loop.',
    preview: '<svg class="demo-svg" viewBox="0 0 250 125" role="img" aria-label="Decorative celestial trajectory"><path class="svg-guide" d="M20 95 Q65 10 125 63 T230 30"/><path class="svg-stroke" d="M20 95 Q65 10 125 63 T230 30"/><circle cx="230" cy="30" r="5" fill="#b0eafa"/></svg><button class="demo-secondary" type="button" data-run="svg-draw">Draw path</button>',
    code: "const length = path.getTotalLength();\npath.style.strokeDasharray = String(length);\npath.animate([{ strokeDashoffset:length }, { strokeDashoffset:0 }], {\n  duration:950, easing:'ease-in-out', fill:'forwards'\n});\n// For reduced motion, set strokeDashoffset to zero immediately."
  },
  {
    id: 'view-transition', title: 'Layout morph', category: 'Layout', engine: 'View Transition API',
    description: 'Native view transitions when supported, instant DOM update otherwise.',
    preview: '<div class="demo-morph"><div class="morph-shape" aria-hidden="true">K</div></div><button class="demo-secondary" type="button" data-run="view-transition" aria-pressed="false">Change shape</button>',
    code: "const update = () => shape.classList.toggle('alternate');\nif (!matchMedia('(prefers-reduced-motion: reduce)').matches && document.startViewTransition) {\n  document.startViewTransition(update);\n} else update();\n// Keep the same UI functional without View Transitions."
  },
  {
    id: 'stagger', title: 'Staggered entrance', category: 'Layout', engine: 'Web Animations',
    description: 'Orchestrate a tiny sequence without a persistent animation engine.',
    preview: '<div class="demo-stagger"><span>01</span><span>02</span><span>03</span><span>04</span></div><button class="demo-secondary" type="button" data-run="stagger">Replay sequence</button>',
    code: "items.forEach((item, index) => item.animate([\n  {opacity:0,transform:'translateY(20px)'}, {opacity:1,transform:'translateY(0)'}\n], {duration:420,delay:index*85,easing:'cubic-bezier(.2,.8,.2,1)'}));\n// One-shot on click; cancel animations when component is destroyed."
  },
  {
    id: 'toast', title: 'Accessible feedback', category: 'Feedback', engine: 'DOM + WAAPI',
    description: 'Status feedback with an explicit dismissal control and no intrusive timer.',
    preview: '<div class="demo-toast-wrap"><button class="demo-secondary" type="button" data-run="toast">Show notification</button><div class="demo-toast" role="status" hidden><span>✓ Saved successfully</span><button type="button" aria-label="Dismiss notification" data-run="dismiss-toast">×</button></div></div>',
    code: "toast.hidden = false;\ntoast.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],\n {duration:260,easing:'ease-out'});\n// Include role=status; provide a user-controlled dismiss button."
  },
  {
    id: 'accordion', title: 'Native accordion', category: 'Layout', engine: 'HTML + CSS',
    description: 'Disclosure without JavaScript or hidden focus traps; optional progressive animation.',
    preview: '<div class="demo-accordion"><details open><summary>Why accessible motion?</summary><p>Content remains usable without animation or JavaScript.</p></details><details><summary>Does it need a library?</summary><p>No. Native details provide state and keyboard support.</p></details></div>',
    code: "<details><summary>Section title</summary><p>Accessible content</p></details>\n/* Enhance with CSS; details/summary work without scripts. */"
  },
  {
    id: 'marquee', title: 'Ambient marquee', category: 'Ambient', engine: 'CSS transform',
    description: 'A low-contrast banner that pauses on hover, focus and reduced motion.',
    preview: '<div class="demo-marquee" tabindex="0" aria-label="Creative, useful, reliable, intentional"><div class="marquee-track"><span>CREATE ✦ REFINE ✦ SHIP ✦ LEARN ✦</span><span aria-hidden="true">CREATE ✦ REFINE ✦ SHIP ✦ LEARN ✦</span></div></div>',
    code: ".track { display:flex; width:max-content; animation:marquee 24s linear infinite; }\n@keyframes marquee { to { transform:translateX(-50%); } }\n.marquee:hover .track,.marquee:focus-within .track { animation-play-state:paused; }\n@media (prefers-reduced-motion: reduce) { .track { animation:none; } }"
  },
  {
    id: 'stepper', title: 'Stateful stepper', category: 'Layout', engine: 'DOM + WAAPI',
    description: 'A transition with real UI state, direction controls and live text updates.',
    preview: '<div class="demo-stepper"><div class="stepper-stage" aria-live="polite"><span class="stepper-number">01</span><strong class="stepper-title">Discover</strong><small class="stepper-detail">Start with the problem.</small></div><div class="stepper-actions"><button type="button" data-run="step-prev" aria-label="Previous step">←</button><span class="stepper-index">1 / 3</span><button type="button" data-run="step-next" aria-label="Next step">→</button></div></div>',
    code: "const steps=['Discover','Design','Deliver'];\nlet index=0;\nnext.addEventListener('click', () => {\n index=(index+1)%steps.length;\n title.textContent=steps[index];\n // Only animate one-shot if reduced motion is disabled.\n});"
  },
  {
    id: 'comets', title: 'Opt-in particle field', category: 'Canvas', engine: 'Canvas 2D · 30 FPS',
    description: 'A capped, visibility-aware Canvas loop that starts only when you press Play.',
    preview: '<div class="demo-comets"><canvas aria-label="Optional animated blue comet field" role="img"></canvas><span class="comet-hint">0 background frames while paused</span></div><button class="demo-secondary" type="button" data-run="comets" aria-pressed="false">Play particles</button>',
    code: "const ctx = canvas.getContext('2d');\n// Start only on user request + in-view + visible tab.\n// Use <= 30fps, <= 26 particles and DPR <= 2.\n// Cancel requestAnimationFrame on pause / unmount.\n// See docs/patterns.js for the complete source."
  },
  {
    id: 'spotlight', title: 'Cursor spotlight', category: 'Interaction', engine: 'Pointer + RAF',
    description: 'Cursor-tracked light on an interactive surface, with zero continuous work.',
    preview: '<div class="demo-spotlight" tabindex="0"><span>FOLLOW THE LIGHT</span><strong>✧</strong></div>',
    code: ".spotlight { background: radial-gradient(circle at var(--lx,50%) var(--ly,50%),#71caff88,transparent 60%); }\n// Update --lx/--ly inside RAF on pointermove, reset on pointerleave."
  },
  {
    id: 'shine', title: 'Hover sheen', category: 'Interaction', engine: 'CSS transform',
    description: 'A moving sheen only while hovering or keyboard-focusing a button.',
    preview: '<button class="demo-shine" type="button">Glass sheen <span>✦</span></button>',
    code: ".shine::before { transform: translateX(-160%) skewX(-22deg); transition:transform .65s; }\n.shine:hover::before,.shine:focus-visible::before { transform:translateX(220%) skewX(-22deg); }"
  },
  {
    id: 'underline', title: 'Animated underline', category: 'Typography', engine: 'CSS transform',
    description: 'An editorial link indicator that also appears for keyboard navigation.',
    preview: '<a class="demo-underline" href="#atlas">Explore the collection <span aria-hidden="true">↗</span></a>',
    code: ".link::after { content:''; display:block; transform:scaleX(0); transform-origin:left; transition:transform .3s; }\n.link:hover::after,.link:focus-visible::after { transform:scaleX(1); }"
  },
  {
    id: 'typewriter', title: 'Typewriter headline', category: 'Typography', engine: 'Web Animations',
    description: 'Replay a character reveal without a perpetual text mutation timer.',
    preview: '<div class="demo-typewriter"><span class="typewriter-text">Build with intention.</span></div><button class="demo-secondary" type="button" data-run="typewriter">Replay headline</button>',
    code: "text.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:900,easing:'steps(21,end)'});\n// Maintain original full text in the DOM."
  },
  {
    id: 'counter', title: 'Animated counter', category: 'Typography', engine: 'Web Animations',
    description: 'A bounded one-shot number animation, triggered by a real button.',
    preview: '<div class="demo-counter"><strong class="counter-number" aria-live="polite">1,280</strong><small>motion quality points</small></div><button class="demo-secondary" type="button" data-run="counter">Count again</button>',
    code: "const animation = number.animate([{opacity:.4,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:400});\n// Update accessible numeric text once; do not mutate every frame."
  },
  {
    id: 'marquee-mask', title: 'Spotlight typography', category: 'Typography', engine: 'CSS clip-path',
    description: 'Layered text accent without layout shifts or continuous JavaScript.',
    preview: '<div class="demo-mask"><span>MOVE WITH PURPOSE</span><strong>MOVE WITH PURPOSE</strong></div>',
    code: ".mask strong { clip-path:inset(0 60% 0 0); animation:unmask 4s ease-in-out infinite alternate; }\n@keyframes unmask{ to{clip-path:inset(0 0 0 0)} }"
  },
  {
    id: 'ring', title: 'Progress ring', category: 'SVG', engine: 'SVG + CSS',
    description: 'Animated progress with an accessible numerical value and a static fallback.',
    preview: '<div class="demo-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="49"/><circle class="ring-fill" cx="60" cy="60" r="49"/></svg><span class="ring-value">72%</span></div><button class="demo-secondary" type="button" data-run="ring">Animate ring</button>',
    code: "const circumference = 2*Math.PI*49;\nring.style.strokeDasharray = String(circumference);\nring.animate([{strokeDashoffset:circumference},{strokeDashoffset:circumference*.28}],{duration:900,fill:'forwards'});"
  },
  {
    id: 'morph-blob', title: 'Liquid blob', category: 'Ambient', engine: 'CSS border-radius',
    description: 'Soft organic motion using a single CSS element; reduced-motion friendly.',
    preview: '<div class="demo-blob"><div class="blob-shape">✦</div></div>',
    code: ".blob { animation:blob 9s ease-in-out infinite alternate; }\n@keyframes blob{ 50%{border-radius:38% 62% 62% 38% / 48% 40% 60% 52%; transform:rotate(10deg)} }"
  },
  {
    id: 'float', title: 'Floating layers', category: 'Ambient', engine: 'CSS transform',
    description: 'Independent layered floating elements with slow, subtle movement.',
    preview: '<div class="demo-float"><span>✦</span><span>◇</span><span>✧</span></div>',
    code: ".float { animation:levitate 5s ease-in-out infinite alternate; }\n@keyframes levitate { to { transform:translateY(-14px); } }"
  },
  {
    id: 'carousel', title: 'Keyboard carousel', category: 'Layout', engine: 'Scroll snap + DOM',
    description: 'Native scroll snapping and real previous/next controls, no carousel dependency.',
    preview: '<div class="demo-carousel"><div class="carousel-viewport" tabindex="0" aria-label="Three cards"><div class="carousel-slide">01<span>ASTRA</span></div><div class="carousel-slide">02<span>NOVA</span></div><div class="carousel-slide">03<span>VEGA</span></div></div><div class="carousel-controls"><button type="button" data-run="carousel-prev" aria-label="Previous slide">←</button><span class="carousel-page" aria-live="polite">1 / 3</span><button type="button" data-run="carousel-next" aria-label="Next slide">→</button></div></div>',
    code: ".viewport { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; }\n.slide { flex:0 0 100%; scroll-snap-align:start; }\n// Use buttons calling scrollTo({left: index*width,behavior:reduced?'instant':'smooth'})."
  },
  {
    id: 'tabs', title: 'Animated tabs', category: 'Layout', engine: 'DOM + WAAPI',
    description: 'Semantic tab controls with arrow-key navigation and a subtle panel transition.',
    preview: '<div class="demo-tabs"><div role="tablist" aria-label="Preview tabs"><button type="button" role="tab" aria-selected="true" tabindex="0">Preview</button><button type="button" role="tab" aria-selected="false" tabindex="-1">Code</button><button type="button" role="tab" aria-selected="false" tabindex="-1">Notes</button></div><div class="tab-panel" role="tabpanel">Polished preview</div></div>',
    code: "// Use role=tab, aria-selected, tabindex and ArrowLeft/Right keyboard handling.\n// Animate only the content panel once after a state change."
  },
  {
    id: 'drawer', title: 'Slide-up drawer', category: 'Layout', engine: 'HTML dialog',
    description: 'An accessible modal dialog, native focus management and a motion fallback.',
    preview: '<button class="demo-secondary" type="button" data-run="drawer">Open drawer</button>',
    code: "const drawer = document.querySelector('dialog');\nopenButton.addEventListener('click', () => drawer.showModal());\n// Escape key and focus management are native; animate transform only when allowed."
  },
  {
    id: 'confetti', title: 'Celebration burst', category: 'Feedback', engine: 'Web Animations',
    description: 'Small user-triggered celebratory particles that clean themselves up.',
    preview: '<button class="demo-confetti" type="button">Celebrate <span aria-hidden="true">✦</span></button>',
    code: "// Spawn <= 18 DOM dots only on click, animate translate + opacity.\n// Remove all particles when animations complete, or when unmounting."
  },
  {
    id: 'pulse-dot', title: 'Presence indicator', category: 'Feedback', engine: 'CSS opacity',
    description: 'Subtle status indicator with text; animation never carries status alone.',
    preview: '<div class="demo-presence"><span class="presence-dot" aria-hidden="true"></span><span>Available for collaboration</span></div>',
    code: ".presence::before{animation:breathe 3s ease-in-out infinite alternate;}\n@keyframes breathe {to{opacity:.4;transform:scale(.7)}}\n@media(prefers-reduced-motion:reduce){.presence::before{animation:none}}"
  },
  {
    id: 'focus', title: 'Focus halo', category: 'Interaction', engine: 'CSS outline',
    description: 'Keyboard-first animated focus visibility, no JavaScript required.',
    preview: '<button class="demo-focus" type="button">Tab to focus</button>',
    code: ".focus:focus-visible { outline:3px solid #9adfff; outline-offset:4px; box-shadow:0 0 0 10px #9adfff23; }\n/* Do not remove native focus without an equivalent. */"
  },
  {
    id: 'shimmer-text', title: 'Shimmer typography', category: 'Typography', engine: 'CSS background',
    description: 'A gentle text gradient sweep with an immediate static alternative.',
    preview: '<div class="demo-shimmer">DESIGN IN MOTION</div>',
    code: ".text { background:linear-gradient(90deg,#89c9f0,#fff,#b8a4f9,#89c9f0); background-size:250% auto; color:transparent; background-clip:text; animation:shimmer 7s linear infinite; }\n@keyframes shimmer {to{background-position:250% center}}"
  },
  {
    id: 'sweep', title: 'Page section wipe', category: 'Scroll', engine: 'IntersectionObserver',
    description: 'One-shot section entry on intersection, with content visible by default.',
    preview: '<div class="demo-sweep"><span>SCROLL STORY</span><strong>ENTER THE FRAME</strong></div><button class="demo-secondary" type="button" data-run="sweep">Replay wipe</button>',
    code: "element.animate([{opacity:.2,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],{duration:600});\n// Trigger once with IntersectionObserver, replay on explicit click."
  },
  {
    id: 'switch', title: 'Morphing toggle', category: 'Interaction', engine: 'CSS transform',
    description: 'A stateful switch with a clear label, keyboard support and short transitions.',
    preview: '<label class="demo-switch-label">Enable ambience <input class="demo-switch" type="checkbox" checked><span class="switch-shell" aria-hidden="true"><span></span></span></label>',
    code: "<label>Enable ambience <input type='checkbox'><span class='switch-shell'></span></label>\n/* Style :checked + .switch-shell and preserve the native input for keyboard users. */"
  }
]);

export const categories = Object.freeze(['All', ...new Set(patterns.map((pattern) => pattern.category))]);

export function filterPatterns(items, category = 'All', search = '') {
  const query = String(search).trim().toLocaleLowerCase();
  return items.filter((item) =>
    (category === 'All' || item.category === category) &&
    (!query || [item.id, item.title, item.category, item.description, item.engine]
      .some((value) => value.toLocaleLowerCase().includes(query)))
  );
}
