import React from 'react'
import Head from 'next/head'
import Link from '../components/Link'
import Page from '../components/Page'
import { Globe, Stripe } from '../components/Icon'
import DesignSystems from '../components/homepage/DesignSystems'
import Marker from '../components/Marker'
import FeaturedPosts from '../components/FeaturedPosts'
import Museo from '../components/homepage/Museo'
import Seeds from '../components/homepage/Seeds'
import Pico from '../components/homepage/Pico'
import { getPosts } from '../utils/post'
import PropertyList from '../components/PropertyList'

const Index = ({ posts }) => {
  return (
    <Page className='prose'>
      <Head>
        <link rel='stylesheet' href='/styles/homepage.css' />
      </Head>

      <h2 className='serif normal mt-0 smaller'>
        <i>Chase McCoy</i> is a product designer, front-end engineer, and
        internet explorer working on design systems at Stripe.
      </h2>

      <img src='/images/portrait.jpg' alt='Chase McCoy' />

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

      <PropertyList label='Now'>
        <p>
          A talk about longevity in technology: can a person have 20 years of
          experience or five years, repeated four times?
        </p>
      </PropertyList>
      <hr className='dashed' />
      <PropertyList label='Now'>
        <p>
          A talk about longevity in technology: can a person have 20 years of
          experience or five years, repeated four times? A talk about longevity
          in technology: can a person have 20 years of experience or five years,
          repeated four times?
        </p>
      </PropertyList>
      <hr className='dashed' />
      <PropertyList label='Now'>
        <p>Some paragraph of information</p>
      </PropertyList>
      <hr className='dashed' />
      <PropertyList label='Now'>
        <p>Some paragraph of information</p>
      </PropertyList>
    </Page>
  )
}

export const getStaticProps = async (context) => {
  const posts = await getPosts()
  const featuredPosts = posts.filter((post) => Boolean(post.featured))

  return {
    props: { posts: featuredPosts },
  }
}

export default Index
