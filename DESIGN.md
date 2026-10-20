# Brendatama Akbar: design notes

> **Current style (v2, October 2026):** restyled after the owner pointed at a colorful Framer
> template (navy hero, condensed uppercase display, multi-color headline words, bento cards in
> saturated colors with a bitten corner, tilted pill tags, stickers, accordion, FAQ, CTA card,
> giant footer wordmark). The concept below is unchanged: the site still shows its own network
> waterfall. What changed is the look, and the bridge is honest: network tools color requests by
> type, so the card colors are the waterfall legend (document orange, stylesheet lavender, script
> lime, font coral, image green). The full-screen loader is gone; the waterfall lives in its own
> section and the hero's live pill shows the real load time. See "v2 system" at the end.
>
> The sections between here and "v2 system" describe v1 (the light network panel) and are kept
> for history.

## Brief

- **Subject:** Brendatama Akbar, web software developer (front end through back end).
- **Audience:** hiring managers and tech leads at product companies; founders and agencies
  looking for a contractor who can own a web app end to end.
- **Job of the site:** get hired or booked; show that he writes and thinks clearly (blog).
- **Assets provided:** none. No photos, no project list, no links.
- **Language:** English.
- **Assumptions** (all marked `placeholder: true` in `src/data/site.ts` and in post frontmatter):
  the four projects, their clients, years and stacks; the blog posts are drafts in his voice;
  email, GitHub and LinkedIn handles; domain `brendatama.dev`; availability line. No location is
  stated because none was given.

## Concepts

| | A. The network panel (material) | B. Commit history (process) | C. The box model (formal) |
|---|---|---|---|
| Idea | The site measures itself: every page opens with its own real network waterfall, and the work is laid out as requests on a timeline | The site is a git log: projects are branches, posts are commits, scrolling walks history | Every element shows its real content, padding and margin like an inspector overlay |
| Anchor | His craft is the thing every visitor waits on: load time. The browser already records it; the site just shows it | Developers keep history | The web's own layout model |
| Layout | Table rows with a time axis: name, size, time, bar | One vertical rail, branches off it | Visible guides around every block |
| Motion verb | stream: things extend left to right like bytes arriving, then settle | branch and merge | measure and snap |
| Signature | Loader = the page's real resource waterfall (PerformanceObserver); one row stays open and keeps growing while you stay. Page transitions are a request bar that resolves with the measured time | the rail draws as you scroll | hover reveals live box measurements |
| Screenshot | Giant name over six real rows with ms values and the open "you" row still growing | graph with merges | name wrapped in orange/green margin boxes |
| O / F / Fe / P | 4 / 5 / 4 / 3 | 2 / 4 / 5 / 4 | 3 / 4 / 4 / 3 |

**Pick A.** It is the only one built on honest live data, it proves the claim (fast sites) instead
of stating it, and it survives to the footer (the page's own load time), the case pages (a build
budget per project), the blog (reading progress as a download) and the 404 (a red 404 row).
Stolen from B: the blog index is called the log in copy, listed newest first with dates in mono.

## Concept card

```
Idea:        The site shows you how fast it loaded you, live, and lays out his work the same way.
Metaphor:    The browser's Network panel: requests, sizes, timings, waterfall bars, status codes.
Signature:   The loader draws this page's real resource waterfall as files arrive, then the rows
             settle into the hero; the last row ("you, connected") stays open and keeps growing.
             Navigation is a request: a bar streams across the screen as "GET /blog/" and
             resolves with the real measured fetch time.
Emotion:     Precise and quick, with a bit of pride: "it's fast, and here is the proof".
Motion verb: Stream: things extend left to right like bytes arriving, then settle.
Screenshot:  BRENDATAMA AKBAR at full width over six real request rows, the open row still running.
```

## System

**Palette** (from a light DevTools panel, not a dark terminal):

| Role | Hex | Use |
|---|---|---|
| ground | `#E9EBEE` | page, panel gray |
| ink | `#0D0F12` | text, curtain |
| muted | `#575D66` | secondary text (5.7:1 on ground) |
| line | `rgb(13 15 18 / 0.14)` | table rules |
| accent | `#1D45F0` | request blue: bars in flight, focus ring, inline link line (5.6:1) |
| signal | `#C4241A` | status errors only (404) |

**Type:** Archivo variable (Google, OFL), width 62 to 125 and weight 100 to 900. Display is
Archivo at width 125, weight 800, uppercase, tracking -0.045em, leading 0.84. On phones the name
drops to width 62 so it can stay large: the type itself is responsive. Text is Archivo at width
100. JetBrains Mono appears **only** where the data is machine data: methods, paths, sizes, ms,
status codes, dates. No mono eyebrows.

Scale: mega `clamp(3.5rem, 13.2cqi, 15rem)`; xl `clamp(2.4rem, 1.2rem + 5vw, 6.5rem)`; l `clamp(1.6rem, 1.1rem + 2vw, 3rem)`;
m `clamp(1.2rem, 1.05rem + 0.6vw, 1.6rem)`; body `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)`; s 0.875rem; xs 0.75rem.

**Grid:** 12 columns, fluid gutter. Three hanging lines: column 1, column 5, column 9. Text
blocks start on them. Rhythm: hero full viewport; statement airy; work tight rows; log normal;
footer full viewport.

**Shape:** radius 0 everywhere. Bars are 0.5rem tall rectangles.

