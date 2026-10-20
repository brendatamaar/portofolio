import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allPosts } from '../lib/posts';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const posts = await allPosts();
  return rss({
    title: `${site.name}, blog`,
    description: 'Notes on fast pages and boring, reliable back ends.',
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
    })),
  });
}
