/**
 * Lightweight pointer-driven tilt, with zero dependencies and no background loop.
 * The CSS side should animate transform/opacity and honor reduced-motion settings.
 */
export function clampFinite(value, min, max) {
  if (!Number.isFinite(value)) return (min + max) / 2;
  return Math.max(min, Math.min(max, value));
}

export function calculateTilt(x, y, rectangle, maxDegrees = 10) {
  const max = Number.isFinite(maxDegrees) ? clampFinite(maxDegrees, 0, 25) : 0;
  const width = Number(rectangle?.width);
  const height = Number(rectangle?.height);
  if (max === 0 || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { rotateX: 0, rotateY: 0 };
  }
  const nx = clampFinite((x - rectangle.left) / width, 0, 1) * 2 - 1;
  const ny = clampFinite((y - rectangle.top) / height, 0, 1) * 2 - 1;
  return { rotateX: ny === 0 ? 0 : -ny * max, rotateY: nx * max };
}

export function bindTilt(element, options = {}) {
  if (!element || typeof element.addEventListener !== 'function') {
    throw new TypeError('bindTilt requires an interactive element');
  }
  const enabled = typeof options.enabled === 'function' ? options.enabled : () => true;
  const schedule = options.requestFrame || globalThis.requestAnimationFrame?.bind(globalThis);
  const cancel = options.cancelFrame || globalThis.cancelAnimationFrame?.bind(globalThis);
  let frame = null;
  let pending = null;
  let destroyed = false;

  const reset = () => {
    pending = null;
    if (frame !== null && cancel) cancel(frame);
    frame = null;
    element.style.setProperty('--rotate-x', '0deg');
    element.style.setProperty('--rotate-y', '0deg');
  };
  const flush = () => {
    frame = null;
    if (!pending || destroyed || !enabled()) return;
    const point = pending;
    pending = null;
    const { rotateX, rotateY } = calculateTilt(
      point.x, point.y, element.getBoundingClientRect(), options.maxDegrees ?? 9
    );
    element.style.setProperty('--rotate-x', rotateX.toFixed(2) + 'deg');
    element.style.setProperty('--rotate-y', rotateY.toFixed(2) + 'deg');
  };
  const move = (event) => {
    if (!enabled()) { reset(); return; }
    if (event.pointerType === 'touch') return;
    pending = { x: event.clientX, y: event.clientY };
    if (frame === null) {
      if (schedule) frame = schedule(flush);
      else flush();
    }
  };
  element.addEventListener('pointermove', move, { passive: true });
  element.addEventListener('pointerleave', reset);
  element.addEventListener('blur', reset, true);
  return {
    reset,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      reset();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('blur', reset, true);
    }
  };
}
