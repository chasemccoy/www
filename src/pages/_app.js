import Head from 'next/head'
import Logo from '../components/Logo';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const App = ({ Component, pageProps }) => {
  return (
    <div id="wrapper">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
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

export const config = {
  unstable_runtimeJS: false
};

export default App