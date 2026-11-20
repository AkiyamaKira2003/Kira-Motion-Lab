/**
 * Small, independent motion controllers for the Kira Motion Atlas.
 * No dependencies, network calls, background timers, or history mutation.
 * Every mounted controller returns a cleanup function.
 */
import { clampFinite } from './motion.js';

export function clamp01(value) {
  return clampFinite(value, 0, 1);
}
export function scrollRatio(position, total, viewport) {
  const max = total - viewport;
  return Number.isFinite(max) && max > 0 ? clamp01(position / max) : 0;
}
export function particleBudget(width, height) {
  if (![width, height].every(Number.isFinite) || width <= 0 || height <= 0) return 0;
  return Math.min(26, Math.max(6, Math.floor(width * height / 3600)));
}

export function mountPattern(root, id, context = {}) {
  if (!root || typeof root.querySelector !== 'function') {
    throw new TypeError('Expected a pattern container');
  }
  const abort = new AbortController();
  const animations = new Set();
  const cleanups = [];
  const enabled = typeof context.enabled === 'function' ? context.enabled : () => true;
  const speed = () => clampFinite(context.speed?.() ?? 1, .4, 2);
  const frame = globalThis.requestAnimationFrame?.bind(globalThis);
  const cancel = globalThis.cancelAnimationFrame?.bind(globalThis);
  let destroyed = false;
  const listen = (target, type, fn, options = {}) => {
    target?.addEventListener(type, fn, { ...options, signal: abort.signal });
  };
  const animate = (target, frames, duration, options = {}) => {
    if (destroyed || !enabled() || !target?.animate) return null;
    const animation = target.animate(frames, {
      duration: Math.max(1, Math.round(duration / speed())),
      easing: 'cubic-bezier(.2,.75,.22,1)',
      ...options
    });
    animations.add(animation);
    const remove = () => animations.delete(animation);
    animation.addEventListener('finish', remove, { once: true });
    animation.addEventListener('cancel', remove, { once: true });
    return animation;
  };
  const control = (action, fn) => listen(root.querySelector('[data-run="' + action + '"]'), 'click', fn);
  const pointer = (target, update, reset) => {
    let pending = null;
    let task = null;
    const flush = () => {
      task = null;
      if (pending && !destroyed && enabled()) update(pending.x, pending.y);
      pending = null;
    };
    const clear = () => {
      if (task !== null && cancel) cancel(task);
      task = null;
      pending = null;
      reset();
    };
    listen(target, 'pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      if (!enabled()) { clear(); return; }
      pending = { x: e.clientX, y: e.clientY };
      if (task === null) {
        if (frame) task = frame(flush);
        else flush();
      }
    }, { passive: true });
    listen(target, 'pointerleave', clear);
    listen(target, 'blur', clear, { capture: true });
    cleanups.push(clear);
  };

  if (id === 'magnetic') {
    const el = root.querySelector('.demo-magnetic');
    pointer(el, (x, y) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mx', clampFinite((x - b.left - b.width / 2) * .19, -15, 15).toFixed(1) + 'px');
      el.style.setProperty('--my', clampFinite((y - b.top - b.height / 2) * .19, -12, 12).toFixed(1) + 'px');
    }, () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  } else if (id === 'parallax') {
    const el = root.querySelector('.demo-parallax');
    pointer(el, (x, y) => {
      const b = el.getBoundingClientRect();
      const px = clampFinite((x - b.left) / b.width, 0, 1) - .5;
      const py = clampFinite((y - b.top) / b.height, 0, 1) - .5;
      el.style.setProperty('--px', (px * 24).toFixed(1) + 'px');
      el.style.setProperty('--py', (py * 24).toFixed(1) + 'px');
    }, () => {
      el.style.setProperty('--px', '0px');
      el.style.setProperty('--py', '0px');
    });
  } else if (id === 'spotlight') {
    const el = root.querySelector('.demo-spotlight');
    pointer(el, (x, y) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--lx', (100 * clampFinite((x - b.left) / b.width, 0, 1)).toFixed(1) + '%');
      el.style.setProperty('--ly', (100 * clampFinite((y - b.top) / b.height, 0, 1)).toFixed(1) + '%');
    }, () => {
      el.style.setProperty('--lx', '50%');
      el.style.setProperty('--ly', '50%');
    });
  } else if (id === 'ripple') {
    const el = root.querySelector('.demo-ripple');
    const inks = new Set();
    listen(el, 'click', (event) => {
      if (!enabled()) return;
      const b = el.getBoundingClientRect();
      const x = event.detail > 0 ? clampFinite(event.clientX - b.left, 0, b.width) : b.width / 2;
      const y = event.detail > 0 ? clampFinite(event.clientY - b.top, 0, b.height) : b.height / 2;
      const ink = document.createElement('span');
      const diameter = Math.hypot(b.width, b.height) * 2;
      ink.className = 'ripple-ink';
      ink.style.cssText = 'width:' + diameter + 'px;height:' + diameter + 'px;left:' + x + 'px;top:' + y + 'px';
      el.append(ink);
      inks.add(ink);
      const active = animate(ink, [
        { transform: 'translate(-50%,-50%) scale(0)', opacity: .68 },
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }
      ], 520, { easing: 'ease-out' });
      const remove = () => { ink.remove(); inks.delete(ink); };
      if (active) {
        active.addEventListener('finish', remove, { once: true });
        active.addEventListener('cancel', remove, { once: true });
      } else remove();
    });
    cleanups.push(() => inks.forEach((ink) => ink.remove()));
  } else if (id === 'spring') {
    const el = root.querySelector('.demo-spring');
    let current = null;
    listen(el, 'click', () => {
      current?.cancel();
      current = animate(el, [
        { transform: 'scale(1)' },
        { transform: 'scale(.89)', offset: .22 },
        { transform: 'scale(1.1)', offset: .58 },
        { transform: 'scale(1)' }
      ], 540, { easing: 'ease-out' });
    });
  } else if (id === 'flip') {
    const el = root.querySelector('.demo-flip');
    listen(el, 'click', () => {
      const flipped = el.classList.toggle('is-flipped');
      el.setAttribute('aria-pressed', String(flipped));
      el.setAttribute('aria-label', flipped ? 'Show front of Kira card' : 'Flip the Kira card');
    });
  } else if (id === 'reveal' || id === 'text-reveal' || id === 'sweep') {
    const selector = id === 'reveal' ? '.reveal-plate' :
      id === 'text-reveal' ? '.demo-type span' : '.demo-sweep';
    const elements = [...root.querySelectorAll(selector)];
    const replay = () => {
      for (const [i, el] of elements.entries()) {
        animate(el, id === 'sweep'
          ? [{ opacity: .2, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }]
          : [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        520, { delay: Math.round(i * 90 / speed()) });
      }
    };
    control(id, replay);
    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        replay();
      }, { threshold: .24 });
      io.observe(root);
      cleanups.push(() => io.disconnect());
    }
  } else if (id === 'scroll-progress') {
    const bar = root.querySelector('.progress-rail');
    const fill = root.querySelector('.progress-fill');
    const text = root.querySelector('.progress-count');
    let task = null;
    const update = () => {
      task = null;
      const ratio = scrollRatio(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
      fill.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      const percent = Math.round(ratio * 100);
      text.textContent = percent + '%';
      bar.setAttribute('aria-valuenow', String(percent));
    };
    const schedule = () => {
      if (task !== null) return;
      if (frame) task = frame(update);
      else update();
    };
    listen(window, 'scroll', schedule, { passive: true });
    listen(window, 'resize', schedule, { passive: true });
    update();
    cleanups.push(() => { if (task !== null && cancel) cancel(task); });
  } else if (id === 'skeleton') {
    const box = root.querySelector('.demo-skeleton');
    const placeholder = box.querySelector('.skeleton-view');
    const ready = box.querySelector('.skeleton-ready');
    const button = root.querySelector('[data-run="skeleton"]');
    listen(button, 'click', () => {
      const isLoading = box.classList.toggle('is-loading');
      placeholder.hidden = !isLoading;
      ready.hidden = isLoading;
      button.textContent = isLoading ? 'Show content' : 'Load again';
      button.setAttribute('aria-pressed', String(isLoading));
    });
  } else if (id === 'svg-draw') {
    const path = root.querySelector('.svg-stroke');
    let active = null;
    control(id, () => {
      active?.cancel();
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = '0';
      active = animate(path, [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        950, { easing: 'ease-in-out' });
    });
  } else if (id === 'view-transition') {
    const shape = root.querySelector('.morph-shape');
    const button = root.querySelector('[data-run="view-transition"]');
    listen(button, 'click', () => {
      const update = () => {
        const state = shape.classList.toggle('alternate');
        button.textContent = state ? 'Restore shape' : 'Change shape';
        button.setAttribute('aria-pressed', String(state));
      };
      if (enabled() && typeof document.startViewTransition === 'function') {
        try { document.startViewTransition(update); } catch { update(); }
      } else update();
    });
  } else if (id === 'stagger') {
    const items = [...root.querySelectorAll('.demo-stagger span')];
    control(id, () => {
      for (const [i, item] of items.entries()) {
        animate(item, [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], 420, { delay: Math.round(i * 85 / speed()) });
      }
    });
  } else if (id === 'toast') {
    const toast = root.querySelector('.demo-toast');
    control('toast', () => {
      toast.hidden = false;
      animate(toast, [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], 260, { easing: 'ease-out' });
    });
    control('dismiss-toast', () => { toast.hidden = true; });
  } else if (id === 'stepper') {
    const steps = [
      { title: 'Discover', description: 'Start with the problem.' },
      { title: 'Design', description: 'Make the intention visible.' },
      { title: 'Deliver', description: 'Test, refine and ship.' }
    ];
    const stage = root.querySelector('.stepper-stage');
    const title = stage.querySelector('.stepper-title');
    const detail = stage.querySelector('.stepper-detail');
    const number = stage.querySelector('.stepper-number');
    const label = root.querySelector('.stepper-index');
    let index = 0;
    const set = (delta) => {
      index = (index + steps.length + delta) % steps.length;
      title.textContent = steps[index].title;
      detail.textContent = steps[index].description;
      number.textContent = String(index + 1).padStart(2, '0');
      label.textContent = (index + 1) + ' / ' + steps.length;
      animate(stage, [
        { opacity: .5, transform: 'translateY(7px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], 240);
    };
    control('step-next', () => set(1));
    control('step-prev', () => set(-1));
  } else if (id === 'typewriter') {
    const text = root.querySelector('.typewriter-text');
    control(id, () => animate(text, [
      { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }
    ], 960, { easing: 'steps(21,end)' }));
  } else if (id === 'counter') {
    const number = root.querySelector('.counter-number');
    control(id, () => animate(number, [
      { opacity: .4, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], 420));
  } else if (id === 'ring') {
    const circle = root.querySelector('.ring-fill');
    const circumference = 2 * Math.PI * 49;
    circle.style.strokeDasharray = String(circumference);
    circle.style.strokeDashoffset = String(circumference * .28);
    control(id, () => animate(circle, [
      { strokeDashoffset: circumference },
      { strokeDashoffset: circumference * .28 }
    ], 900, { easing: 'ease-out' }));
  } else if (id === 'carousel') {
    const track = root.querySelector('.carousel-viewport');
    const label = root.querySelector('.carousel-page');
    const slides = [...track.querySelectorAll('.carousel-slide')];
    let current = 0;
    const go = (delta) => {
      current = (current + slides.length + delta) % slides.length;
      track.scrollTo({ left: current * track.clientWidth, behavior: enabled() ? 'smooth' : 'instant' });
      label.textContent = (current + 1) + ' / ' + slides.length;
    };
    control('carousel-next', () => go(1));
    control('carousel-prev', () => go(-1));
    listen(track, 'scroll', () => {
      const n = Math.round(track.scrollLeft / (track.clientWidth || 1));
      current = Math.max(0, Math.min(slides.length - 1, n));
      label.textContent = (current + 1) + ' / ' + slides.length;
    }, { passive: true });
  } else if (id === 'tabs') {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panel = root.querySelector('[role="tabpanel"]');
    const values = ['Polished preview', 'Readable source code', 'Accessible by default'];
    const activate = (i, focus = false) => {
      tabs.forEach((tab, n) => {
        tab.setAttribute('aria-selected', String(n === i));
        tab.tabIndex = n === i ? 0 : -1;
      });
      panel.textContent = values[i];
      if (focus) tabs[i].focus();
      animate(panel, [{ opacity: .35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], 240);
    };
    tabs.forEach((tab, i) => {
      listen(tab, 'click', () => activate(i));
      listen(tab, 'keydown', (e) => {
        const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (delta) { e.preventDefault(); activate((i + tabs.length + delta) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); activate(0, true); }
        if (e.key === 'End') { e.preventDefault(); activate(tabs.length - 1, true); }
      });
    });
  } else if (id === 'drawer') {
    const dialog = document.createElement('dialog');
    dialog.className = 'atlas-drawer';
    dialog.innerHTML = '<div class="drawer-body"><div class="eyebrow">NATIVE DIALOG</div><h3>Motion should help.</h3><p>Escape closes this accessible modal; focus is managed by the browser.</p><button type="button" class="demo-secondary">Close drawer</button></div>';
    root.append(dialog);
    control('drawer', () => { if (!dialog.open) dialog.showModal(); });
    listen(dialog.querySelector('button'), 'click', () => dialog.close());
    listen(dialog, 'click', (e) => { if (e.target === dialog) dialog.close(); });
    cleanups.push(() => { dialog.close(); dialog.remove(); });
  } else if (id === 'confetti') {
    const button = root.querySelector('.demo-confetti');
    const dots = new Set();
    listen(button, 'click', () => {
      if (!enabled()) return;
      for (let i = 0; i < 15; i++) {
        const dot = document.createElement('span');
        dot.className = 'confetti-dot';
        dot.style.background = i % 3 === 0 ? '#b8a2fc' : i % 2 ? '#91dfff' : '#ffe3a0';
        button.append(dot);
        dots.add(dot);
        const radians = i * 2 * Math.PI / 15;
        const radius = 40 + (i % 4) * 11;
        const x = (Math.cos(radians) * radius).toFixed(1);
        const y = (Math.sin(radians) * radius).toFixed(1);
        const active = animate(dot, [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: 'translate(' + x + 'px,' + y + 'px) scale(.15)', opacity: 0 }
        ], 680, { easing: 'ease-out' });
        const remove = () => { dot.remove(); dots.delete(dot); };
        if (active) {
          active.addEventListener('finish', remove, { once: true });
          active.addEventListener('cancel', remove, { once: true });
        } else remove();
      }
    });
    cleanups.push(() => dots.forEach((dot) => dot.remove()));
  }

  if (id === 'comets') {
    const canvas = root.querySelector('canvas');
    const button = root.querySelector('[data-run="comets"]');
    const ctx = canvas?.getContext?.('2d');
    if (ctx) {
      let playing = false;
      let inView = true;
      let handle = null;
      let previous = 0;
      let width = 1;
      let height = 1;
      let particles = [];
      const noise = (n) => (Math.sin(n * 12.9898 + 78.233) * 43758.5453 % 1 + 1) % 1;
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(2, Math.max(1, Number(globalThis.devicePixelRatio) || 1));
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles = Array.from({ length: particleBudget(width, height) }, (_, i) => ({
          x: noise(i + 1) * width, y: noise(i + 2) * height,
          vx: (noise(i + 3) + .25) * .7, vy: -.15 - noise(i + 4) * .35,
          size: .8 + noise(i + 5) * 2
        }));
      };
      const shouldRun = () => playing && inView && enabled() && !document.hidden && !destroyed;
      const stop = () => { if (handle !== null && cancel) cancel(handle); handle = null; previous = 0; };
      const render = (now) => {
        handle = null;
        if (!shouldRun()) return;
        if (now - previous >= 1000 / 30) {
          const delta = previous ? Math.min((now - previous) / 33.3, 2) : 1;
          previous = now;
          ctx.clearRect(0, 0, width, height);
          for (const p of particles) {
            p.x += p.vx * delta; p.y += p.vy * delta;
            if (p.x > width + 7) p.x = -7;
            if (p.y < -7) p.y = height + 7;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = '#9bdfff'; ctx.fill();
          }
        }
        if (frame) handle = frame(render);
      };
      const sync = () => {
        if (!shouldRun()) {
          stop();
          button.textContent = playing && !enabled() ? 'Motion disabled' :
            playing ? 'Pause particles' : 'Play particles';
          return;
        }
        button.textContent = 'Pause particles';
        if (handle === null && frame) handle = frame(render);
      };
      listen(button, 'click', () => {
        playing = !playing;
        button.setAttribute('aria-pressed', String(playing));
        button.textContent = playing ? 'Pause particles' : 'Play particles';
        if (playing) resize(); else ctx.clearRect(0, 0, width, height);
        sync();
      });
      listen(document, 'visibilitychange', sync);
      listen(window, 'kira:motionchange', sync);
      listen(window, 'resize', () => { if (playing) resize(); }, { passive: true });
      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
          inView = entries.some((entry) => entry.isIntersecting);
          sync();
        }, { threshold: .05 });
        observer.observe(root);
        cleanups.push(() => observer.disconnect());
      }
      cleanups.push(stop);
    } else {
      button.disabled = true;
      button.textContent = 'Canvas unavailable';
    }
  }

  return () => {
    if (destroyed) return;
    destroyed = true;
    abort.abort();
    for (const animation of animations) animation.cancel();
    animations.clear();
    for (const cleanup of cleanups) cleanup();
  };
}
