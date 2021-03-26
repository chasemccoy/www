import React from 'react'
import Link from "../components/Link";
import DesignSystems from '../components/homepage/DesignSystems'
import Museo from '../components/homepage/Museo'
import styles from "css:../styles/homepage.css";
import avatar from 'img:../images/avatar-yellow.png'

const Avatar = () => (
  <div className='avatar'>
    <div>
      <img src={avatar.src} alt='Chase McCoy' />
    </div>
  </div>
)

export let links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Index = () => {
  return (
    <React.Fragment>
      <h2
        className='mb-12 serif hyphens'
        style={{
          fontSize: '1.7rem',
          lineHeight: 1.3,
          marginTop: '-6px'
        }}
      >
        Chase McCoy is a{' '}
        <span style={{color: 'var(--color-green)'}}>product designer&nbsp;✐</span>,{' '}
        <span style={{color: 'var(--color-blue)'}}>
          front-end engineer&nbsp;
          <span style={{fontSize: '2em', lineHeight: '1rem', verticalAlign: 'middle'}}>
            ⌨&#xFE0E;
          </span>
        </span>
        , and{' '}
        <span style={{color: 'var(--color-red)'}}>
          internet explorer&nbsp;
          {/* <Globe css='display: inline; margin-top: -4px;' /> */}
        </span>{' '}
        working on{' '}
        <span style={{color: 'var(--color-yellow)'}}>design systems&nbsp;❏</span> at{' '}
        {/* <Link unstyled to='https://stripe.com'>
          <Stripe
            height='1em'
            css='display: inline; vertical-align: text-bottom; transform: translateY(-1px);'
          />
        </Link> */}
      </h2>

      <div className='prose'>
        <p className='hyphens'>
          <Avatar />
          Growing up online is where I developed a love for visual and interface
          design, and I earned a degree in Computer Science so I could make
          those designs real. I got my start doing iOS design and development,
          but I spend most of my time these days thinking about the web—how it
          works, how it’s changing, and how we can make it a better place.
        </p>

        <p>
          This website is my home on the web, and in{' '}
          <Link to='https://thecreativeindependent.com/people/laurel-schwulst-my-website-is-a-shifting-house-next-to-a-river-of-knowledge-what-could-yours-be/'>
            the words of Laurel Schwulst
          </Link>{' '}
          it is truly “a shifting house next to a river of knowledge.” I use
          this site to share my thoughts, keep a record of my work, and catalog
          the things I discover online.
        </p>

        {/* <FeaturedPosts />
        <ContactMe /> */}
      </div>

      {/* <Marker className='mt-40'>Now</Marker> */}

      <DesignSystems />

      <hr className='mt-40 mb-24' />

      <Museo />

      {/* <div
        css={`
          > * + * {
            margin-top: 0;
            border-top: 1px dashed var(--color-border);
          }

          ${media.tiny`
            > * + * { 
              margin-top: 24px;
              border: none;
            }
          `}
        `}
      >
        <Marker
          className='mt-40'
          css={`
            --color-accent: var(--color-purple);
            margin-bottom: -12px;

            ${media.tiny`
              margin-bottom: 16px;
            `}
          `}
        >
          Previously
        </Marker>

        <Seeds />

        <Pico />
      </div> */}
    </React.Fragment>
  );
}

export default Index