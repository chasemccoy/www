import rss from "@astrojs/rss";
import { render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import metadata from "../data/metadata.json";
import { getFeed, getPostDisplayTitle } from "../utils";

export async function GET() {
  const posts = await getFeed();

  const container = await AstroContainer.create();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const content = await container.renderToString(Content);
      return {
        title: getPostDisplayTitle({ title: post.data.title, date: post.data.date }),
        pubDate: post.data.date,
        link: post.data.permalink,
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
