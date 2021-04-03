import Head from 'next/head'
import Logo from '../components/Logo';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Metadata from '../components/Metadata';

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
          <Logo className="mb-16 mt-8" />
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