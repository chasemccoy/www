import React from 'react'

const Sparkles = () => {
  const [message, setMessage] = React.useState('・゜✧.・.・゜✧・.')
  const position = React.useRef(0)

  const scroll = React.useCallback(() => {
    setMessage((value) => {
      return value.substring(position.current, value.length) +
        '' +
        value.substring(0, position.current)
    })
    position.current++
    if (position.current > message.length) position.current = 0
    window.setTimeout(scroll, 800)
  }, [message.length])

  React.useEffect(() => {
    scroll()
  }, [scroll])

  return <span className='color-gray--500'>{message}</span>
}

const Footer = () => {
  return (
    <footer className='prose mt-48'>
      <hr
        className='mobile-breakout dashed'
        style={{ border: '1px dashed var(--color-border)' }}
      />

      <div className='flex align--flex-end'>
        <div style={{ maxWidth: '8em' }}>
          <img
            src='/images/ascii-house.png'
            alt=''
            style={{
              filter: 'var(--ascii-filter)',
              opacity: '0.75',
            }}
          />
        </div>
        <div className='ml-16 mb-2' style={{ flex: '1 0 auto' }}>
          <Sparkles />
          <p className='color-gray--500 smaller mt-12'>
            Made with <span className='color-red'>&#9829;</span> in Chicago{' '}
            <span
              style={{
                fontSize: '1.4em',
                verticalAlign: 'text-bottom',
                lineHeight: 1,
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
