import React from 'react'
import Head from 'next/head'
import Link from '../components/Link'
import Page from '../components/Page'
import Marker from '../components/Marker'
import { getPosts } from '../utils/post'
import { getRecentlyModifiedNotes } from '../utils/note'
import PropertyList from '../components/PropertyList'

const Index = ({ posts, recentNotes }) => {
  return (
    <Page>
      <Head>
        <link rel='stylesheet' href='/styles/homepage.css' />
      </Head>

      <h2
        className='serif normal mt-0'
        style={{ fontSize: '1.3rem', lineHeight: '1.4' }}
      >
        <i>Chase McCoy</i> is a product designer, front-end engineer, and
        internet explorer working on design systems at{' '}
        <Link href='https://stripe.com'>Stripe</Link>.
      </h2>

      <img
        src='/images/portrait.jpg'
        alt='Chase McCoy'
        className='mt-32 mb-40'
        style={{
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          width: 'calc(100% + 128px)',
          marginLeft: '-64px',
          maxWidth: 'none',
        }}
      />

      {/* <div className='prose'>
        <FeaturedPosts posts={posts} />
      </div> */}

      {/* <Marker
        className='mt-40'
        style={{ '--color-accent': 'var(--color-red)' }}
      >
        Now
      </Marker>

      <DesignSystems /> */}

      {/* <hr className='mt-40 mb-24' />

      <Museo /> */}

      {/* <div className='previously mt-40'>
        <Marker className='previously'>Previously</Marker>
        <Seeds />
        <Pico />
      </div> */}

      <div className='flow' style={{'--flow-spacing': '1rem'}}>
        <PropertyList label='Now'>
          <h4>Design Systems at Stripe</h4>
          <p className='color-caption mt-4'>
            Currently, I’m a Staff Product Designer a
          </p>
        </PropertyList>
        <hr className='dashed' />
        <PropertyList label='2017 – 2020'>
          <h4>Design Systems at Sprout Social</h4>
          <p className='color-caption mt-4'>
            A talk about longevity in technology: can a person have 20 years of
            experience or five years, repeated four times? A talk about
            longevity in technology: can a person have 20 years of experience or
            five years, repeated four times?
          </p>
        </PropertyList>
        <hr className='dashed' />
        <PropertyList label='2017'>
          <h4>iOS design and development</h4>
        </PropertyList>
        <hr className='dashed' />
        <PropertyList label='2013 – 2017'>
          <h4>Computer Science at Mississippi State University</h4>
          <p>Some paragraph of information</p>
        </PropertyList>
      </div>

      <h3 className='mt-48 subheader'>Recent notes</h3>
      {recentNotes.map((note) => (
        <PropertyList key={note.slug} label={note.title}>
          {note.excerpt}
        </PropertyList>
      ))}

      <h3 className='mt-48 subheader'>Featured writing</h3>
      {posts.map((post) => (
        <div key={post.slug}>
          <h4>
            <Link to={post.slug}>{post.title}</Link>
          </h4>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </Page>
  )
}

export const getStaticProps = async (context) => {
  const posts = await getPosts()
  const featuredPosts = posts.filter((post) => Boolean(post.featured))
  const recentNotes = await getRecentlyModifiedNotes()

  return {
    props: {
      posts: featuredPosts.slice(0, 4),
      recentNotes: recentNotes.slice(0, 4),
    },
  }
}

export default Index
