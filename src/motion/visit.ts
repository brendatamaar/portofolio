// The visit as one open request: the header clock counts from the moment you arrived and survives
// navigation (transition:persist), and every pending bar's stripes crawl like an unfinished
// download. This is the idle state: it runs on the GSAP ticker and holds still under reduced motion.
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../engine';

export const clock = (ms: number) => {
  const s = ms / 1000;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`;
};

export function startVisit() {
  if (prefersReducedMotion()) return;
  let shown = '';
  gsap.ticker.add(() => {
    const now = performance.now();
    const text = clock(now);
    if (text !== shown) {
      shown = text;
      document.querySelectorAll<HTMLElement>('[data-visit]').forEach((el) => (el.textContent = text));
    }
    const x = `${((now / 1000) * 10) % 10}px 0`; // one 10 px stripe a second: a calm crawl
    document.querySelectorAll<HTMLElement>('[data-pending]').forEach((el) => (el.style.backgroundPosition = x));
  });
}
