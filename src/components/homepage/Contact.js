import React from 'react'
import Link from '../Link'
import {Twitter, GitHub, Camera, Email, Spotify} from '../Icon'

const ContactMe = () => {
  return (
    <div className='contact'>
      <h3 className='mt-24 subheader'>Get in touch</h3>

      <ul className='mt-8 mb-12 bold'>
        <li>
          <Link
            to='https://chs.is/tweeting'
            className='unstyled'
            style={{
              '--link-color': 'var(--color-blue)',
              '--section-color': 'var(--color-blue)'
            }}
          >
            <Twitter className='inline' />
            &nbsp;<span>Twitter</span>
          </Link>
        </li>
        <li>
          <Link
            to='mailto:hi@chasem.co'
            className='unstyled'
            style={{
              '--link-color': 'var(--color-yellow)',
              '--section-color': 'var(--color-yellow)'
            }}
          >
            <Email className='inline' />
            &nbsp;<span>Email</span>
          </Link>
        </li>
        <li>
          <Link
            to='https://chs.is/coding'
            className='unstyled'
            style={{
              '--link-color': 'var(--color-text)',
              '--section-color': 'var(--color-text)'
            }}
          >
            <GitHub className='inline' />
            &nbsp;<span>GitHub</span>
          </Link>
        </li>
        <li>
          <Link
            to='https://chs.is/ig'
            className='unstyled'
            style={{
              '--link-color': 'var(--color-red)',
              '--section-color': 'var(--color-red)'
            }}
          >
            <Camera className='inline' />
            &nbsp;<span>Instagram</span>
          </Link>
        </li>
        <li>
          <Link
            to='https://chs.is/listening'
            className='unstyled'
            style={{
              '--link-color': 'var(--color-green)',
              '--section-color': 'var(--color-green)'
            }}
          >
            <Spotify className='inline' />
            &nbsp;<span>Spotify</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default ContactMe
