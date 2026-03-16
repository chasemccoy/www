import { format, formatISO } from 'date-fns';
import { utc } from '@date-fns/utc';

export function filterTagList(tags: string[] = []) {
  return tags.filter(
    (tag) => !['all', 'nav', 'post', 'posts', 'notes'].includes(tag)
  );
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function shouldShowCite(post: any, index: number, posts: any[]) {
  const isFirstInSequence =
    posts[index + 1]?.source?.title === post.source?.title &&
    posts[index - 1]?.source?.title !== post.source?.title;
  const isInSequence =
    posts[index - 1]?.source?.title === post.source?.title ||
    posts[index + 1]?.source?.title === post.source?.title;
  return isFirstInSequence || !isInSequence;
}

export function readableDate(dateObj: Date | string) {
  return format(new Date(dateObj), 'LLLL d, yyyy', { in: utc });
}

export function shortDate(dateObj: Date | string) {
  return format(new Date(dateObj), 'LLLL d', { in: utc });
}

export function htmlDateString(dateObj: Date | string) {
  return format(new Date(dateObj), 'yyyy-LL-dd', { in: utc });
}

export function dateForXMLFeed(date: Date | string) {
  return formatISO(new Date(date), { representation: 'date' }) + 'T12:00:00.000-05:00';
}

export function titleize(slug: string) {
  return capitalize(slug.replaceAll('-', ' '));
}

export function getDateFromPostId(id: string): Date | null {
  const match = id.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) {
    return new Date(match[1] + 'T00:00:00.000Z');
  }
  return null;
}

export function getSlugFromPostId(id: string): string {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\/index$/, '').replace(/\/.*$/, '');
}

export function getPermalinkFromPost(post: any): string {
  const date = getDateFromPostId(post.id);
  if (!date) return `/${post.id}/`;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const slug = getSlugFromPostId(post.id);
  return `/${year}/${month}/${slug}/`;
}
