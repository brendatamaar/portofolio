import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Words in the Markdown body, code included (people read code slower, so it evens out). */
export function words(post: Post): number {
  return (post.body ?? '').split(/\s+/).filter(Boolean).length;
}

/** Minutes at 220 words a minute, never less than one. */
export function minutes(post: Post): number {
  return Math.max(1, Math.round(words(post) / 220));
}

/** 2026-09-28: sortable, unambiguous, and how the network panel writes dates. */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** 28 September 2026, for reading. */
export const longDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
