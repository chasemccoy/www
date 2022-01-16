import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

const NavLink = ({ href, className, children, ...rest }) => {
  const { asPath } = useRouter()
  const classNames = clsx(className, {
    selected: href === '/' ? asPath === href : asPath.includes(href),
  })

  return (
    <Link href={href}>
      <a className={classNames} {...rest}>
        {children}
      </a>
    </Link>
  )
}

const Item = ({ href, children, className, ...rest }) => (
  <li>
    <NavLink href={href} className={clsx(className, 'unstyled')} {...rest}>
      {children}
    </NavLink>
  </li>
)

const Separator = () => (
  <li style={{ display: 'flex', alignItems: 'center' }}>
    <span className='separator' />
  </li>
)

// This regex matches links that contain the `YYYY/MM/` slug format
const regex = /([12]\d{3}\/(0[1-9]|1[0-2]))\//
const blogLinkMatcher = (pathname) => regex.test(pathname)

const Nav = () => {
  const { asPath } = useRouter()

  return (
    <nav>
      <ul className='unstyled'>
        <Item href='/' className='bold'>
          Chase M.
        </Item>

        <Item
          href='/blog'
          className={clsx(blogLinkMatcher(asPath) && 'selected')}
        >
          Blog
        </Item>

        <Item href='/notes'>Notes</Item>

        <Separator />

        <Item href='/notes/code'>#code</Item>

        <Item href='/notes/design-systems'>#design systems</Item>

        <Item href='/notes/books'>#books</Item>

        <Item href='/notes/quotes'>#quotes</Item>
      </ul>
    </nav>
  )
}

export default Nav
