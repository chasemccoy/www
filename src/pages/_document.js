import Document, { Html, Head, Main, NextScript } from 'next/document'

const fontStyles = `
@font-face {
  font-family: 'GT America';
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url('/fonts/gt-america/GTAmerica-Regular.woff2')
      format('woff2'),
    url('/fonts/gt-america/GTAmerica-Regular.woff')
      format('woff');
}

@font-face {
  font-family: 'GT America';
  font-style: italic;
  font-weight: normal;
  font-display: swap;
  src: url('/fonts/gt-america/GTAmerica-RegularItalic.woff2')
      format('woff2'),
    url('/fonts/gt-america/GTAmerica-RegularItalic.woff')
      format('woff');
}

@font-face {
  font-family: 'GT America';
  font-style: normal;
  font-weight: bold;
  font-display: swap;
  src: url('/fonts/gt-america/GTAmerica-Bold.woff2')
      format('woff2'),
    url('/fonts/gt-america/GTAmerica-Bold.woff')
      format('woff');
}

@font-face {
  font-family: 'GT America';
  font-style: italic;
  font-weight: bold;
  font-display: swap;
  src: url('/fonts/gt-america/GTAmerica-BoldItalic.woff2')
      format('woff2'),
    url('/fonts/gt-america/GTAmerica-BoldItalic.woff')
      format('woff');
}

@font-face {
  font-family: 'Ivar Text';
  src: url('/fonts/ivar-text/IvarText-Regular.woff2') format('woff2'),
    url('/fonts/ivar-text/IvarText-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Ivar Text';
  src: url('/fonts/ivar-text/IvarText-Italic.woff2') format('woff2'),
    url('/fonts/ivar-text/IvarText-Italic.woff') format('woff');
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Ivar Text';
  src: url('/fonts/ivar-text/IvarText-Medium.woff2') format('woff2'),
    url('/fonts/ivar-text/IvarText-Medium.woff') format('woff');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Ivar Text';
  src: url('/fonts/ivar-text/IvarText-MediumItalic.woff2') format('woff2'),
    url('/fonts/ivar-text/IvarText-MediumItalic.woff') format('woff');
  font-weight: bold;
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

class MyDocument extends Document {
  render() {    
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Chase McCoy"
            href="/feed.xml"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <style dangerouslySetInnerHTML={{__html: fontStyles }} />
          <link rel="stylesheet" href="/styles/shared.css" />
          <link rel="prefetch" href="/styles/blog.css" as="style" />
          <link rel="prefetch" href="/styles/homepage.css" as="style" />
          <link rel="prefetch" href="/styles/notes.css" as="style" />
          <meta name="twitter:dnt" content="on" />
        </Head>
        <body>
          <Main />
          <NextScript />
          
          <script
						async
						src="https://platform.twitter.com/widgets.js"
						charSet="utf-8"
					/>

          <script type="text/javascript">{' '}</script>
        </body>
      </Html>
    )
  }
}

export default MyDocument