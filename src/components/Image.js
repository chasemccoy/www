import React from 'react'

const Image = (props) => {
  if (props.title) {
    return (
      <figure>
        <img {...props} />
        <figcaption className='image-caption sans'>{props.title}</figcaption>
      </figure>
    )
  }

  return <img {...props} />
}

export default Image
