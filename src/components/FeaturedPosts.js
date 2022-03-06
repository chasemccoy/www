import React from 'react'
import Link from './Link'

const FeaturedPosts = ({ posts }) => {
  return (
    <>
      <h3 className="mt-24 subheader">Featured writing</h3>

      <p className="mt-4 serif larger">
        {posts.slice(0, 4).map((post, i) => (
          <React.Fragment key={i}>
            {Boolean(i) && <span className="color-gray--500 mx-8">×</span>}
            <Link to={post.slug}>{post.title}</Link>
          </React.Fragment>
        ))}
      </p>
    </>
  )
}

export default FeaturedPosts
