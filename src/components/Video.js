import React from 'react'

const Video = ({ src, title, ...rest }) => {
  return (
    <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
      <iframe
        src={src}
        title={title}
        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
        frameBorder='0'
        webkitallowfullscreen='true'
        mozallowfullscreen='true'
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        {...rest}
      />
    </div>
  )
}

export default Video
