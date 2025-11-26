import filters from "../../../utils/filters.js"
import BlogPost from "../blog-post.jsx"

export const data = {
  layout: 'layouts/base.jsx',
  templateClass: 'blog post',
}

const { readableDate } = filters

function PostHeader({ title, url }) {
  return (
    <h1 class='font-header'>
      <a href={url} class="unstyled">{title}</a>
    </h1>
  )
}

function ReplyBadge({ postTitle }) {
  const emailReplySubject = `Re: ${postTitle}`
  
  return (
    <a href={`mailto:hi@chsmc.org?subject=${encodeURIComponent(emailReplySubject)}`} class='reply-badge'>
      <img src="/images/reply-via-email.gif" alt="Reply via email" class='pixelated invert-for-light-mode' />
    </a>
  )
}

function PostNavigation({ previousPost, nextPost }) {
  return (
    <nav class='pagination'>
      <ul class='unstyled'>
        {previousPost && (
          <li class='previous'>
            <a href={previousPost.url} class='unstyled'>
              <span class='label'>Previous</span>
              {previousPost.data.title && (
                <span>{previousPost.data.title}</span>
              )}
            </a>
          </li>
        )}

        {nextPost && (
          <li class='next'>
            <a href={nextPost.url} class='unstyled'>
              <span class='label'>Next</span>
              {nextPost.data.title && (
                <span>{nextPost.data.title}</span>
              )}
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default function ({ content, title, url, page, collections }) {
  const postTitle = title || (page.filePathStem.includes('posts') ? `Note from ${readableDate(page.date)}` : '')
  
  const previousPost = collections.posts?.find(post => 
    post.date < page.date && !post.data.hidden
  )
  const nextPost = collections.posts?.find(post => 
    post.date > page.date && !post.data.hidden
  )

  const header = title ? (
    <PostHeader title={title} url={url} />
  ) : null

  const post = {
    data: {
      title: title,
    },
    url: url,
    content: content,
    rawInput: page.rawInput,
    date: page.date,
  }

  return (
    <>
      <BlogPost post={post} truncate={false} />

      {postTitle && <ReplyBadge postTitle={postTitle} />}

      <PostNavigation previousPost={previousPost} nextPost={nextPost} />
    </>
  )
}
