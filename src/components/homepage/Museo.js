import React from 'react'
import museo from 'img:../../images/museo.png'
import museoLandscape from 'img:../../images/museo.jpg'
import Link from '../Link'
// import { UnorderedList } from 'components/Lists'

const Museo = (props) => {
  return (
    <div className='museo' {...props}>
      <div className='prose'>
        <div>
          <h1>
            <Link to='https://museo.app' className='unstyled'>
              <span className='color-blue'>Museo</span>
              <span
                css={`
                  display: inline-block;
                  font-family: var(--font-body);
                  color: var(--color-gray--400);
                  font-size: 1rem;
                  font-weight: normal;
                  transform: translateY(-1.2ex);
                  align-self: flex-end;
                `}
              >
                .app
              </span>
            </Link>
          </h1>

          <p className='lead mt-0 color-gray--400'>
            A visual search engine for free-to-use images from some of the best museums in the world.
          </p>
        </div>

        <div className='mt-0'>
          <p className='smaller color-gray--400 mt-8'>
            <Link to='https://museo.app'>Museo</Link> is an open source web
            interface that connects you with the the following institutions:
          </p>

          <ul className='smaller color-gray--400 mt-12'>
            <li>
              <Link to='https://www.artic.edu/archival-collections/explore-the-collection'>
                The Art Institute of Chicago
              </Link>
            </li>
            <li>
              <Link to='https://www.rijksmuseum.nl/nl'>The Rijksmuseum</Link>
            </li>
            <li>
              <Link to='https://harvardartmuseums.org'>
                The Harvard Art Museums
              </Link>
            </li>
            <li>
              <Link to='https://digitalcollections.nypl.org'>
                The New York Public Library Digital Collection
              </Link>
            </li>
          </ul>

          <p className='smaller color-gray--400 mt-12'>
            This tool is possible because these institutions provide open and
            free API access to their collections. All of the images you find
            with Museo are completely free-to-use, so download away.
          </p>
        </div>
      </div>

      <div className='image-container'>
        <img
          src={museo.src}
          alt='View of the Golden Bend in the Herengracht, Gerrit Adriaensz.'
        />
        <img
          src={museoLandscape.src}
          className='mobile-only mobile-breakout'
          alt='View of the Golden Bend in the Herengracht, Gerrit Adriaensz.'
        />
      </div>
    </div>
  )
}

export default Museo
