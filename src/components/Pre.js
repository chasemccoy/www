import React from 'react';
// Import HighlightedCode from 'components/HighlightedCode'

// const preToCodeBlock = preProps => {
//   if (
//     // children is code element
//     preProps.children &&
//     preProps.children.type === 'code' &&
//     // code props
//     preProps.children.props
//   ) {
//     // we have a <pre><code> situation
//     const {
//       children: codeString,
//       className = "",
//       ...props
//     } = preProps.children.props

//     const match = className.match(/language-([\0-\uFFFF]*)/)

//     return {
//       codeString: codeString.trim(),
//       className,
//       language: match != null ? match[1] : "",
//       ...props
//     }
//   }

//   return undefined
// };

const Pre = (preProps) => {
	// Const props = preToCodeBlock(preProps)
	// console.log(props)

	// if (props) {
	//   return <HighlightedCode {...props} />
	// }

	return <pre {...preProps} />;
};

export default Pre;
