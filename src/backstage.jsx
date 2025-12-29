import filters from '../utils/filters.js'

export const data = {
  title: 'Backstage',
  layout: 'layouts/page.jsx',
  permalink: '/backstage/',
  templateClass: 'Blog',
}

const { htmlDateString, shortDate } = filters

function titleize(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function ({ collections }) {
  const postslist = collections.posts?.filter(post => post.data.hidden) || []

  return (
    <div class='prose'>
      <div class='Breadcrumbs mb-12'>
        <a href='/' class='bold'>Home</a>
      </div>

      <h1 class='font-header'>
        <a href="/backstage" class="unstyled">Backstage</a>
      </h1>

      <h2>Drafts</h2>

      <div class='flex flex-column' style={{ gap: '1em' }}>
        {postslist.reverse().map(post => (
          <a href={post.url} class='unstyled block Blog__postPreview'>
            <div>
              <h3 style={{ margin: 0 }}>
                <span>
                  {post.data.title || titleize(post.page.fileSlug)}
                </span>&nbsp;<time dateTime={htmlDateString(post.date)}>{shortDate(post.date)}</time>
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
