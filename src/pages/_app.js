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
        <link rel="prefetch" href="/style/blog.css" as="style" />
        <link rel="prefetch" href="/style/homepage.css" as="style" />
        <link rel="prefetch" href="/style/notes.css" as="style" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Chase McCoy"
          href="/feed.xml"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <Metadata />
      
      <div>
        <header id="site-header">
          <div className='wrapper mt-24'>
            <Link to="/" className='inline-block logo'>
              <chsmc-logo></chsmc-logo>
            </Link>
            <Nav />
          </div>
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
