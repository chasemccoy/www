import React from 'react'
import asciiHouse from 'img:../images/ascii-house.png'

const Footer = () => {
  return (
    <footer className='prose mt-48'>
      <hr
        className='mobile-breakout'
        style={{
          borderTop: '1px dashed var(--color-border)',
          background: 'none',
          height: '1px'
        }}
      />

      <div className='flex align--flex-end'>
        <div style={{maxWidth: '8em'}}>
          <img
            src={asciiHouse.src}
            alt=''
            style={{
              filter: 'var(--ascii-filter)',
              opacity: '0.75'
            }}
          />
        </div>
        <div
          className='ml-16 mb-2'
          style={{flex: '1 0 auto'}}
        >
          <p className='color-gray--500 smaller mt-12'>
            Made with <span className='color-red'>&#9829;</span> in Chicago{' '}
            <span
              className='color-blue'
              style={{
                fontSize: '1.4em',
                verticalAlign: 'text-bottom',
                lineHeight: 1
              }}
            >
              &#10038;
            </span>
          </p>
          <p className='color-gray--500 smaller'>Come back soon!</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
