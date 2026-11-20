import { bindTilt } from './motion.js';
import './atlas.js';

const doc = document.documentElement;
const motionButton = document.getElementById('motion-toggle');
const themeButton = document.getElementById('theme-toggle');
const announcement = document.getElementById('announcement');
const waveform = document.querySelector('.wave-track');
const waveButton = document.getElementById('wave-toggle');

const media = window.matchMedia('(prefers-reduced-motion: reduce)');
// Keep original hero experiments idle while the user browses the long Atlas.
if (typeof IntersectionObserver !== 'undefined') {
  const specimenObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }
  }, { rootMargin: '120px 0px', threshold: .01 });
  for (const specimen of document.querySelectorAll('.specimen')) {
    specimenObserver.observe(specimen);
  }
}
let userOverrodeMotion = false;
function setMotion(reduced) {
  doc.dataset.motion = reduced ? 'reduced' : 'full';
  motionButton.setAttribute('aria-pressed', String(reduced));
  motionButton.textContent = reduced ? 'Motion off' : 'Motion on';
  if (reduced) tilt.reset();
  window.dispatchEvent(new Event('kira:motionchange'));
}
const tilt = bindTilt(document.querySelector('.tilt-card'), {
  maxDegrees: 9,
  enabled: () => doc.dataset.motion !== 'reduced'
});
setMotion(media.matches);
media.addEventListener?.('change', (event) => {
  if (!userOverrodeMotion) setMotion(event.matches);
});
motionButton.addEventListener('click', () => {
  userOverrodeMotion = true;
  setMotion(doc.dataset.motion !== 'reduced');
});
themeButton.addEventListener('click', () => {
  const light = doc.dataset.theme !== 'light';
  doc.dataset.theme = light ? 'light' : 'dark';
  themeButton.setAttribute('aria-pressed', String(light));
  themeButton.textContent = light ? 'Light theme' : 'Dark theme';
});
waveButton.addEventListener('click', () => {
  const paused = waveform.classList.toggle('paused');
  waveButton.textContent = paused ? 'Resume' : 'Pause';
  waveButton.setAttribute('aria-pressed', String(paused));
});

const snippets = {
  tilt: 'import { bindTilt } from "./motion.js";\nconst controller = bindTilt(document.querySelector(".card"), { maxDegrees: 9 });\n// Cleanup: controller.destroy();',
  orbit: '.orbital { animation: spin 24s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }\n@media (prefers-reduced-motion: reduce) { .orbital { animation: none; } }',
  wave: '.wave-track span { animation: wave 1.45s ease-in-out infinite alternate; }\n@keyframes wave { 0% { transform: scaleY(.34); opacity: .58; } 100% { transform: scaleY(1); opacity: 1; } }\n@media (prefers-reduced-motion: reduce) { .wave-track span { animation: none; } }'
};

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const value = snippets[button.dataset.copy];
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      announcement.textContent = button.dataset.copy + ' code copied.';
      button.textContent = 'Copied ✓';
    } catch {
      announcement.textContent = 'Clipboard permission unavailable. Copy the example from the README instead.';
    }
  });
}
