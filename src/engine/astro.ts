// Astro adapter (ClientRouter). Call start(setup) once from the layout's <script>.
// The leave animation runs IN PARALLEL with fetching the next page, so transitions add no latency.
import { boot, cleanup, enter, leave, syncFlags } from './index';
import { net } from '../motion/net';

let navigating = false;

export function start(setup?: () => void) {
  document.addEventListener('astro:before-preparation', (e) => {
    navigating = true;
    net.to = e.to.pathname;
    net.start = performance.now();
    net.ms = 0;
    const load = e.loader;
    e.loader = async () => {
      await Promise.all([leave(), load().then(() => { net.ms = performance.now() - net.start; })]);
    };
  });
  document.addEventListener('astro:before-swap', () => cleanup());
  document.addEventListener('astro:after-swap', () => {
    syncFlags(); // Astro replaces <html> attributes; restore flags before paint
    document.documentElement.classList.add('is-loaded');
    if (document.querySelector('#curtain')) document.documentElement.classList.add('is-navigating'); // swap resets <html> classes mid-transition
    document.getElementById('loader')?.remove(); // the loader is first-load only
  });
  document.addEventListener('astro:page-load', () => {
    if (!navigating) return void boot(setup); // first load (boot is idempotent)
    navigating = false;
    net.navigated = true;
    enter().then(() => document.documentElement.classList.remove('is-navigating'));
  });
  // Module scripts run after parsing: boot now instead of waiting for the first astro:page-load.
  boot(setup);
}
