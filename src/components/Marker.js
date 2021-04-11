import React from 'react';
import clsx from 'clsx';

const Marker = ({children, className, ...rest}) => {
	return (
		<h2 className={clsx('marker', className)} {...rest}>
			<span>{children}</span>
		</h2>
	);
};

export default Marker;