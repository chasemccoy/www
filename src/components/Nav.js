import React from 'react';
import Link from './Link';
import {getColorForSection} from '../utils';

const Item = ({to, children, ...rest}) => (
	<li>
		<Link to={to} className="unstyled" {...rest}>
			{children}
		</Link>
	</li>
);

// This regex matches links that contain the `YYYY/MM/` slug format
const regex = /([12]\d{3}\/(0[1-9]|1[0-2]))\//;
const blogLinkMatcher = (location) => regex.test(location.pathname);

const Nav = () => (
	<nav>
		<ul className="unstyled">
			<Item to="/" style={{'--highlight-color': getColorForSection()}}>
				<b>Chase M.</b>
			</Item>
			<Item
				// partiallyActive
				to="/blog"
				// isActive={blogLinkMatcher}
				style={{'--highlight-color': getColorForSection('blog')}}
			>
				Blog
			</Item>
			<Item
				// partiallyActive
				to="/notes"
				style={{'--highlight-color': getColorForSection('notes')}}
			>
				Notes
			</Item>
			<Item
				// partiallyActive
				to="/books"
				style={{'--highlight-color': getColorForSection('books')}}
			>
				Books
			</Item>
			<Item
				// partiallyActive
				to="/quotes"
				style={{'--highlight-color': getColorForSection('quotes')}}
			>
				Quotes
			</Item>
		</ul>
	</nav>
);

export default Nav;
