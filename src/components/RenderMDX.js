import React from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import mdxComponents from '../utils/mdx-components'

const RenderMDX = ({ code }) => {
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return <Component components={mdxComponents} />
}

export default RenderMDX
