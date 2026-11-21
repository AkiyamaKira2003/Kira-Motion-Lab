# Kira Motion Lab — World Motion Atlas

**[Open the live gallery](https://akiyamakira2003.github.io/Kira-Motion-Lab/)** · [Atlas source](./docs/catalog.js) · [Motion controllers](./docs/patterns.js) · [Worldwide references](./docs/sources.js)

A curated **39-demo** motion showcase: 36 new patterns in an interactive searchable atlas plus the original magnetic glass, celestial orbit and chromatic pulse demonstrations. All the previews are **independently authored** in this repository and run with native browser APIs. This is a source-inspired learning gallery, **not a copy of third-party components**.

## Features

| Area | What you can explore |
| --- | --- |
| Pointer & hover | Magnetic attraction, tilt, light tracking, ripple, sheen, focus, parallax |
| Feedback | Spring response, notifications, loading, confetti, presence |
| Scroll | On-view reveals, progress tracking, section wipe |
| Typography | Text entrance, typewriter, underline, animated counter, masking, shimmer |
| Layout | 3D flip, carousel, semantic tabs, dialog drawer, stepper, accordion, native morph |
| SVG & Canvas | Path drawing, progress ring, opt-in Canvas 2D comet field |
| Ambient | Animated gradient, blob, floating layers, marquee |

Use **search**, **nine category filters**, **sort by reference-source GitHub stars**, **speed control**, **light/dark mode**, **reduce motion**, and expandable implementation recipes. Each card links directly to a relevant international source.

### Share an individual motion

Use the **Direct link** control on any Atlas card to open its own URL, then
copy that URL from the browser address bar to share the example. For instance,
[`#motion-ripple`](https://akiyamakira2003.github.io/Kira-Motion-Lab/#motion-ripple)
opens the **Click feedback** example; every one of the 36 Atlas examples has
a stable `#motion-<id>` fragment. A deep link is keyboard accessible, focuses
the card on navigation and works with browser Back/Forward. The currently
linked example stays visible even if the user filters or searches for other
effects, with an explicit result-count explanation. Invalid or unknown
fragments are ignored; normal `#atlas`, `#sources`, and `#top` anchors still work.

This is native fragment navigation, **not** an analytics or client-side routing
framework. The URL itself is the shareable artifact; the control does not need
clipboard permission. Deep links resolve on static GitHub Pages once the
updated site is published.

The source popularity ranking reflects the **GitHub stars of the cited library**, captured on **November 20, 2026**. It is **not** an individual animation's likes, visits, popularity ranking or a claim of endorsement. We reference 16 source repositories including Anime.js, Motion, React Bits, GSAP, Lottie-web, Swiper, Magic UI, AutoAnimate, React Spring and more. See [Sources & methodology](./RESEARCH.md).

## Performance architecture

- **Zero runtime dependencies** — no React/GSAP/Three.js bundles or client-side CDN requests.
- Cards are mounted **as they enter the viewport** via IntersectionObserver. Ambient CSS animations are paused outside it.
- Pointer-based motion uses **bounded inputs and requestAnimationFrame batching**, never an idle pointer loop.
- The optional Canvas field is **off by default**, draws at no more than 30 FPS with at most 26 dots and DPR capped at 2. It pauses when the tab is hidden, when out of view, when motion is reduced or when the user pauses it.
- One-shot Web Animations are cancelled on cleanup; dialog/focus semantics use native browser behavior.
- The OS-level **prefers-reduced-motion** setting is respected on entry, and visitors can override it using the on-page control.
- No server, analytics, cookies, tracking scripts, user login or developer token is required.

Performance characteristics are design targets, not audited benchmark results. For independently measured performance, collect browser traces on representative hardware; see [Google's guide](https://web.dev/articles/animations-guide) and [MDN Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

## Run locally

Requires only a static file server, e.g. Python:

~~~bash
python -m http.server 8080 --directory docs
~~~

Visit http://localhost:8080. No npm packages are required to **run** the gallery.

## Reusing a pattern

Import [mountPattern](./docs/patterns.js), pass the preview's container and a pattern ID, and keep the returned cleanup function. For example:

~~~js
import { mountPattern } from './patterns.js';
const cleanup = mountPattern(document.querySelector('.my-card'), 'ripple', {
  enabled: () => true,
  speed: () => 1
});
// After the component is removed:
cleanup();
~~~

The original 3D card API is preserved in [motion.js](./docs/motion.js). The patterns are framework-neutral demonstrations rather than a compiled npm package; copy the corresponding HTML/CSS from the gallery when porting an effect.

## Quality gates

~~~bash
npm run check
~~~

Node's built-in test runner validates distinct catalog entries, source attribution, search and sorting, invalid numbers, particle budgets, safe cleanup, pointer math, accessible controls, and valid/invalid deep-link fragments. GitHub Actions executes the checks on Node 20 and 22 across Windows and Linux. For the permalink change, a local browser smoke test also checked dynamic card focus, history navigation, filtering and horizontal overflow at 375px and 1280px; those observations are **not** a performance benchmark or independent accessibility audit.

## Scope & license

MIT — original examples, authored for Kira Motion Lab by Akiyama Kira. Third-party repos linked in the gallery retain **their own licenses**; a link to one is not a grant to reuse its code. Some source libraries have mixed or non-MIT terms, so please inspect each source before integrating its actual code.

Roadmap: browser-measured performance budgets, visual snapshots at mobile breakpoints, improved code examples, and carefully researched additions chosen for user value rather than simply inflating the gallery.
