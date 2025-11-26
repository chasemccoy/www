export const data = {
  layout: 'layouts/page.jsx',
  templateClass: 'blog archive',
  pagination: {
    data: 'collections.postsByYear',
    size: 1,
    alias: 'year'
  },
  eleventyComputed: {
    title: function (data) {
      return `${data.year}`
    }
  },
  permalink: function (data) {
    return `${data.year}/index.html`
  },
}

export default function ({ year, collections, page }) {
  const posts = collections.postsByYear[year]?.reverse() || []

  return (
    <>
      <header class='prose' id='header'>
        <div class='breadcrumbs mb-12'>
          <span>Archives</span>
        </div>

        <h1 class='font-header color-accent mb-16'>
          {year}
        </h1>
      </header>

      <div class='flex flex-column' style={{ gap: '12px' }}>
        {posts.filter((post) => post.data?.title).map((post, index) => {
          return (
            <a href={post.url} class='unstyled block post-preview'>
              <h3>
                <span>{post.data.title}</span>&nbsp;<time dateTime={this.htmlDateString(post.date)}>{this.shortDate(post.date)}</time>
              </h3>
            </a>
          )
        })}
      </div>

      <div class='flex flex-column notes' style={{ gap: '64px' }}>
        {posts.filter((post) => !post.data?.title).map((post, index) => {
          return (
            <article class='prose'>
              <time dateTime={this.htmlDateString(post.date)}>
                <a href={post.url} class='unstyled color-caption block'>{this.shortDate(post.date)}</a>
              </time>

              {{ html: post.content }}
            </article>
          )
        })}
      </div>
    </>
  )
}
