import React from 'react' 
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Metadata from '../components/Metadata';
import Link from '../components/Link';
import '../components/Logo'

const App = ({ Component, pageProps }) => {
  return (
    <div id="wrapper">
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
