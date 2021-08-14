import React from 'react'
import Markdown from 'react-markdown'

const Image = (props) => {
  if (props.title) {
    return (
      <figure>
        <img {...props} />
        <figcaption className='image-caption sans'>
          <Markdown
            disallowedElements={['p']}
            unwrapDisallowed
            linkTarget='_blank'
          >
            {props.title}
          </Markdown>
        </figcaption>
      </figure>
    )
  }

  return <img {...props} />
}

export default Image
