import React from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Metadata from '../components/Metadata'
import clsx from 'clsx'

const fontStyles = `
@font-face {
  font-family: 'Untitled Sans';
  src: url('/fonts/untitled-sans/UntitledSansWeb-Regular.woff2') format('woff2'),
    url('/fonts/untitled-sans/UntitledSansWeb-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Untitled Sans';
  src: url('/fonts/untitled-sans/UntitledSansWeb-RegularItalic.woff2')
      format('woff2'),
    url('/fonts/untitled-sans/UntitledSansWeb-RegularItalic.woff')
      format('woff');
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: 'Untitled Sans';
  src: url('/fonts/untitled-sans/UntitledSansWeb-Medium.woff2') format('woff2'),
    url('/fonts/untitled-sans/UntitledSansWeb-Medium.woff') format('woff');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Untitled Sans';
  src: url('/fonts/untitled-sans/UntitledSansWeb-MediumItalic.woff2')
      format('woff2'),
    url('/fonts/untitled-sans/UntitledSansWeb-MediumItalic.woff') format('woff');
  font-weight: 700;
  font-style: italic;
}

@font-face {
  font-family: 'GT Alpina';
  src: url('/fonts/gt-alpina/GTAlpina-Rg.woff2') format('woff2'),
      url('/fonts/gt-alpina/GTAlpina-Rg.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'GT Alpina';
  src: url('/fonts/gt-alpina/GTAlpina-RgIt.woff2') format('woff2'),
      url('/fonts/gt-alpina/GTAlpina-RgIt.woff') format('woff');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

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
  return (
    <>
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

      <Metadata />

      <div
        className={clsx(pageProps.hasSidebar && 'has-sidebar', pageProps.class)}
      >
        <header id="site-header" className="layout-grid">
          <Nav />
        </header>

        <div className="stripes" />

        <main className="layout-grid">
          <Component {...pageProps} />
        </main>

        <Footer className="layout-grid" />
      </div>
    </>
  )
}

export default App
