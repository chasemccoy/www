import React from 'react';
// Import {Link} from '@remix-run/react'

const Link = ({to, href, ...rest}) => {
	let newTab = false 
	
	if (to) { newTab = to.startsWith('http') }
	if (href) { newTab = href.startsWith('http') }

	return (
		<a 
			href={href || to}  
			target={newTab ? `_blank` : undefined} 
			{...rest} 
		/>
	);
};

export default Link;
