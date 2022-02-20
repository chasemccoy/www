import React from 'react'
import Link from '../components/Link'
import Page from '../components/Page'
import Marker from '../components/Marker'
import { getPosts } from '../utils/post'
import { getRecentlyModifiedNotes } from '../utils/note'
import PropertyList from '../components/PropertyList'
import Museo from '../components/homepage/Museo'

const Index = ({ posts, recentNotes }) => {
  return (
    <Page>
      {/* <h2
        className='serif normal mt-0'
        style={{
          fontSize: '1.4rem',
          lineHeight: '1.4',
          letterSpacing: '-0.5px',
        }}
      >
        <i>Chase McCoy</i> is a product designer, front-end engineer, and
        internet explorer working on design systems at{' '}
        <Link href='https://stripe.com'>Stripe</Link>.
      </h2> */}

      <h2
        className='serif normal mt-0'
        style={{
          fontSize: '1.4rem',
          lineHeight: '1.4',
          letterSpacing: '-0.5px',
        }}
      >
        <i>Chase McCoy</i> is a Product Designer at{' '}
        <Link href='https://stripe.com'>Stripe</Link> focused on building, evangelizing, and growing design systems.
      </h2>

      <p className='color-caption mt-8'>
        When he’s not at his computer you can find him thinking and writing
        about design advocacy, digital gardening, hypertext, internet culture,
        online communities, indie publishing, creative coding, digital
        preservationism, and a diverse & open web.
      </p>

      {/* <p className='color-caption mt-12'>Interests include design advocacy, digital gardening, </p> */}

      <img
        src='/images/portrait.jpg'
        alt='Chase McCoy'
        className='my-32'
        style={{
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          width: 'calc(100% + 128px)',
          marginLeft: '-64px',
          maxWidth: 'none',
        }}
      />

      <div
        className='flow'
        style={{
          '--flow-spacing': '1rem',
          '--link-color': 'var(--color-caption)',
        }}
      >
        <Marker className='mt-48'>Experience</Marker>
        <PropertyList label='Now'>
          <h4>Design Systems at Stripe</h4>
          <p className='color-caption mt-2'>
            I’m currently working on Sail, the design ecosystem powering web products at Stripe. 
          </p>
        </PropertyList>
        <hr className='dashed' />
        <PropertyList label='2017 – 2020'>
          <h4>Design Systems at Sprout Social</h4>
          <p className='color-caption mt-2'>
            I previously led the Design Systems team at Sprout Social working on
            the{' '}
            <Link href='https://seeds.sproutsocial.com'>
              Seeds design system
            </Link>
            . I helped ship a{' '}
            <Link to='https://sproutsocial.com/insights/sprout-social-design-refresh'>
              complete redesign of our product
            </Link>
            , developed a{' '}
            <Link to='/2019/07/seeds-component-library'>
              themeable component library
            </Link>
            , and{' '}
            <Link to='/2020/08/design-system-health'>
              fostered a healthy community to support our system
            </Link>
            .
          </p>
        </PropertyList>
        <hr className='dashed' />
        <PropertyList label='2014 – 2017'>
          <h4>iOS design and development</h4>
          <p className='color-caption mt-2'>
            I began my career as an iOS designer and developer (working in both
            Swift and Objective-C). Outside of my day job at the{' '}
            <Link to='https://www.nsparc.msstate.edu/'>
              the National Strategic Planning and Analysis Research Center
            </Link>{' '}
            I worked on an iOS app with Louie Mantia called{' '}
            <Link to='https://web.archive.org/web/20190620065334/http:/pico.camera/'>
              Pico Digital Film
            </Link>
            .
          </p>
        </PropertyList>
        <hr className='dashed' />
        <PropertyList label='2013 – 2017'>
          <h4>Computer Science at Mississippi State University</h4>
          <p className='color-caption mt-2'>
            While most of my work now focused on design, my academic background
            is computer science and software development.
          </p>
        </PropertyList>
      </div>

      {/* <h3 className='mt-48 subheader'>Recent notes</h3>
      {recentNotes.map((note) => (
        <PropertyList key={note.slug} label={note.title}>
          {note.excerpt}
        </PropertyList>
      ))} */}

      <div className='flow' style={{ '--flow-spacing': '1rem' }}>
        <Marker className='mt-48'>Select writing</Marker>
        {posts.map((post) => (
          <div key={post.slug}>
            <h4>
              <Link to={post.slug}>{post.title}</Link>
            </h4>
            <p className='color-caption mt-2'>{post.excerpt}</p>
          </div>
        ))}
        <Link to='/blog' className='block bold unstyled color-caption'>
          Read more →
        </Link>
      </div>

      <hr className='mt-40 mb-32' />

      <Museo />
    </Page>
  )
}

export const getStaticProps = async (context) => {
  const posts = await getPosts()
  const featuredPosts = posts.filter((post) => Boolean(post.featured))
  const recentNotes = await getRecentlyModifiedNotes()

  return {
    props: {
      posts: featuredPosts.slice(0, 3),
      recentNotes: recentNotes.slice(0, 4),
    },
  }
}

export default Index
