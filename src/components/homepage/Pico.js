import React from 'react'
import Link from '../Link'

const Pico = () => {
  return (
    <div className='homepage--pico pr-24 pt-16 mobile-breakout'>
      <div className='text-container py-24 px-24 prose smaller color-gray--500'>
        <img
          src='/images/pico-logo.png'
          alt='Pico logo'
          className='mb-40'
          style={{width: '72px'}}
        />
        <p>
          Pico Digital Film was a fun little camera app for iOS designed by{' '}
          <Link to='http://louiemantia.com/'>Louie Mantia</Link> and built using
          Swift by yours truly. Pico Cam allowed you to pick from one of a few
          carefully crafted films, and shoot photos pre-processed with that
          film.
        </p>
        <p>
          Pico is no longer available for sale, and the domain for the website
          has expired. However, you can still{' '}
          <Link to='https://web.archive.org/web/20190620065334/http://pico.camera/'>
            check out the site on the Internet Archive
          </Link>
          . Louie also{' '}
          <Link to='https://medium.com/@mantia/pico-digital-film-5ad232977394'>
            wrote about the history of the project when it launched back in 2017
          </Link>
          .
        </p>
        <div className='mt-40 boxes'>
          {[1, 2, 3, 4].map((i) => (
            <img
              src={`/images/pico-box-${i}.png`}
              alt=''
              className='inline'
              key={i}
            />
          ))}
        </div>
      </div>

      <div className='image-container'>
        <img src='/images/pico.png' alt='Screenshot of the Pico Cam app.' />
      </div>
    </div>
  )
}

export default Pico
