import React from 'react';

const TableOfContents = ({content}) => {
	if (!content) {
		return null;
	}

	return (
		<div className='toc'>
			<h2>Table of contents</h2>
			<div dangerouslySetInnerHTML={{__html: content}} />
		</div>
	);
};

export default TableOfContents;
