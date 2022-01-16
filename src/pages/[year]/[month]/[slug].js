import React from 'react'
import Head from 'next/head'
import { getMDXComponent } from 'mdx-bundler/client'
import { getPosts, getPost } from '../../../utils/post'
import mdxComponents from '../../../utils/mdx-components'
import { formatDate } from '../../../utils'
import Metadata from '../../../components/Metadata'
import Page from '../../../components/Page'

const BlogPost = ({
  code,
  title,
  excerpt,
  date,
  image,
  slug,
}) => {
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  const formattedDate = formatDate(new Date(date))

  React.useEffect(() => {
    document.querySelector('body').dataset.section = 'blog'
  })

  return (
    <Page article showCanvas className='prose' header={formattedDate}>
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
        <h1 className='tighter' style={{ fontSize: '1.8em' }}>
          {title}
        </h1>
        <p className='lead mt-8 color-caption'>{excerpt}</p>

        <hr className='dashed my-16' />
      </header>

      <div className='prose blog-content'>
        <Component components={mdxComponents} />
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
