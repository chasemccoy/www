import Head from 'next/head'
import Logo from '../components/Logo';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const App = ({ Component, pageProps }) => {
  return (
    <div id="wrapper">
      <Head>
        <link rel="stylesheet" href="/styles/shared.css" />
      </Head>
      
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