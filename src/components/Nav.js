import React from 'react'
import Link from './Link'
import { getColorForSection } from '../utils'

const Item = ({ to, children, ...rest }) => (
  <li>
    <Link to={to} className='unstyled' {...rest}>
      {children}
    </Link>
  </li>
)

// This regex matches links that contain the `YYYY/MM/` slug format
const regex = /([12]\d{3}\/(0[1-9]|1[0-2]))\//
const blogLinkMatcher = (location) => regex.test(location.pathname)

const Nav = () => (
  <nav>
    <ul>
      <Item to='/' style={{ '--highlight-color': getColorForSection() }}>
        <b>Chase M.</b>
      </Item>
      <Item
        to='/blog'
        isActive={blogLinkMatcher}
        style={{ '--highlight-color': getColorForSection('blog') }}
        partiallyActive
      >
        Blog
      </Item>
      <Item
        to='/notes'
        style={{ '--highlight-color': getColorForSection('notes') }}
        partiallyActive
      >
        Notes
      </Item>
      <Item
        to='/books'
        style={{ '--highlight-color': getColorForSection('books') }}
        partiallyActive
      >
        Books
      </Item>
      <Item
        to='/quotes'
        style={{ '--highlight-color': getColorForSection('quotes') }}
        partiallyActive
      >
        Quotes
      </Item>
    </ul>
  </nav>
)

export default Nav
