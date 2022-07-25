import React from 'react'
import Link from './Link'
import clsx from 'clsx'

const Sparkles = () => {
  const [message, setMessage] = React.useState('・゜✧.・.・゜✧・.')
  const position = React.useRef(0)

  const scroll = React.useCallback(() => {
    setMessage((value) => {
      return (
        value.substring(position.current, value.length) +
        '' +
        value.substring(0, position.current)
      )
    })
    position.current++
    if (position.current > message.length) position.current = 0
    window.setTimeout(scroll, 800)
  }, [message.length])

  React.useEffect(() => {
    scroll()
  }, [scroll])

  return <span>{message}</span>
}

const Footer = ({ className }) => {
  return (
    <footer className={clsx(className, 'prose')}>
      <div>
        <div className="flex align--flex-end">
          <div style={{ flex: '1 0 auto' }}>
            <Sparkles />
            <p className="smaller mt-12">
              Made with HTML, CSS, and{' '}
              <span className="color-red">&#9829;</span>
            </p>
          </div>
        </div>

        <div className="contact">
          <ul className="smaller">
            <li>
              <Link to="https://chs.is/tweeting" className="unstyled">
                Twitter
              </Link>
            </li>
            <li>
              <Link to="mailto:hi@chasem.co" className="unstyled">
                Email
              </Link>
            </li>
            <li>
              <Link to="https://chs.is/coding" className="unstyled">
                GitHub
              </Link>
            </li>
            <li>
              <Link to="https://chs.is/listening" className="unstyled">
                Spotify
              </Link>
            </li>
            <li>
              <Link to="/feed.xml" className="unstyled">
                RSS
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
