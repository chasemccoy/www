import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='stylesheet' href='/styles/styles.css' />
      </Head>

      <body>
        {/* Fixes a FOUC issue in Safari (https://github.com/vercel/next.js/issues/15642) */}
        <script>0</script>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
