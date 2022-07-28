import React from 'react'
import { getPosts } from '../utils/post'
import { getTags } from '../utils/note'
import Link from '../components/Link'
import Metadata from '../components/Metadata'
import Page from '../components/Page'
import Marker from '../components/Marker'

const Backstage = ({ drafts, tags }) => {
  return (
    <Page className="prose">
      <Metadata title="Backstage" />

      <h1>🤫 Backstage</h1>

      {drafts && drafts.length > 0 && (
        <div className="flow">
          <Marker className="mb-16">Drafts</Marker>

          {drafts.map((post, i) => (
            <Link to={post.slug} key={i} className="block">
              {post.title}
            </Link>
          ))}
        </div>
      )}

      <div className="flow mt-48">
        <Marker>Tags</Marker>

        <ul>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </Page>
  )
}

export const getStaticProps = async () => {
  const posts = await getPosts({ includeDrafts: true })
  const drafts = posts.filter(
    (post) => post.hidden && new Date(post.date).getFullYear() > 2020
  )
  const tags = await getTags()

  return {
    props: { drafts, tags: Object.keys(tags).sort() },
  }
}

export default Backstage
