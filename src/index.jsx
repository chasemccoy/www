import filters from '../utils/filters.js'

export const data = {
  layout: 'layouts/page.jsx',
  templateClass: 'home',
  pagination: {
    data: 'collections.feed',
    size: 30,
    alias: 'posts',
    reverse: true,
  },
  permalink: function (data) {
    return `/${
      data.pagination.pageNumber > 0 ? data.pagination.pageNumber + 1 + '/' : ''
    }index.html`
  },
}

const { htmlDateString, readableDate, shortDate } = filters

function BlogPost({ post }) {
  const { data, date, url, content, rawInput } = post
  const { title } = data

  const wordCount = rawInput.split(' ').length
  const isShortForm = wordCount < 500

  return (
    <article
      class={{
        prose: true,
        'long-form': !!data.title,
        BlogPost: true,
        'BlogPost--isShortForm': isShortForm,
      }}
    >
      {!isShortForm && title && (
        <header>
          <h1 class='font-header'>
            <a href={url} class='unstyled'>
              {title}
            </a>
          </h1>
        </header>
      )}

      {isShortForm && title && (
        <h1 class='font-header'>
          <a href={url} class='unstyled'>
            {title}
          </a>
        </h1>
      )}

      {!title && (
        <time dateTime={htmlDateString(date)}>
          <a href={url}>{shortDate(date)}</a>
        </time>
      )}

      {{ html: content }}

      {title && (
        <div>
          <time dateTime={htmlDateString(date)}>
            <a href={url}>{readableDate(date)}</a>
          </time>
        </div>
      )}
    </article>
  )
}

function Highlight({ post, includeCite, content }) {
  return (
    <article class='highlight'>
      {includeCite && (
        <cite>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='12'
            height='12'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
          >
            <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'></path>
          </svg>
          <span>
            {post.source?.url ? (
              <>
                From{' '}
                <a href={post.source.url} target='_blank'>
                  {post.source.title}
                </a>{' '}
                by {post.source.author}:
              </>
            ) : (
              <>
                From {post.source?.title} by {post.source?.author}:
              </>
            )}
          </span>
        </cite>
      )}

      <blockquote class='unstyled'>{{ html: content }}</blockquote>

      {post.note && (
        <aside>
          <svg width='13' height='14' fill='var(--color-chat-bubble)'>
            <path d='M6 .246c-.175 5.992-1.539 8.89-5.5 13.5 6.117.073 9.128-.306 12.5-3L6 .246Z'></path>
          </svg>
          <span>{post.note}</span>
        </aside>
      )}
    </article>
  )
}

function Pagination({ pagination }) {
  return (
    <nav class='pagination'>
      <ul class='unstyled'>
        {pagination.href?.next && (
          <li class='previous'>
            <a href={pagination.href.next} class='unstyled'>
              Older
            </a>
          </li>
        )}

        {pagination.href?.previous && (
          <li class='next'>
            <a href={pagination.href.previous} class='unstyled'>
              Newer
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default function ({ posts = [], pagination, page }) {
  const shouldShowCite = (post, index, posts) => {
    // Check if we're the first in a sequence of duplicates
    const isFirstInSequence =
      posts[index + 1]?.source?.title === post.source?.title &&
      posts[index - 1]?.source?.title !== post.source?.title

    // Check if we're in a sequence (either first, middle, or last)
    const isInSequence =
      posts[index - 1]?.source?.title === post.source?.title ||
      posts[index + 1]?.source?.title === post.source?.title

    // Show cite element if we're first in sequence OR not in a sequence at all
    return isFirstInSequence || !isInSequence
  }

  return (
    <>
      <section class='BlogIndex'>
        {posts.map((post, index) => {
          if (post.type === 'post') {
            return <BlogPost post={post} />
          } else if (post.type === 'highlight') {
            const renderedContent = this.renderTemplate(post.text, 'njk,md')

            return (
              <Highlight
                post={post}
                content={renderedContent}
                includeCite={shouldShowCite(post, index, posts)}
              />
            )
          }
          return null
        })}
      </section>

      <Pagination pagination={pagination} />
    </>
  )
}
