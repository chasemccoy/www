import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {    
    return (
      <Html lang="en">
        <Head />
        <body>
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