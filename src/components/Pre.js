import React from 'react'
// import HighlightedCode from 'components/HighlightedCode'

const Pre = preProps => {
  // const props = preToCodeBlock(preProps)
  // console.log(props)
  
  // if (props) {
  //   return <HighlightedCode {...props} />
  // }

  return <pre {...preProps} />
}

export default Pre
