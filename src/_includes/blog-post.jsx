import filters from '../../utils/filters.js'

const { htmlDateString, readableDate, shortDate } = filters

export default function BlogPost({ post, truncate = true }) {
  const { data, date, url, content, rawInput } = post
  const { title } = data

  const wordCount = rawInput.split(' ').length
  const isShortForm = wordCount < 500
  const shouldTruncate = truncate && title && wordCount > 1200

  const paragraphs = content.match(/<p>.*?<\/p>/gs) || []
  let excerpt = null;

  if (paragraphs) {
    excerpt = paragraphs.slice(0, 3).join('\n');
  }

  return (
    <article
      class={{
        prose: true,
        'long-form': !!data.title,
        BlogPost: true,
        'BlogPost--isShortForm': isShortForm,
        'BlogPost--isTruncated': shouldTruncate,
      }}
    >
      {(!isShortForm && title) && (
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

      {{ html: shouldTruncate ? excerpt : content }}

      {shouldTruncate && (
        <a class='BlogPost--readMoreButton' href={url}>Read more</a>
      )}

      {(title && !shouldTruncate) && (
        <div>
          <time dateTime={htmlDateString(date)}>
            <a href={url}>{readableDate(date)}</a>
          </time>
        </div>
      )}
    </article>
  )
}

