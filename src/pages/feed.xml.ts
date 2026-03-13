import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { getDateFromPostId, getPermalinkFromPost, dateForXMLFeed } from '../utils/filters';
import metadata from '../data/metadata.json';

export async function GET(context: any) {
  const posts = await getCollection('posts');
  const visiblePosts = posts
    .filter(p => !p.data.hidden)
    .map(p => ({
      ...p,
      date: getDateFromPostId(p.id),
      permalink: getPermalinkFromPost(p),
    }))
    .filter(p => p.date)
    .sort((a, b) => b.date!.getTime() - a.date!.getTime());

  return rss({
    title: metadata.title,
    description: metadata.feed.subtitle,
    site: metadata.url,
    items: visiblePosts.map(post => ({
      title: post.data.title || `Note from ${post.date!.toISOString().split('T')[0]}`,
      pubDate: post.date!,
      link: post.permalink,
    })),
    customData: `<language>${metadata.language}</language>`,
  });
}
