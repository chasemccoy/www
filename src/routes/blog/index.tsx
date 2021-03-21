import React from 'react'
import {useRouteData, Link} from '@remix-run/react'
import {json} from '@remix-run/data'
import {getPosts} from '../../utils/post'

export const loader = async () => {
  return json(await getPosts(), {
    headers: {
      'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  })
}

export function headers() {
  return {
    'cache-control': 'public, max-age=10',
  }
}

export function meta() {
  return {
    title: 'Blog | Chase McCoy',
  }
}

const Blog = () => {
  const posts = useRouteData()

  return (
    <div>
      <header>
        <h1>Blog</h1>
      </header>

      <main>
        {posts.map(post => (
          <p key={post.slug}>
            <Link to={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
            <br />
            <small>{post.frontmatter.excerpt}</small>
          </p>
        ))}
      </main>
    </div>
  )
}

export default Blog