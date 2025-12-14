export default async function ({ 
  title, 
  page, 
  description, 
  css, 
  js, 
  head, 
  content, 
  templateClass, 
  metadata, 
  eleventy, 
}) {
  let pageTitle = metadata.title
  
  if (title) {
    pageTitle = `${title} | ${metadata.title}`
  } else if (page.filePathStem?.includes('posts')) {
    pageTitle = `Note from ${this.readableDate(page.date)} | ${metadata.title}`
  }

  const styles = await this.renderFile(`./src/_includes/styles/${css || "styles"}.css`, {}, 'njk')

  return (
    <>
      {{ html: `<!DOCTYPE html>` }}
      <html lang="en">

      {{ html: `
  <!--
  Take no thought of the harvest, 
  but only of proper sowing.

  T. S. Eliot
-->
`}}
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="generator" content={eleventy.generator} />
          <title>{pageTitle}</title>
          <meta name="description" content={description || metadata.description} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <style>
          {{ html: `
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap');

            @font-face {
              font-family: Sentinel;
              font-display: swap;
              font-style: normal;
              font-weight: normal;
              src: url(/fonts/sentinel/Sentinel-Book.woff2) format("woff2");
            }

            @font-face {
              font-family: Sentinel;
              font-display: swap;
              font-style: italic;
              font-weight: normal;
              src: url(/fonts/sentinel/Sentinel-BookItalic.woff2) format("woff2");
            }

             @font-face {
              font-family: Sentinel;
              font-display: swap;
              font-style: normal;
              font-weight: bold;
              src: url(/fonts/sentinel/Sentinel-Bold.woff2) format("woff2");
            }

            @font-face {
              font-family: Sentinel;
              font-display: swap;
              font-style: italic;
              font-weight: bold;
              src: url(/fonts/sentinel/Sentinel-BoldItalic.woff2) format("woff2");
            }

            @font-face {
              font-family: 'Whitney';
              src: url("/fonts/whitney/WhitneySSm-Book.woff2") format('woff2');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: 'Whitney';
              src: url("/fonts/whitney/WhitneySSm-BookItalic.woff2") format('woff2');
              font-weight: normal;
              font-style: italic;
              font-display: swap;
            }

            @font-face {
              font-family: 'Whitney';
              src: url("/fonts/whitney/WhitneySSm-Bold.woff2") format('woff2');
              font-weight: bold;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: 'Whitney';
              src: url("/fonts/whitney/WhitneySSm-BoldItalic.woff2") format('woff2');
              font-weight: bold;
              font-style: italic;
              font-display: swap;
            }
          ` }}
          </style>
          
          <style>
            {{ html: styles }}
          </style>

          <link rel="canonical" href={`https://chsmc.org${page.url}`} />
          <link rel="alternate" href={metadata.feed.path} type="application/atom+xml" title={metadata.title} />

          <link rel="icon" href="/favicon.png" type="image/png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="hsl(48, 40%, 5%)" />

          <meta property="og:site_name" content="Chase McCoy" />
          <meta property="og:url" content={`https://chsmc.org${page.url}`} />
          <meta property="og:title" content={pageTitle} />
          <meta name="og:description" content={description || metadata.description} />
          <meta name="twitter:creator" content="@chase_mccoy" />
          <meta name="twitter:title" content={pageTitle} />
          <meta property="fediverse:creator" content="@chsmc@mastodon.social" />

          <script src="/js/index.js" defer></script>
          {js && (
            <script src={`/js/${js}.js`} defer type="module"></script>
          )}
        </head>
        
        <body class={templateClass || undefined}>
          {{ html: content }}

          <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "488e6debfbc64509bd4b00dde784e24f"}'></script>

          <svg xmlns="http://www.w3.org/2000/svg">
            <filter id="paperFilter" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" result="noise" numOctaves="5"></feTurbulence>
              <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="2">
                <feDistantLight azimuth="45" elevation="60"></feDistantLight>
              </feDiffuseLighting>
            </filter>
          </svg>
        </body>
      </html>
    </>
  )
}
