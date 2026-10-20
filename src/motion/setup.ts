// Global motion for this site: runs once on the client, before the first page initializes.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, onPage, onScroll, prefersReducedMotion, setLoaderExit, setLoaderFormat, setTransition } from '../engine';
import { net } from './net';
import { startWaterfall, streamWhileLoading } from './waterfall';
import { startVisit } from './visit';

export function setupMotion() {
  loader();
  transition();
  startWaterfall();
  startVisit();
  frame();
  readingProgress();
  workTimeline();
  requestPath();
  notFound();
}

// Loader: the counter is real elapsed time since the navigation started. On the home page the
// table travels down into the hero, where the same rows are waiting; elsewhere it streams out.
function loader() {
  setLoaderFormat(() => `${String(Math.round(performance.now())).padStart(4, '0')} ms`);
  const stop = streamWhileLoading();
  document.addEventListener('loader:done', stop, { once: true });
  setLoaderExit((root) => {
    const from = root.querySelector<HTMLElement>('.loader__wf');
    const to = document.querySelector<HTMLElement>('[data-waterfall="hero"]');
    const tl = gsap.timeline();
    tl.to(root.querySelectorAll('[data-loader-out]'), { autoAlpha: 0, y: -12, duration: 0.35, ease: ease.soft, stagger: 0.04 }, 0);
    if (from && to) {
      const dy = to.getBoundingClientRect().top - from.querySelector('.wf')!.getBoundingClientRect().top;
      tl.to(from, { y: dy, duration: 0.75, ease: ease.inOut }, 0)
        .to(root, { backgroundColor: 'rgb(233 235 238 / 0)', duration: 0.4, ease: ease.soft }, 0.35);
    } else {
      tl.to(root, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.75, ease: ease.inOut }, 0.05);
    }
    return tl;
  });
}

// Navigation is a request: a panel streams across from the left while the next page is fetched,
// then reports the real status and time before it streams off to the right.
function transition() {
  let crawl: gsap.core.Tween | null = null;
  const parts = (c: HTMLElement) => ({
    panel: c.querySelector<HTMLElement>('.curtain__panel')!,
    req: c.querySelector<HTMLElement>('.curtain__req')!,
    path: c.querySelector<HTMLElement>('[data-req-path]')!,
    status: c.querySelector<HTMLElement>('[data-req-status]')!,
    bar: c.querySelector<HTMLElement>('.curtain__bar > span')!,
  });
  setTransition({
    leave: (c) => {
      const { panel, req, path, status, bar } = parts(c);
      path.textContent = net.to;
      status.textContent = 'pending';
      gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' });
      crawl = gsap.to(bar, { scaleX: 0.85, duration: 2, ease: 'power2.out', delay: 0.3 }); // honest: it waits for the fetch
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo(panel, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.7, ease: ease.inOut })
        .fromTo(req, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: ease.soft }, 0.3);
    },
    enter: (c) => {
      const { panel, req, status, bar } = parts(c);
      crawl?.kill();
      status.textContent = `${statusOf(net.to)}  ${Math.max(1, Math.round(net.ms))} ms`;
      return gsap.timeline()
        .to(bar, { scaleX: 1, duration: 0.25, ease: ease.soft })
        .to(req, { autoAlpha: 0, x: 16, duration: 0.3, ease: ease.soft }, '+=0.12')
        .to(panel, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.75, ease: ease.inOut }, '<')
        .set(c, { autoAlpha: 0 });
    },
  });
}

// The real status of the page fetch, from Resource Timing (Chromium, Firefox); the swapped-in page
// tells us when the browser does not report it.
function statusOf(path: string) {
  const url = new URL(path, location.href).href;
  const hit = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).filter((e) => e.name === url).pop();
  const code = (hit as PerformanceResourceTiming & { responseStatus?: number } | undefined)?.responseStatus;
  if (code === 404 || (!code && document.querySelector('[data-notfound]'))) return '404 Not Found';
  return code && code !== 200 ? String(code) : '200 OK';
}

// Corner frame: steps aside while reading down, returns (on a solid ground) on the way up.
function frame() {
  let last = 0;
  const h = document.documentElement.classList;
  onScroll(({ y }) => {
    h.toggle('frame-solid', y > 24);
    if (Math.abs(y - last) < 4) return;
    h.toggle('frame-away', y > 200 && y > last);
    last = y;
  });
  document.addEventListener('astro:after-swap', () => h.remove('frame-away', 'frame-solid'));
}

// Posts: reading progress streams along the header like a download.
function readingProgress() {
  onPage(() => {
    const bar = document.querySelector<HTMLElement>('[data-progress]');
    const prose = document.querySelector<HTMLElement>('.prose');
    if (!bar || !prose) return;
    const set = gsap.quickSetter(bar, 'scaleX');
    const update = () => {
      const r = prose.getBoundingClientRect();
      const p = gsap.utils.clamp(0, 1, (innerHeight * 0.5 - r.top) / r.height);
      set(p);
    };
    update();
    const off = onScroll(update); // the engine publishes native scroll too under reduced motion
    return () => { off(); };
  });
}

// Work timeline: each project's bar streams in across the years it ran when the list arrives.
function workTimeline() {
  onPage(() => {
    const list = document.querySelector<HTMLElement>('[data-work]');
    if (!list || prefersReducedMotion()) return;
    const bars = list.querySelectorAll('.row__bar');
    const text = list.querySelectorAll('.row__title, .row__meta, .row__year');
    gsap.set(bars, { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(text, { autoAlpha: 0, y: 14 });
    ScrollTrigger.create({
      trigger: list,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(text, { autoAlpha: 1, y: 0, duration: 0.9, ease: ease.out, stagger: 0.04 });
        gsap.to(bars, { scaleX: 1, duration: 1.1, ease: ease.out, stagger: 0.09, delay: 0.15 });
      },
    });
  });
}

// Case pages: each stage of the request path streams its bar as it scrolls in, in order.
function requestPath() {
  onPage(() => {
    const path = document.querySelector<HTMLElement>('[data-path]');
    if (!path || prefersReducedMotion()) return;
    path.querySelectorAll<HTMLElement>('.path__stage').forEach((stage) => {
      const bar = stage.querySelector('.path__bar');
      const text = stage.querySelectorAll('.path__n, .path__name, .path__text');
      gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' });
      gsap.set(text, { autoAlpha: 0, x: -12 });
      ScrollTrigger.create({
        trigger: stage,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(bar, { scaleX: 1, duration: 1, ease: ease.out });
          gsap.to(text, { autoAlpha: 1, x: 0, duration: 0.8, ease: ease.out, stagger: 0.05, delay: 0.1 });
        },
      });
    });
  });
}

// 404: fill in the path and the real time it took to learn there was nothing here.
function notFound() {
  onPage(({ intro }) => {
    const t = document.querySelector<HTMLElement>('[data-notfound]');
    if (!t) return;
    const path = t.querySelector<HTMLElement>('[data-nf-path]');
    const time = t.querySelector<HTMLElement>('[data-nf-time]');
    const bar = t.querySelector<HTMLElement>('[data-nf-bar]');
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const ms = net.navigated ? net.ms : nav?.responseEnd ?? 0;
    if (path) path.textContent = location.pathname;
    if (time && ms) time.textContent = `${Math.max(1, Math.round(ms))} ms`;
    if (bar && !prefersReducedMotion()) intro.add(gsap.from(bar, { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: ease.out }), 0.1);
  });
}
