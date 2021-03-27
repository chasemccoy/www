import React from 'react';

// Const Container = styled.div`
//   && h2 {
//     font-size: 0.9rem;
//     ${'' /* font-family: var(--font-body); */}
//     ${'' /* font-weight: bold; */}
//   }

//   ul {
//     list-style-type: none;
//     margin: 8px 0 8px 4px;
//     padding: 0 0 0 12px;
//     border-left: 1px solid var(--color-border);
//     font-size: 0.75em;
//   }

//   ul ul {
//     display: none;
//   }

//   li {
//     margin: 0;
//   }

//   li + li {
//     margin-top: 4px;
//   }

//   a.selected {
//     color: ${(p) => p.theme.colors.accent.pop};
//   }
// `

const TableOfContents = ({content}) => {
	if (!content) {
		return null;
	}

	return (
		<>
			<h2>Table of contents</h2>
			<div dangerouslySetInnerHTML={{__html: content}} />
		</>
	);
};

export default TableOfContents;
