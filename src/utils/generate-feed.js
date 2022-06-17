import React from 'react'
import fs from 'fs-extra'
import path from 'path'
import { Feed } from 'feed'
import { getPosts, getPost } from './post'
import mdxComponents from './mdx-components'
import ReactDOMServer from 'react-dom/server'
import { getMDXComponent } from 'mdx-bundler/client'

const destination = path.join(process.cwd(), 'public')

const getURLForPost = (slug, postDate) => {
  const date = new Date(postDate)
  const year = date.getFullYear().toString()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  return 'https://chasem.co' + `/${year}/${month}/${slug}`
}

const author = {
  name: 'Chase McCoy',
  email: 'hi@chasem.co',
  link: 'https://chasem.co',
}

const feed = new Feed({
  title: 'Chase McCoy',
  description:
    'Chase McCoy is a product designer, front-end engineer, and internet explorer working on design systems at Stripe.',
  id: 'http://chasem.co',
  link: 'http://chasem.co',
  language: 'en',
  image: 'http://chasem.co/site-image.png',
  favicon: 'http://chasem.co/favicon.ico',
  generator: 'chasem.co',
  feedLinks: {
    json: 'https://chasem.co/feed.json',
    rss: 'https://chasem.co/feed.xml',
  },
  author,
})

export const generateFeed = async () => {
  const posts = await getPosts()

  for (const postObject of posts) {
    const { params } = postObject
    const post = await getPost(params.slug)
    const Component = getMDXComponent(post.code)
    const html = ReactDOMServer.renderToStaticMarkup(
      <Component components={mdxComponents} />
    )

    feed.addItem({
      title: post.title,
      id: post.slug,
      link: getURLForPost(post.slug, post.date),
      description: html,
      // content: html,
      author: [author],
      date: new Date(post.date),
    })
  }

  fs.writeFileSync(path.join(destination, 'feed.xml'), feed.rss2())
  // fs.writeFileSync(path.join(destination, 'feed.json'), feed.json1());
}
