import React from 'react'
import { getPosts, getPost } from '../../../utils/post'
import { formatDate } from '../../../utils'
import Metadata from '../../../components/Metadata'
import Page from '../../../components/Page'
import RenderMDX from '../../../components/RenderMDX'
import clsx from 'clsx'
import { Clock } from '../../../components/Icon'

const BlogPost = ({ code, title, excerpt, date, image, slug }) => {
  const formattedDate = formatDate(new Date(date))

  return (
    <Page article>
      <Metadata
        article
        title={title}
        description={excerpt}
        image={image ? `/img/${slug}/${image}` : undefined}
      />

      <header className={clsx('my-24', excerpt && 'center')}>
        {excerpt ? (
          <React.Fragment>
            <div
              className="inline-flex align-center mb-12 mono color-caption"
              style={{
                fontSize: '0.8rem',
              }}
            >
              <Clock
                className="inline mr-6"
                style={{ position: 'relative', top: '-1.5px' }}
              />
              {formattedDate}
            </div>
            <h1 className="tighter serif" style={{ fontSize: '1.8em' }}>
              {title}
            </h1>
            <p className="lead mt-8 color-caption">{excerpt}</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="sans" style={{ fontSize: '1rem' }}>
              <span className="normal color-caption">{formattedDate} —</span>{' '}
              {title}
            </h1>
          </React.Fragment>
        )}

        {excerpt && <hr className="vertical mt-24" />}
      </header>

      <div className="prose blog-content">
        <RenderMDX code={code} />
      </div>
    </Page>
  )
}

export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug)

  return {
    props: { ...post },
  }
}

export const getStaticPaths = async () => {
  const posts = await getPosts()

  return {
    paths: posts.map((post) => ({
      params: { ...post.params },
    })),
    fallback: false,
  }
}

export default BlogPost
