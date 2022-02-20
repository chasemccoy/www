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

  return (
    <div>
      <Head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <link
          rel='alternate'
          type='application/rss+xml'
          title='Chase McCoy'
          href='/feed.xml'
        />
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
      </Head>

      <Script
        src='https://platform.twitter.com/widgets.js'
        strategy='lazyOnload'
      />

      <Metadata />

      <div>
        <header id='site-header'>
          <Nav />
        </header>

        <main>
          <Component {...pageProps} />
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default App
