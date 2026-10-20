---
title: Read the waterfall before you read the code
description: How I use the browser’s network waterfall to find why a page is slow before opening a single source file, and the five shapes that show up again and again.
date: 2026-09-28
tags: [performance, devtools]
placeholder: true
---

When someone tells me a page is slow, the first thing I open is not the repository. It is the Network panel, with the cache disabled and the connection throttled to something like a mid-range phone on 4G. The waterfall tells me where the time goes, and it is usually faster to read than the code that caused it.

This site draws its own waterfall on the home page for the same reason. It is the clearest picture of a page load that we have.

## What one row means

Every row is one request. Hover the bar in Chrome or Firefox and it splits into phases:

- **Queueing and stalled:** the browser knows it wants the file but has not sent the request yet. Usually it is waiting for a connection or for a higher priority request.
- **DNS, connect and TLS:** the cost of reaching a new origin. You pay it once per origin, which is why every third-party domain on a page has a price.
- **Waiting (TTFB):** the request has been sent and nothing has come back yet. This is the server thinking, or a cache missing.
- **Content download:** bytes arriving. Long bars here mean big files or a slow link.

Most performance work is making one of those phases shorter or making a row disappear.

## Shape one: the staircase

Rows that start only when the previous one ends, stepping down and to the right. The HTML loads a script, the script loads a module, the module fetches a config, the config names a font. Each step is a full round trip, and on a phone a round trip is easily 100 ms or more.

<figure class="shape"><table><thead><tr><th>Name</th><th>Waterfall</th></tr></thead><tbody><tr><td>/</td><td><i style="--x:0;--w:.14"></i></td></tr><tr><td>app.js</td><td><i style="--x:.15;--w:.17"></i></td></tr><tr><td>chunk-a.js</td><td><i style="--x:.33;--w:.17"></i></td></tr><tr><td>config.json</td><td><i style="--x:.51;--w:.16"></i></td></tr><tr><td>font.woff2</td><td><i style="--x:.68;--w:.2"></i></td></tr></tbody></table><figcaption>Illustration: every request starts only when the one before it ends.</figcaption></figure>


The fix is almost never to make each file faster. It is to tell the browser earlier. Put the request in the HTML (`<link rel="preload">`, `<link rel="modulepreload">`), inline what is tiny, or move the fetch to the server so the data arrives with the page.

## Shape two: one long first row

The document itself has a long waiting phase and everything else is pushed right. Nothing in the front end can fix that, because the browser cannot discover any other file until the HTML starts arriving.

<figure class="shape"><table><thead><tr><th>Name</th><th>Waterfall</th></tr></thead><tbody><tr><td>/</td><td><i class="is-wait" style="--x:0;--w:.56;--t:82%"></i></td></tr><tr><td>style.css</td><td><i style="--x:.57;--w:.14"></i></td></tr><tr><td>app.js</td><td><i style="--x:.57;--w:.2"></i></td></tr><tr><td>font.woff2</td><td><i style="--x:.72;--w:.12"></i></td></tr></tbody></table><figcaption>Illustration: the light part of the first bar is waiting on the server; nothing else can start.</figcaption></figure>


Look at what the server does before it sends the first byte. The usual causes are a database query that waits on another query, a session lookup on every request, or rendering the whole page before flushing any of it. Streaming the `<head>` early lets the browser start on CSS and fonts while the server finishes the body.

## Shape three: a gap with nothing in it

All requests finish, then there is white space in the waterfall, then more requests start. The network was idle because the main thread was busy: parsing and running a large script before it could ask for anything else.

<figure class="shape"><table><thead><tr><th>Name</th><th>Waterfall</th></tr></thead><tbody><tr><td>/</td><td><i style="--x:0;--w:.12"></i></td></tr><tr><td>app.js</td><td><i style="--x:.13;--w:.18"></i></td></tr><tr><td>main thread</td><td><i class="is-gap" style="--x:.32;--w:0;--gx:.32;--gw:.3"></i></td></tr><tr><td>data.json</td><td><i style="--x:.63;--w:.14"></i></td></tr><tr><td>photo.jpg</td><td><i style="--x:.63;--w:.22"></i></td></tr></tbody></table><figcaption>Illustration: the network sits idle while a script runs; the hatched span is the main thread, not a request.</figcaption></figure>


The waterfall only shows you the gap. Switch to the Performance panel to see what ran. The answer is usually less JavaScript, or the same JavaScript later.

## Shape four: the wide fan

Dozens of requests start at the same moment and all of them crawl. Over HTTP/2 they share one connection, so a hundred icons and a hero image compete for the same bandwidth, and the image you care about arrives last.

<figure class="shape"><table><thead><tr><th>Name</th><th>Waterfall</th></tr></thead><tbody><tr><td>/</td><td><i style="--x:0;--w:.1"></i></td></tr><tr><td>icon-1.svg</td><td><i style="--x:.11;--w:.5"></i></td></tr><tr><td>icon-2.svg</td><td><i style="--x:.11;--w:.55"></i></td></tr><tr><td>icon-3.svg</td><td><i style="--x:.11;--w:.6"></i></td></tr><tr><td>vendor.js</td><td><i style="--x:.11;--w:.66"></i></td></tr><tr><td>hero.jpg</td><td><i style="--x:.11;--w:.82"></i></td></tr></tbody></table><figcaption>Illustration: everything starts at once and shares the connection, so the image that matters lands last.</figcaption></figure>


Priorities help: `fetchpriority="high"` on the image that is the largest contentful paint, `loading="lazy"` on images below the fold, and fewer requests overall. A sprite or an inline SVG beats forty icon files.

## Shape five: the late font

Text appears, then jumps, and in the waterfall the font file starts after the CSS finishes. The browser only discovers a font when it parses the rule that uses it.

<figure class="shape"><table><thead><tr><th>Name</th><th>Waterfall</th></tr></thead><tbody><tr><td>/</td><td><i style="--x:0;--w:.12"></i></td></tr><tr><td>style.css</td><td><i style="--x:.13;--w:.17"></i></td></tr><tr><td>app.js</td><td><i style="--x:.13;--w:.22"></i></td></tr><tr><td>font.woff2</td><td><i style="--x:.31;--w:.26"></i></td></tr></tbody></table><figcaption>Illustration: the font is only discovered once the stylesheet is parsed.</figcaption></figure>


Preload the one or two font files that the first screen needs, serve them from your own origin so there is no extra connection, and use `font-display: swap` with a fallback whose metrics are close enough that the swap does not move the layout.

## A habit, not a tool

None of this needs a monitoring product. I keep the throttled waterfall open while I build and look at it after any change that adds a request. The best performance fix is the request you never added.
