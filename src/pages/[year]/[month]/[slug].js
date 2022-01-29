import React from 'react'
import Head from 'next/head'
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
      className='prose'
      header={excerpt && formattedDate}
    >
      <Head>
        <link rel='stylesheet' href='/styles/blog.css' />
      </Head>

      <Metadata
        article
        title={title}
        description={excerpt}
        image={image ? `/img/${slug}/${image}` : undefined}
      />

      <header>
        {excerpt ? (
          <React.Fragment>
            <h1 className='tighter' style={{ fontSize: '1.8em' }}>
              {title}
            </h1>
            <p className='lead mt-8 color-caption'>{excerpt}</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 style={{ fontSize: '1rem' }}>
              <span className='normal color-caption'>{formattedDate} —</span>{' '}
              {title}
            </h1>
          </React.Fragment>
        )}

        <hr className='dashed my-16' />
      </header>

      <div className='prose blog-content'>
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
