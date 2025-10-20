import Archives from './_includes/archives.jsx'

export const data = {
  layout: 'layouts/page.jsx',
  permalink: '404.html',
  eleventyExcludeFromCollections: true,
}

export default async function ({ collections }) {
  const header = (
    <h1>404</h1>
  )

  this.slot(header, 'header')

  return (
    <>
      <p>Sorry! That page doesn't seem to exist. Broken URLs aren't cool, so please <a href="mailto:hi@chsmc.org">let me know how you got here</a>. And in the mean time, you might enjoy browsing the archives below.</p>

      <br/>

      <div style={{ margin: '1rem 0 0' }}>
       <Archives postsByYear={collections.postsByYear} featuredPosts={collections.featuredPosts} />
      </div>
    </>
  )
}
