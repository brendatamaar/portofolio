---
title: What the first 14 kilobytes buy you
description: Why the first round trip of a page matters more than its total size, where the 14 kB number comes from, and what I put inside it.
date: 2026-08-14
tags: [performance, html]
placeholder: true
---

You will see “keep your critical HTML under 14 kB” in a lot of performance advice. It is a good rule, and it is worth knowing why, because the reason also tells you when it stops being true.

## Where the number comes from

A new TCP connection does not send data as fast as it can. It starts with a small congestion window and grows it as acknowledgements come back. Since RFC 6928, the usual initial window is 10 segments. A segment carries about 1,460 bytes of payload on a typical network, so the first flight of data is roughly 14.6 kB.

Anything that fits in that first flight arrives after one round trip. Anything bigger needs a second round trip, and often a third. On a fibre connection a round trip is a few milliseconds. On a phone it can be well over 100 ms, and that is the gap your visitor sees as a blank screen.

## The honest caveats

The rule is a simplification, and I would rather know where it bends.

- **TLS takes room.** The certificate exchange happens before your HTML, and with TLS 1.3 it usually costs one round trip on a fresh connection. The 14 kB is what you get after that.
- **Compression counts in your favour.** The limit applies to bytes on the wire. 14 kB of gzip or Brotli is often 50 kB or more of HTML.
- **HTTP/3 runs over QUIC, not TCP**, but QUIC uses a similar initial window, so the advice holds.
- **Servers can be tuned** to start with a larger window. Many CDNs do. You rarely control that, so I plan for the default.

## What I put in the first flight

The point is not to make the page tiny. It is to make the first 14 kB useful on its own:

1. The `<head>` with the title, the meta tags and preload hints for the one font and the one image the first screen needs.
2. The CSS for the first screen, inlined. Not the whole stylesheet, only what styles what is visible before scrolling.
3. The HTML of the first screen itself, as real text, so it can paint before any script runs.

Everything else, the rest of the CSS, the scripts, the images below the fold, can come in later round trips, because by then the visitor is already reading.

## Checking it

`curl --compressed -so /dev/null -w '%{size_download}\n' https://brendatama.dev/` prints the compressed size of this site’s home page HTML. If it is well under 14 kB, the first screen arrives in one trip. If it is over, I look at what is inlined that does not need to be: a large SVG, JSON for a client framework, or CSS for a footer nobody has scrolled to yet.

This page you are reading is built to the same rule. The home page draws the requests it took to load you, and the first row is always the smallest one that matters most.
