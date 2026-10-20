import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set `site` to the production URL before deploying: canonical, OG, RSS and sitemap depend on it.
// Keep it in sync with `site.url` in src/data/site.ts.
export default defineConfig({
  site: 'https://brendatama.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
  markdown: {
    shikiConfig: { theme: 'github-light-default', wrap: false },
  },
});
