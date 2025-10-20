export default function ({ postsByYear, featuredPosts }) {
  // Get years from postsByYear collection, reverse them
  const years = Object.keys(postsByYear || {}).reverse()

  return (
    <div class='archives'>
      <div>
        <h3>Featured</h3>
        <ul class='featured'>
          {featuredPosts?.map(post => (
            <li>
              <a href={post.url}>{post.data.title}</a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>By year</h3>
        <ul class='years unstyled inline'>
          {years.map(year => (
            <li>
              <a href={`/${year}`}>{year}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
