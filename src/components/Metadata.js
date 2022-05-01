import React from 'react'
import Head from 'next/head'

const defaults = {
  title: 'Chase McCoy',
  titleTemplate: (title) =>
    title === 'Chase McCoy' ? title : `${title} | Chase McCoy`,
  description:
    'Chase McCoy is a product designer, front-end engineer, and internet explorer working on design systems at Stripe.',
  siteUrl: 'https://chasem.co',
  social: {
    twitter: '@chase_mccoy',
    github: '@chasemccoy',
    instagram: '@chs_mc',
  },
}

const Metadata = ({
  title = defaults.title,
  description = defaults.description,
  image = '/site-image.png',
  article,
}) => {
  const imageURL = defaults.siteUrl + image

  return (
    <Head>
      <title key="title">{defaults.titleTemplate(title)}</title>
      <meta name="description" content={description} />

      {article && <meta property="og:type" content="article" key="og:type" />}
      <meta
        property="og:title"
        content={defaults.titleTemplate(title)}
        key="og:title"
      />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta property="og:image" content={imageURL} key="og:image" />
      <meta property="twitter:image" content={imageURL} key="twitter:image" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={defaults.social.twitter} />
      <meta name="twitter:site" content={defaults.social.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="application-name" content="Chase McCoy" />
      <meta name="apple-mobile-web-app-title" content="Chase McCoy" />
      <link
        rel="pingback"
        href="https://webmention.io/chasem.co/xmlrpc"
        key="pingback"
      />
      <link href="https://twitter.com/chase_mccoy" rel="me" key="twitter" />
      <link href="https://github.com/chasemccoy" rel="me" key="github" />
      <link
        rel="webmention"
        href="https://webmention.io/chasem.co/webmention"
        key="webmention"
      />
      <link
        rel="authorization_endpoint"
        href="https://indieauth.com/auth"
        key="webmention_auth"
      />
    </Head>
  )
}

export default Metadata
