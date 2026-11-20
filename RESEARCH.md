# Motion source research & selection — 20 November 2026

This catalog compiles references from internationally popular animation and interaction libraries and web-platform documentation. It is a **curated selection, not an exhaustive index** of all worldwide source code or a survey of individual motion page views.

## Selection criteria

1. **Popularity evidence:** GitHub repository stars verified on November 20, 2026. Stars represent repository-level community interest, *not individual effect likes or website traffic*. No provider supplied verifiable per-effect view counts.
2. **Practical usefulness:** usable patterns for navigation, input feedback, typography, transitions, state changes, scroll and ambient visuals.
3. **Engineering merit:** ability to implement with native CSS/WAAPI/IntersectionObserver/Canvas 2D and avoid unnecessary bundle weight or long-running loops.
4. **Accessibility and provenance:** reduced-motion fallback, keyboard support, source attribution and explicit recognition that linked repos may have different licenses.

## Verified public GitHub references

| Library | Repository | Stars at audit | License listed or observed |
| --- | --- | ---: | --- |
| Anime.js | https://github.com/juliangarnier/anime | 74,912 | MIT |
| React Bits | https://github.com/DavidHDev/react-bits | 52,334 | Mixed / source terms should be checked |
| Swiper | https://github.com/nolimits4web/swiper | 41,908 | MIT |
| Motion | https://github.com/motiondivision/motion | 35,373 | MIT |
| React Three Fiber | https://github.com/pmndrs/react-three-fiber | 33,840 | MIT |
| Lottie-web | https://github.com/airbnb/lottie-web | 32,525 | MIT |
| GSAP | https://github.com/greensock/GSAP | 30,961 | Check GSAP current terms |
| React Spring | https://github.com/pmndrs/react-spring | 29,319 | MIT |
| Magic UI | https://github.com/magicuidesign/magicui | 23,380 | MIT |
| Lenis | https://github.com/darkroomengineering/lenis | 17,376 | MIT |
| Parallax.js | https://github.com/wagerfield/parallax | 16,572 | Check repo terms |
| AutoAnimate | https://github.com/formkit/auto-animate | 13,976 | MIT |
| Theatre.js | https://github.com/theatre-js/theatre | 13,067 | Apache-2.0 |
| Motion Primitives | https://github.com/ibelick/motion-primitives | 6,987 | MIT |
| Canvas Sketch | https://github.com/mattdesl/canvas-sketch | 5,330 | MIT |
| React Flip Toolkit | https://github.com/aholachek/react-flip-toolkit | 4,183 | MIT |

No third-party component source or licensed media is included in the site. The original motion recipes were designed and implemented here based on general public UI principles.

## Web platform references

- https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://web.dev/articles/animations-guide
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Caveats

GitHub stars do not prove technical quality, installation counts, monthly visitors or motion-specific popularity. Source snapshots need refreshing before future numeric comparisons. Reference-library licenses are not necessarily the same as the license of a component in that library. Compositor-only transformations can still be costly on resource-limited devices if overused. Therefore this gallery prefers on-demand behavior and visibility-aware previews over 36 continually running canvases.
