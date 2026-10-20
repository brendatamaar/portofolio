// The concept's driver: the browser's own Resource Timing entries, drawn as a network waterfall.
// One source (performance entries + elapsed time since load) feeds every visual that carries the
// concept: the live table, the hero's load-time pill and stat cards, the footer colophon and the
// open "you" row that keeps growing while the visitor stays (the idle state).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, onPage, prefersReducedMotion } from '../engine';
import { net } from './net';
import { clock } from './visit';

type Row = { key: string; name: string; type: string; size: string; start: number; end: number; bytes: number };

const MAX_ROWS = 8; // more than this and the table stops being readable on a phone
const REQ = 0.72; // share of the track for the requests
const OPEN = 0.77; // where the open visit begins; the gap between is the axis break

const entries = () => performance.getEntriesByType('resource') as PerformanceResourceTiming[];
const navEntry = () => performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;

function kind(e: PerformanceResourceTiming) {
  const ext = new URL(e.name).pathname.split('.').pop() ?? '';
  if (/^(woff2?|ttf|otf)$/.test(ext)) return 'font';
  if (ext === 'css') return 'stylesheet';
  if (/^m?js$/.test(ext) || e.initiatorType === 'script') return 'script';
  if (/^(png|jpe?g|webp|avif|gif|svg|ico)$/.test(ext) || e.initiatorType === 'img') return 'image';
  if (e.initiatorType === 'fetch' || e.initiatorType === 'xmlhttprequest') return 'fetch';
  return e.initiatorType || 'other';
}

function label(url: string) {
  const p = new URL(url, location.href).pathname;
  // Astro names component scripts Base.astro_astro_type_script_index_0_lang.<hash>.js: keep Base.<hash>.js
  const f = (p.endsWith('/') ? p : p.split('/').pop() || p).replace(/\.astro_astro_type_script_index_\d+_lang/, '');
  return f.length > 24 ? `${f.slice(0, 11)}…${f.slice(-10)}` : f;
}

export const kb = (b: number) => (b < 1000 ? `${b} B` : `${(b / 1000).toFixed(1)} kB`);
const bytesOf = (e: PerformanceResourceTiming) => e.transferSize || 0;
const sizeOf = (e: PerformanceResourceTiming) => (e.transferSize === 0 && e.decodedBodySize > 0 ? 'cache' : kb(e.transferSize || e.encodedBodySize));
const isPage = (e: PerformanceResourceTiming) => new URL(e.name).pathname.endsWith('/'); // prefetched HTML

/** Requests of the first, full page load (prefetches of other pages are not part of it). */
function firstLoad(): Row[] {
  const nav = navEntry();
  const rows: Row[] = [];
  if (nav) rows.push({ key: 'doc', name: location.pathname, type: 'document', size: sizeOf(nav), start: 0, end: nav.responseEnd, bytes: bytesOf(nav) });
  for (const e of entries()) {
    if (isPage(e) || e.startTime > firstLoadEnd) continue;
    rows.push({ key: e.name, name: label(e.name), type: kind(e), size: sizeOf(e), start: e.startTime, end: e.responseEnd, bytes: bytesOf(e) });
  }
  return rows.sort((a, b) => a.start - b.start);
}

/** After a soft navigation only the HTML travels; everything else is already in memory. */
function softLoad(base: Row[]): Row[] {
  const url = new URL(net.to, location.href).href;
  const hit = entries().filter((e) => e.name === url).pop();
  const doc: Row = { key: 'doc', name: net.to, type: 'document', size: hit ? sizeOf(hit) : 'fetch', start: 0, end: net.ms, bytes: hit ? bytesOf(hit) : 0 };
  return [doc, ...base.filter((r) => r.key !== 'doc').map((r) => ({ ...r, size: 'memory', start: net.ms, end: net.ms, bytes: 0 }))];
}

let firstLoadEnd = Infinity; // set after the load event; later entries are not part of the first load
let baseRows: Row[] = [];
let loadedAt = 0; // performance.now() when the current view finished loading

function summary(rows: Row[]) {
  const total = rows.length;
  const end = Math.max(1, ...rows.map((r) => r.end));
  const bytes = rows.reduce((n, r) => n + r.bytes, 0);
  return { total, end, bytes };
}

const fmtMs = (ms: number) => `${Math.round(ms)} ms`;

// ---------- rendering ----------

function axis(el: HTMLElement | null, end: number, open: boolean) {
  if (!el) return;
  const cls = ['wf__tick', 'wf__tick wf__tick--mid', 'wf__tick wf__tick--end'];
  const ticks = [0, end / 2, end].map((t, i) => `<span style="--x:${((t / end) * REQ).toFixed(4)}" class="${cls[i]}">${fmtMs(t)}</span>`);
  if (open) ticks.push(`<span class="wf__break" style="--x:${((REQ + OPEN) / 2).toFixed(4)}">//</span>`, `<span class="wf__tick wf__tick--now" style="--x:1">now</span>`);
  el.innerHTML = ticks.join('');
}

function rowHTML(r: Row, end: number) {
  const x = (r.start / end) * REQ;
  const w = Math.max(0, ((r.end - r.start) / end) * REQ);
  return `<td class="wf__c-name"><span>${r.name}</span></td><td class="wf__c-type">${r.type}</td><td class="wf__c-size">${r.size}</td><td class="wf__c-time">${fmtMs(r.end - r.start)}</td><td class="wf__c-bar"><span class="wf__track"><span class="wf__bar" style="--x:${x.toFixed(4)};--w:${w.toFixed(4)}"></span></span></td>`;
}

