import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import {getColorForSection} from '../utils';
import clsx from 'clsx';

const NavLink = ({href, className, children, ...rest}) => {
	const { asPath } = useRouter()
	const classNames = clsx(
		className, 
		{selected: href === '/' ? asPath === href : asPath.includes(href)}
	)

  return <Link href={href}><a className={classNames} {...rest}>{children}</a></Link>
}

const Item = ({href, children, className, ...rest}) => (
	<li>
		<NavLink href={href} className={clsx(className, 'unstyled')} {...rest}>
			{children}
		</NavLink>
	</li>
);

// This regex matches links that contain the `YYYY/MM/` slug format
const regex = /([12]\d{3}\/(0[1-9]|1[0-2]))\//;
const blogLinkMatcher = (pathname) => regex.test(pathname);

const Nav = () => {
	const { asPath } = useRouter()

	return (
		<nav>
			<ul className="unstyled">
				<Item href="/" style={{'--highlight-color': getColorForSection()}} className='bold'>
					Chase M.
				</Item>
				<Item
					href="/blog"
					className={clsx(blogLinkMatcher(asPath) && 'selected')}
					style={{'--highlight-color': getColorForSection('blog')}}
				>
					Blog
				</Item>
				<Item
					href="/notes"
					style={{'--highlight-color': getColorForSection('notes')}}
				>
					Notes
				</Item>
				{/* <Item
					href="/books"
					style={{'--highlight-color': getColorForSection('books')}}
				>
					Books
				</Item> */}
				{/* <Item
					href="/quotes"
					style={{'--highlight-color': getColorForSection('quotes')}}
				>
					Quotes
				</Item> */}
			</ul>
		</nav>
	)
}

export default Nav;
