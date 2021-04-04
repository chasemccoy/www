import React from 'react' 
import Head from 'next/head'
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Metadata from '../components/Metadata';
import Link from '../components/Link';
import '../components/Logo'

const App = ({ Component, pageProps }) => {
  return (
    <div id="wrapper">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="/styles/shared.css" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Chase McCoy"
          href="/feed.xml"
        />
        <link rel="alternate" title="Chase McCoy" type="application/json" href="/feed.json" />
      </Head>

      <Metadata />
      
      <div>
        <header id="site-header">
          <Link to="/" className='mt-8 mb-16 inline-block'>
            <chsmc-logo></chsmc-logo>
          </Link>
          <Nav />
        </header>

        <main style={{paddingTop: '6px'}}>
          <Component {...pageProps} />
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default App