function visible(rows: Row[]) {
  if (rows.length <= MAX_ROWS) return rows;
  const shown = rows.slice(0, MAX_ROWS - 1);
  const rest = rows.slice(MAX_ROWS - 1);
  const start = Math.min(...rest.map((r) => r.start));
  const end = Math.max(...rest.map((r) => r.end));
  const bytes = rest.reduce((n, r) => n + r.bytes, 0);
  return [...shown, { key: 'rest', name: `${rest.length} more`, type: 'mixed', size: kb(bytes), start, end, bytes }];
}

/** Draw rows into one table. New rows stream in; existing rows only update. */
function draw(table: HTMLElement, rows: Row[], { open = false, animate = true } = {}) {
  const body = table.querySelector<HTMLElement>('[data-wf-rows]');
  if (!body) return;
  body.querySelector('.wf__empty')?.remove();
  const { end } = summary(rows);
  axis(table.querySelector('[data-wf-axis]'), end, open);
  const fresh: HTMLElement[] = [];
  for (const r of visible(rows)) {
    let tr = body.querySelector<HTMLElement>(`tr[data-key="${CSS.escape(r.key)}"]`);
    if (!tr) {
      tr = document.createElement('tr');
      tr.dataset.key = r.key;
      tr.dataset.type = r.type;
      body.insertBefore(tr, body.querySelector('.wf__you'));
      fresh.push(tr);
    }
    tr.innerHTML = rowHTML(r, end);
  }
  if (open && !body.querySelector('.wf__you')) {
    const tr = document.createElement('tr');
    tr.className = 'wf__you';
    tr.innerHTML = `<td class="wf__c-name"><span>you</span></td><td class="wf__c-type">visit</td><td class="wf__c-size">open</td><td class="wf__c-time" data-you-time>${prefersReducedMotion() ? 'pending' : '00:00.0'}</td><td class="wf__c-bar"><span class="wf__track"><span class="wf__bar wf__bar--open" data-pending style="--x:${OPEN};--w:${(1 - OPEN).toFixed(4)}"><span data-you-bar></span></span></span></td>`;
    body.appendChild(tr);
    fresh.push(tr);
  }
  if (animate && fresh.length && !prefersReducedMotion()) {
    gsap.from(fresh.map((tr) => tr.querySelector('.wf__bar')), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.8, ease: ease.out, stagger: 0.04 });
    gsap.from(fresh.map((tr) => tr.querySelectorAll('td:not(.wf__c-bar)')), { autoAlpha: 0, x: -8, duration: 0.5, ease: ease.soft, stagger: 0.04 });
  }
}

function writeSummary(rows: Row[], soft: boolean) {
  const { total, end, bytes } = summary(rows);
  const doc = rows[0];
  const set = (sel: string, text: string) => document.querySelectorAll<HTMLElement>(sel).forEach((el) => (el.textContent = text));
  set('[data-live-ms]', fmtMs(end));
  set('[data-stat="ms"]', fmtMs(end));
  set('[data-stat="req"]', soft ? '1' : String(total));
  set('[data-stat="kb"]', soft ? (doc?.bytes ? kb(doc.bytes) : 'cache') : kb(bytes));
  const colophon = document.querySelector<HTMLElement>('[data-colophon]');
  if (colophon) colophon.textContent = soft ? `This page came over in ${fmtMs(end)}.` : `This page: ${total} requests, ${kb(bytes)}, ${fmtMs(end)}.`;
}

// ---------- lifecycle ----------

/** The first load is over once the window has loaded; later entries (prefetches) are not part of it. */
const firstLoadDone = new Promise<void>((resolve) => {
  const done = () => setTimeout(() => {
    firstLoadEnd = performance.now();
    baseRows = firstLoad();
    loadedAt = performance.now();
    resolve();
  }, 60);
  if (document.readyState === 'complete') done();
  else addEventListener('load', done, { once: true });
});

/** Fill the live table, the stat cards and the colophon; the open "you" row grows while in view. */
export function startWaterfall() {
  onPage(() => {
    let alive = true;
    const table = document.querySelector<HTMLElement>('[data-waterfall="hero"]');
    const render = () => {
      if (!alive) return;
      const soft = net.navigated;
      if (soft) loadedAt = performance.now();
      const rows = soft ? softLoad(baseRows) : baseRows;
      writeSummary(rows, soft);
      if (!table) return;
      draw(table, rows, { open: true, animate: false });
      if (prefersReducedMotion()) return;
      // bars stream in when the table scrolls into view
      const bars = table.querySelectorAll('.wf__bar');
      gsap.set(bars, { scaleX: 0, transformOrigin: '0% 50%' });
      ScrollTrigger.create({ trigger: table, start: 'top 85%', once: true, onEnter: () => gsap.to(bars, { scaleX: 1, duration: 0.9, ease: ease.out, stagger: 0.05 }) });
    };
    if (net.navigated) render();
    else firstLoadDone.then(render);

    if (!table || prefersReducedMotion()) return () => { alive = false; };
    const tick = () => {
      const bar = table.querySelector<HTMLElement>('[data-you-bar]');
      const time = table.querySelector<HTMLElement>('[data-you-time]');
      if (!bar || !time || !loadedAt) return;
      const s = (performance.now() - loadedAt) / 1000;
      gsap.set(bar, { scaleX: 1 - Math.exp(-s / 45) }); // eases toward the edge, never reaches it
      time.textContent = clock(performance.now());
    };
    const st = ScrollTrigger.create({
      trigger: table,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
    });
    if (st.isActive) gsap.ticker.add(tick);
    return () => { alive = false; gsap.ticker.remove(tick); };
  });
}
