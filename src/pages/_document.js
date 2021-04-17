import Document, { Html, Head, Main, NextScript } from 'next/document'

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
          
          <script
						async
						src="https://platform.twitter.com/widgets.js"
						charSet="utf-8"
					/>
        </body>
      </Html>
    )
  }
}

export default MyDocument