import React from 'react'
import Head from 'next/head'
import groupBy from 'just-group-by'
import { getPosts } from '../utils/post'
import { getDateComponents } from '../utils'
import Link from '../components/Link'
import Metadata from '../components/Metadata'
import Page from '../components/Page'

const DateLabel = ({ date }) => {
  const { month, day } = getDateComponents(date, { monthFormat: 'short' })

  return (
    <div
      className='date-label bg-gray--200 px-12 pt-6 pb-4 flex flex-column align--center'
      style={{ borderRadius: '8px' }}
    >
      <span
        className='smaller tighter uppercase color-caption'
        style={{ fontSize: '0.6em' }}
      >
        {month}
      </span>
      <span className='bold larger tighter'>{day}</span>
    </div>
  )
}

const Blog = ({ posts }) => {
  React.useEffect(() => {
    document.querySelector('body').dataset.section = 'blog'
  })

  const years = Object.keys(posts).reverse()

  return (
    <Page className='flow'>
      <Head>
        <link rel='stylesheet' href='/styles/blog.css' />
      </Head>

      <Metadata
        title='Blog'
        description="What's on my mind, and links to some interesting stuff on the web."
      />

      <div className='flow' style={{ '--flow-spacing': '4em' }}>
        {years.map((year) => (
          <React.Fragment key={year}>
            <h2 className='marker mb-24'>
              <span>{year}</span>
            </h2>

            <div className='flex flex-column gap-40 mt-0'>
              {posts[year].map((post, i) => (
                <Link
                  href={post.slug}
                  className='block unstyled no-hover post-preview'
                  key={i}
                >
                  <article className='post-preview flex flex-column align--flex-start gap-16'>
                    <div className='flex align--flex-start gap-16'>
                      <DateLabel date={new Date(post.date)} />
                      <div>
                        <h2
                          className='tighter'
                          style={{ fontSize: '1.4em', marginTop: '-4px' }}
                        >
                          {post.title}
                        </h2>
                        <p className='color-caption mt-4'>{post.excerpt}</p>
                      </div>
                    </div>

                    {post.image && (
                      <img
                        src={`/img/${post.params.slug}/${post.image}`}
                        alt=''
                      />
                    )}
                  </article>
                </Link>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </Page>
  )
}

export const getStaticProps = async (context) => {
  const posts = await getPosts()
  const postsByYear = groupBy(posts, (item) => {
    const { year } = getDateComponents(new Date(item.date))
    return year
  })

  return {
    props: { posts: postsByYear },
  }
}

export default Blog
