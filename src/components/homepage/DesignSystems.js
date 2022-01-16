import React from 'react'
import Link from '../Link'
import { Components, Documentation, Pattern, Collab, Folder } from '../Icon'

const DesignSystems = () => {
  return (
    <div className='homepage--design-systems'>
      <h2
        className='mt-20 serif'
        style={{ fontSize: '2.5em', lineHeight: 1.1 }}
      >
        I’m currently focused on{' '}
        <span
          className='italic'
          style={{
            textDecoration: 'underline',
            textDecorationColor: 'var(--color-green)',
          }}
        >
          design&nbsp;systems
        </span>
        .
      </h2>

      <div
        className='grid mt-32 smaller focus-areas'
        style={{ '--item-min-size': '250px', '--gap': '2rem' }}
      >
        <div>
          <Collab height='32px' />
          <h3
            className='mt-12 mb-2 dotted'
            style={{ '--dot-color': 'var(--color-green)' }}
          >
            Community
          </h3>
          <p className='hyphens pr-12'>
            Scaling systems requires a community effort. Collaborating with
            stakeholders and earning trust is a huge part of the work.
          </p>
        </div>

        <div>
          <Documentation height='32px' />
          <h3
            className='mt-12 mb-2 dotted'
            style={{ '--dot-color': 'var(--color-yellow)' }}
          >
            Communication
          </h3>
          <p className='hyphens pr-12'>
            Design systems are often about managing change over time, and the
            best way to do that is clear and frequent communication.
          </p>
        </div>

        <div>
          <Components height='32px' />
          <h3
            className='mt-12 mb-2 dotted'
            style={{ '--dot-color': 'var(--color-blue)' }}
          >
            Tooling
          </h3>
          <p className='hyphens pr-12'>
            Empowering creatives with well-crafted component libraries and
            bespoke design tooling.
          </p>
        </div>

        <div>
          <Pattern height='32px' />
          <h3
            className='mt-12 mb-2 dotted'
            style={{ '--dot-color': 'var(--color-red)' }}
          >
            Patterns
          </h3>
          <p className='hyphens pr-12'>
            System practitioners are masters of abstraction, and serve as the
            stewards, scribes, and librarians of a product experience.
          </p>
        </div>
      </div>

      <Link
        to='/notes/design-systems'
        className='unstyled flex mt-40 p-16 hover-link'
      >
        <Folder
          style={{
            width: '2rem',
            flex: '1 0 auto',
            color: 'var(--color-purple)',
          }}
        />

        <div className='ml-16'>
          <h2 className='mb-2'>Read my notes on design systems</h2>
          <p className='color-gray--400'>
            The notes section of this site contains useful links, quotes, and
            insights related to design systems and the work that goes into them.
          </p>
        </div>
      </Link>
    </div>
  )
}

export default DesignSystems
