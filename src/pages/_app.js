import React from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Metadata from '../components/Metadata'
import Link from '../components/Link'
import '../components/Logo'
import '../components/Iridescence'
import Script from 'next/script'
import { useRouter } from 'next/router'
import clsx from 'clsx'

export const LayoutContext = React.createContext({})

const fontStyles = `
@font-face {
  font-family: 'Source Code Pro';
  src: url('/fonts/source-code-pro/SourceCodePro-It.woff2') format('woff2'),
      url('/fonts/source-code-pro/SourceCodePro-It.woff') format('woff');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Source Code Pro';
  src: url('/fonts/source-code-pro/SourceCodePro-BoldIt.woff2') format('woff2'),
      url('/fonts/source-code-pro/SourceCodePro-BoldIt.woff') format('woff');
  font-weight: bold;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Source Code Pro';
  src: url('/fonts/source-code-pro/SourceCodePro-Bold.woff2') format('woff2'),
      url('/fonts/source-code-pro/SourceCodePro-Bold.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Source Code Pro';
  src: url('/fonts/source-code-pro/SourceCodePro-Regular.woff2') format('woff2'),
      url('/fonts/source-code-pro/SourceCodePro-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`

const App = ({ Component, pageProps }) => {
  const { pathname } = useRouter()
  const [hasSidebar, setHasSidebar] = React.useState(false)

  return (
    <LayoutContext.Provider value={{ setHasSidebar }}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Chase McCoy"
          href="/feed.xml"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
      </Head>

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />

      <Metadata />

      <div className={clsx(hasSidebar && 'has-sidebar')}>
        <header id="site-header" className="layout-grid">
          <Nav />
        </header>

        <div className='stripes' />

        <main className='layout-grid'>
          <Component {...pageProps} />
        </main>

        <Footer className='layout-grid' />
      </div>
    </LayoutContext.Provider>
  )
}

export default App
