import { getNewestCollectionItemDate, convertHtmlToAbsoluteUrls } from "@11ty/eleventy-plugin-rss"
import filters from "../utils/filters"

export const data = {
  // Metadata comes from _data/metadata.json
  permalink: function (data) {
    return data.metadata.feed.path
  },
  eleventyExcludeFromCollections: true,
}

const { dateForXMLFeed } = filters

export default async function ({ metadata, collections }) {
  const absoluteFeedUrl = new URL(metadata.feed.path, metadata.url)

  const newestDate = dateForXMLFeed(getNewestCollectionItemDate(collections.posts)) 

  const posts = collections.posts
    ?.filter(post => !post.data.hidden)
    ?.reverse() || []

  for (const post of posts) {
    const absolutePostUrl = new URL(post.url, metadata.url)
    const html = await convertHtmlToAbsoluteUrls(post.templateContent, absolutePostUrl)

    post.absolutePostUrl = absolutePostUrl
    post.html = html
  }

  return (
    <>
      {{ html: '<?xml version="1.0" encoding="utf-8"?>' }}
      <feed xmlns="http://www.w3.org/2005/Atom" xml:base={metadata.url}>
        <title>{metadata.title}</title>
        <subtitle>{metadata.feed.subtitle}</subtitle>
        {{ html: `<link href="${absoluteFeedUrl}" rel="self"></link>` }}
        {{ html: `<link href="${metadata.url}" rel="alternate" type="text/html"></link>` }}
        <updated>{newestDate}</updated>
        <id>{metadata.feed.id}</id>
        <author>
          <name>{metadata.author.name}</name>
          <email>{metadata.author.email}</email>
        </author>
        
        {posts.map(post => {
          return (
            <entry>
              <title>{post.data.title}</title>
              {{ html: `<link href="${post.absolutePostUrl}"></link>` }}
              <updated>{dateForXMLFeed(post.date)}</updated>
              {{ html: `<id>${post.absolutePostUrl}</id>` }}
              <content type="html">{post.html}</content>
            </entry>
          )
        })}
      </feed>
    </>
  )
}
