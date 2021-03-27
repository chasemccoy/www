import React from 'react';
// import Link from './Link';
import { NavLink as Link, useLocation } from 'react-router-dom';
import {getColorForSection} from '../utils';
import clsx from 'clsx';

const Item = ({to, children, className, ...rest}) => (
	<li>
		<Link to={to} className={clsx(className, 'unstyled')} activeClassName='selected' {...rest}>
			{children}
		</Link>
	</li>
);

// This regex matches links that contain the `YYYY/MM/` slug format
const regex = /([12]\d{3}\/(0[1-9]|1[0-2]))\//;
const blogLinkMatcher = (pathname) => regex.test(pathname);

const Nav = () => {
	const { pathname } = useLocation()

	return (
		<nav>
			<ul className="unstyled">
				<Item to="/" end style={{'--highlight-color': getColorForSection()}}>
					<b>Chase M.</b>
				</Item>
				<Item
					to="/blog"
					className={blogLinkMatcher(pathname) ? 'selected' : ''}
					style={{'--highlight-color': getColorForSection('blog')}}
				>
					Blog
				</Item>
				<Item
					to="/notes"
					style={{'--highlight-color': getColorForSection('notes')}}
				>
					Notes
				</Item>
				<Item
					to="/books"
					style={{'--highlight-color': getColorForSection('books')}}
				>
					Books
				</Item>
				<Item
					to="/quotes"
					style={{'--highlight-color': getColorForSection('quotes')}}
				>
					Quotes
				</Item>
			</ul>
		</nav>
	)
}

export default Nav;
