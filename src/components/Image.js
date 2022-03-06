import React from 'react'
import Markdown from 'react-markdown'

const Image = ({ title, alt, ...rest }) => {
  if (title) {
    return (
      <figure>
        <img alt={alt || title} {...rest} />
        <figcaption className="image-caption sans">
          <Markdown
            disallowedElements={['p']}
            unwrapDisallowed
            linkTarget="_blank"
          >
            {title}
          </Markdown>
        </figcaption>
      </figure>
    )
  }

  return <img alt={alt || title} {...rest} />
}

export default Image