**Motion:** one family, `expo.out` for entrances, `expo.inOut` for the curtain, `power3.out` for
hovers. Streaming = `scaleX` from `transform-origin: left` or `clip-path: inset(0 100% 0 0)` to 0.
Large things 1.1 to 1.3 s, bars 0.6 to 0.9 s, hovers 0.35 to 0.5 s, stagger 40 ms.

Interaction roles:
- Nav links: underline that streams in from the left (current page keeps it).
- Primary rows (work, posts): the row's bar re-requests: an accent fill streams across it and the
  title steps 0.4em right, like the selected row in the panel.
- Buttons ("Email me"): an ink fill floods left to right, label goes ground color.
- Inline links: underline at rest, rises into an accent band.
- Utility links (social, colophon): color only.

**Idle:** the visit is one open request. A header clock counts from the moment you arrived and
persists across navigation; every pending bar (header, the "you" row, the "Your project" row)
crawls its stripes at one stripe a second, like an unfinished download. On the home page the
"you" bar also eases across the last quarter of the axis, past an axis break, so the real
request bars keep their scale. Everything runs on the GSAP ticker and holds still under reduced
motion ("connected" and "pending" instead of a clock). Inner pages are reading pages: only the
header clock moves there, by decision.

**No WebGL.** The concept is the site's own speed; a canvas would be the slowest row in its own
waterfall. JS budget is the engine without GL.

## Composition plan

```
HOME
┌ BA ───────────────────────────── Work  Blog  About  Email ┐   corner frame
│ BRENDATAMA                                                │   poster: name fills width
│ AKBAR                       Web software developer. I ... │
│ ─────────────────────────────────────────────────────────│
│ name            type   size     time  ▕■■■    ▏          │   live waterfall of this page
│ /               doc    6.1 kB   38ms  ▕■      ▏          │
│ you, connected  ws     open    14.2s  ▕ ■■■■■■■■■■■■■■■■ │
└ Loaded in 412 ms ─────────────────────────── Scroll ──────┘

STATEMENT        col 5 → 12, t-l paragraph, one inline link

WORK             timeline index: axis 2021 … 2026 across cols 7-12
 Night Shift     Dispatch board   2025  ▕      ■■■■■   ▏
 ...             rows open the case study; on phones the bar sits under the title

LOG (blog)       asymmetric: big heading col 1-4 sticky; posts list col 5-12 with date + read time

ABOUT            two columns of plain lists: what I do / tools; short bio paragraph col 1-6

FOOTER           giant "Email me" button-row, socials, colophon: "This page: 7 requests, 142 kB, 412 ms"

CASE /work/x     title poster + meta table (client/year/role/stack) → context / idea / build as
                 numbered request stages (a real sequence) → budget table → next project row
BLOG /blog/      log table: date, title, read time, tags; whole row is the link
POST /blog/x     narrow measure col 4-10, header shows words + minutes; reading progress streams in
                 the header like a download
404              a single red 404 row in the waterfall: "GET /that-path 404 Not Found", way home
```

## Genericness test

- A generic model would put a terminal or code editor in the hero with green-on-black. Changed:
  light panel gray, no code, only the request table, which is real data.
- A generic model would use mono for every label. Changed: mono only for machine values.
- A generic blog would be cards with cover images. Changed: posts are rows in a log with read time.
- A generic dev portfolio fakes app screenshots. Changed: case studies show the request path and
  the budget they were built against, as tables, which is honest and on concept.

## Decisions made in QA

- The loader table grows downward from a fixed top so rows never move once drawn (CLS 0).
  On the home page it then travels down into the hero table, which holds the same rows.
- The hero is anchored from the top, so the open row added after loading only pushes content
  below the fold.
- The fallback font is Arial at `size-adjust: 98.2%`, measured against Archivo 400.
- If the page took over 1.2 s to boot (a slow phone), the loader drops its 0.8 s floor: the
  visitor already waited.
- Size and time in the waterfall are whatever the browser reports. The QA server sent JS
  uncompressed at first (155 kB); a gzip host sends 57 kB and the table shows that.

## v2 system

**Palette:** navy `#0e1a2b` (hero bands, dark cards), white ground, raised `#f3f4f8`, muted
`#5b6577` (5.9:1 on white) and `#a9b3c7` on navy (8.3:1). Type colors: orange `#ff8a1e`,
lavender `#9c8cff`, coral `#ff5b3a`, green `#21b47d`, lime `#d7ec4a`. Text on every colored card is
navy (5.7 to 13.3:1); white text only on navy. Eyebrows are `#c4351a` (5.4:1).

**Type:** Archivo at width 62%, weight 850, uppercase for every display line; body Archivo at
width 100; JetBrains Mono only for machine values (ms, kB, dates, the live pill).

**Shape:** cards 1.5rem radius with the bitten top-right corner (`.bite`) that holds a round
arrow button; pills fully round; tags tilted with a 2px navy outline.

**Motion verb:** pop and lift. Stickers and tags pop on with a spring (scale only, so each keeps
its tilt); cards lift 6px and tilt -0.6deg on hover while the arrow turns 45 degrees; pill arrows
travel; navigation is four type-colored bands streaming in like waterfall rows, then the real
status and fetch time. Idle: the badge's ring turns, the "you" row grows and its clock ticks.

**Not copied from the reference:** stock photos, testimonials and invented stats. The stat cards
show this page's real request count and transfer size.
