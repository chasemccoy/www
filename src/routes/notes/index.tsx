import React from 'react'
import {useRouteData, Link} from '@remix-run/react'
import {json} from '@remix-run/data'
import {getCategory} from '../../utils/note'

export const loader = async () => {
  return json(await getCategory('code'), {
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
    title: 'Notes | Chase McCoy',
  }
}

const Notes = () => {
  const notes = useRouteData()

  return (
    <div>
      <header>
        <h1>Notes</h1>
      </header>

      <main>
        {/* {notes.map(post => (
          <p key={post.slug}>
            <Link to={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
            <br />
            <small>{post.frontmatter.excerpt}</small>
          </p>
        ))} */}
      </main>
    </div>
  )
}

export default Notes