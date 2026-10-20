// Global motion for this site: runs once on the client, before the first page initializes.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, onPage, onScroll, prefersReducedMotion, setTransition } from '../engine';
import { net } from './net';
import { startWaterfall } from './waterfall';
import { startVisit } from './visit';

export function setupMotion() {
  transition();
  startWaterfall();
  startVisit();
  frame();
  readingProgress();
  stickers();
  rail();
  requestPath();
  notFound();
}

// Navigation is four requests: colored bands stream in from the left one after another, like rows
// of a waterfall, while the next page is fetched; then the real status and time, and they stream
// off to the right.
function transition() {
  let crawl: gsap.core.Tween | null = null;
  const parts = (c: HTMLElement) => ({
    bands: c.querySelectorAll<HTMLElement>('.curtain__band'),
    req: c.querySelector<HTMLElement>('.curtain__req')!,
    path: c.querySelector<HTMLElement>('[data-req-path]')!,
    status: c.querySelector<HTMLElement>('[data-req-status]')!,
    bar: c.querySelector<HTMLElement>('.curtain__bar > span')!,
  });
  setTransition({
    leave: (c) => {
      const { bands, req, path, status, bar } = parts(c);
      path.textContent = net.to;
      status.textContent = 'pending';
      gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' });
      crawl = gsap.to(bar, { scaleX: 0.85, duration: 2, ease: 'power2.out', delay: 0.45 }); // honest: it waits for the fetch
      document.documentElement.classList.add('is-navigating');
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .set(req, { autoAlpha: 0 })
        .fromTo(bands, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: ease.inOut, stagger: 0.07 }, 0)
        .to(req, { autoAlpha: 1, duration: 0.25 }, 0.55);
    },
    enter: (c) => {
      const { bands, req, status, bar } = parts(c);
      crawl?.kill();
      status.textContent = `${statusOf(net.to)}  ${Math.max(1, Math.round(net.ms))} ms`;
      return gsap.timeline()
        .to(bar, { scaleX: 1, duration: 0.25, ease: ease.soft })
        .to(req, { autoAlpha: 0, duration: 0.2 }, '+=0.15')
        .to(bands, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.6, ease: ease.inOut, stagger: 0.07 }, '<')
        .add(() => document.documentElement.classList.remove('is-navigating'))
        .set(c, { autoAlpha: 0 });
    },
  });
}

// Stickers pop on like they were slapped onto the page; the badge keeps turning (the idle state).
function stickers() {
  onPage(({ intro }) => {
    if (prefersReducedMotion()) return;
    const pops = gsap.utils.toArray<HTMLElement>('[data-sticker], [data-pop]');
    pops.forEach((el) => {
      const inHero = !!el.closest('.hero, .nf');
      // scale only: each sticker keeps its own CSS tilt
      const from = { scale: 0, opacity: 0 };
      const to = { scale: 1, opacity: 1, duration: 0.7, ease: ease.spring };
      if (inHero) intro.add(gsap.fromTo(el, from, to), 0.25 + Math.random() * 0.35);
      else gsap.fromTo(el, from, { ...to, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    document.querySelectorAll('.sticker__ring').forEach((ring) => gsap.to(ring, { rotate: 360, duration: 24, ease: 'none', repeat: -1 }));
  });
}

// Projects rail: native horizontal scroll with snap; the buttons move it one card at a time.
function rail() {
  onPage(() => {
    const list = document.querySelector<HTMLElement>('[data-rail]');
    if (!list) return;
    const prev = document.querySelector<HTMLButtonElement>('[data-rail-prev]');
    const next = document.querySelector<HTMLButtonElement>('[data-rail-next]');
    const step = () => (list.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? list.clientWidth;
    const sync = () => {
      if (prev) prev.disabled = list.scrollLeft < 4;
      if (next) next.disabled = list.scrollLeft + list.clientWidth > list.scrollWidth - 4;
    };
    const go = (dir: number) => list.scrollBy({ left: dir * (step() + 24), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    list.addEventListener('scroll', sync, { passive: true }); // the rail's own scroll, not the page's
    sync();
    return () => { prev?.removeEventListener('click', onPrev); next?.removeEventListener('click', onNext); list.removeEventListener('scroll', sync); };
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

// Case pages: each stage of the request path streams its bar as it scrolls in, in order.
function requestPath() {
  onPage(() => {
    const path = document.querySelector<HTMLElement>('[data-path]');
    if (!path || prefersReducedMotion()) return;
    path.querySelectorAll<HTMLElement>('.path__stage').forEach((stage) => {
      const bar = stage.querySelector('.path__bar');
      const text = stage.querySelectorAll('.path__n, .path__name, .path__text');
      gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' });
      gsap.set(text, { opacity: 0, x: -12 });
      ScrollTrigger.create({
        trigger: stage,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(bar, { scaleX: 1, duration: 1, ease: ease.out });
          gsap.to(text, { opacity: 1, x: 0, duration: 0.8, ease: ease.out, stagger: 0.05, delay: 0.1 });
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
