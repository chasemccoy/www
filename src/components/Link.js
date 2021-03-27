import React from 'react';
// Import {Link} from '@remix-run/react'

const Link = ({to, href, ...rest}) => {
	return <a href={href || to} {...rest} />;
};

export default Link;
