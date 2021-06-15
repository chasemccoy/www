import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {    
    return (
      <Html lang="en">
        <Head />

        <body>
          {/* Fixes a FOUC issue in Chrome (https://github.com/vercel/next.js/issues/15642) */}
          <script>0</script>
          <Main />
          <NextScript />
          
          <Script
						src="https://platform.twitter.com/widgets.js"
            strategy="lazyOnload"
						charSet="utf-8"
					/>
        </body>
      </Html>
    )
  }
}

export default MyDocument