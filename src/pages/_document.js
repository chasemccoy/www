import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />

      <body>
        {/* Fixes a FOUC issue in Safari (https://github.com/vercel/next.js/issues/15642) */}
        <script>0</script>
        <Main />
        <NextScript />
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
      </body>
    </Html>
  )
}
