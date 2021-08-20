import React from 'react'
import NextLink from 'next/link'

const Link = ({ to, href, ...rest }) => {
  let newTab = false

  if (to) {
    newTab = to.startsWith('http')
  }
	
  if (href) {
    newTab = href.startsWith('http')
  }

  return (
    <NextLink href={href || to}>
      <a
        target={newTab ? `_blank` : undefined}
        rel={newTab ? `noreferrer` : undefined}
        {...rest}
      />
    </NextLink>
  )
}

export default Link
