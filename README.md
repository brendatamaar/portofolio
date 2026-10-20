# brendatama.dev

Portfolio and blog of Brendatama Akbar, web software developer. Every page opens with its own
network waterfall: the real requests your browser made to load it, read from the Resource
Timing API. Design notes and the reasoning behind them are in [DESIGN.md](DESIGN.md).

## Run

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve the build
npm run check      # type check
```

## Where things live

| What | Where |
|---|---|
| Name, bio, links, projects | `src/data/site.ts` |
| Blog posts (Markdown) | `src/content/blog/*.md` |
| Pages | `src/pages/` (home, `work/[slug]`, `blog/`, `blog/[slug]`, `404`, `rss.xml`) |
| Design tokens | `src/styles/tokens.css` |
| Waterfall, loader, transitions | `src/motion/` |
| Motion engine (GSAP + Lenis lifecycle) | `src/engine/` |

To add a post, drop a Markdown file into `src/content/blog/` with `title`, `description`,
`date` and optional `tags`. It appears on the blog, the home page, the RSS feed and the sitemap.

## Before publishing

Everything marked `placeholder: true` is invented and needs replacing:

- `src/data/site.ts`: domain, email, LinkedIn URL, availability line, bio, services, tools,
  and all four projects (they are examples of the case-study format, not real work).
- `src/content/blog/*.md`: four drafts written in your voice. Edit, keep or delete them,
  then remove `placeholder: true`.
- `astro.config.mjs` (`site`) and `public/robots.txt`: the production URL.
- `public/og.png`: regenerate after the content changes.

## Deploy

It is a static site. Any static host works: `npx vercel --prod`, `npx netlify deploy --prod
--dir dist`, `npx wrangler pages deploy dist`, or GitHub Pages with `withastro/action`.
Serve it with gzip or Brotli on, because the home page shows the transfer sizes.
