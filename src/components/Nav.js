import React from 'react';
// import Link from './Link';
import Link from '../components/Link'
import { useRouter } from 'next/router'
import {getColorForSection} from '../utils';
import clsx from 'clsx';

const Item = ({href, children, className, ...rest}) => (
	<li>
		<Link href={href} className={clsx(className, 'unstyled')} {...rest}>
			{children}
		</Link>
	</li>
);

// This regex matches links that contain the `YYYY/MM/` slug format
const regex = /([12]\d{3}\/(0[1-9]|1[0-2]))\//;
const blogLinkMatcher = (pathname) => regex.test(pathname);

const Nav = () => {
	const { pathname } = useRouter()

	return (
		<nav>
			<ul className="unstyled">
				<Item href="/" style={{'--highlight-color': getColorForSection()}} className='bold'>
					Chase M.
				</Item>
				<Item
					href="/blog"
					className={blogLinkMatcher(pathname) ? 'selected' : ''}
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
				<Item
					href="/books"
					style={{'--highlight-color': getColorForSection('books')}}
				>
					Books
				</Item>
				<Item
					href="/quotes"
					style={{'--highlight-color': getColorForSection('quotes')}}
				>
					Quotes
				</Item>
			</ul>
		</nav>
	)
}

export default Nav;
