import React from 'react'
import { getPosts, getPost } from '../../../utils/post'
import { formatDate } from '../../../utils'
import Metadata from '../../../components/Metadata'
import Page from '../../../components/Page'
import RenderMDX from '../../../components/RenderMDX'

const BlogPost = ({ code, title, excerpt, date, image, slug }) => {
  const formattedDate = formatDate(new Date(date))

  return (
    <Page
      article
      showCanvas={!!excerpt}
      className="prose"
      header={excerpt && formattedDate}
    >
      <Metadata
        article
        title={title}
        description={excerpt}
        image={image ? `/img/${slug}/${image}` : undefined}
      />

      <header className='my-40'>
        <div
          className="mb-8"
          style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-code)',
            color: 'var(--color-caption)',
            '--link-color': 'var(--color-caption)',
          }}
        >
          {formattedDate}
        </div>
        {excerpt ? (
          <React.Fragment>
            <h1 className="tighter" style={{ fontSize: '1.8em' }}>
              {title}
            </h1>
            <p className="lead mt-8 color-caption">{excerpt}</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 style={{ fontSize: '1rem' }}>
              <span className="normal color-caption">{formattedDate} —</span>{' '}
              {title}
            </h1>
          </React.Fragment>
        )}

        <hr className="dashed my-16 mt-40" />
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
