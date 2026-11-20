# Kira Motion Lab

Three composited, accessible interface experiments — a small open-source project by Akiyama Kira.

**[Live interactive demo](https://akiyamakira2003.github.io/Kira-Motion-Lab/)** · [Source library](./docs/motion.js)

## Included

1. **Magnetic glass**: pointer-controlled 3D tilt capped at nine degrees; one animation-frame request per pointer batch; stops on pointer leave.
2. **Celestial orbit**: centered letterform and layered orbit rings with CSS transform-only rotation.
3. **Chromatic pulse**: original abstract waveform bars using CSS scale transforms; pause and resume control, not real audio.

The examples share a cohesive celestial-blue visual design. There are responsive layouts, light/dark themes and an accessible motion toggle. The OS-level reduced-motion preference is honored by default and the user can explicitly override it.

## Run locally

No build, dependency installation, API key or token is required. Serve the docs folder with any static file server:

~~~bash
python -m http.server 8080 --directory docs
~~~

Open http://localhost:8080/.

## Use the pointer-tilt helper

The source is in docs/motion.js. Import the bindTilt function, pass a focusable element, and retain its returned controller so you can call destroy() when unmounting. The module has no runtime dependencies. calculateTilt() can also be used as a pure geometry helper.

Motion is a deliberate opt-in visual enhancement: text content remains accessible with animations disabled and under keyboard-only interaction.

## Quality gates

~~~bash
npm run check
~~~

The test suite covers geometry, clamping, invalid inputs, event cleanup, requestAnimationFrame batching, touch input, disabled motion and accessible page semantics. GitHub Actions verifies Node.js 20/22 on Windows and Linux.

The design favors transform and opacity to minimize layout and paint work; it is not a benchmark result. See Google's [animation performance guide](https://web.dev/articles/animations-guide).

## Roadmap

- Add a keyboard-controlled intensity selector with bounded values.
- Extract reusable copy-and-paste CSS examples with a visual live editor.
- Automate browser-based accessibility and layout checks at mobile breakpoints.
- Measure interaction latency and main-thread work using browser performance recordings.

## License

MIT. Copyright 2026 Akiyama Kira.
