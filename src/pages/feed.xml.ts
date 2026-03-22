import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import metadata from "../data/metadata.json";
import { getPostDisplayTitle } from "../utils";

export async function GET() {
  const posts = await getCollection("posts");
  const visiblePosts = posts
    .filter((p) => !p.data.hidden)
    .map((p) => ({
      ...p,
      date: p.data.date,
      permalink: p.data.permalink,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const container = await AstroContainer.create();

  const items = await Promise.all(
    visiblePosts.map(async (post) => {
      const { Content } = await render(post);
      const content = await container.renderToString(Content);
      return {
        title: getPostDisplayTitle({ title: post.data.title, date: post.date }),
        pubDate: post.date,
        link: post.permalink,
        content,
      };
    }),
  );

  return rss({
    title: metadata.title,
    description: metadata.feed.subtitle,
    site: metadata.url,
    items,
    customData: `<language>${metadata.language}</language>`,
  });
}
