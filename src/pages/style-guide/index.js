import React from 'react'
import Head from 'next/head'
import { getMdxFileOrDirectory } from '../../utils/fs'
import { compileMdx } from '../../utils/compile-mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import TableOfContents from '../../components/TableOfContents'
import Metadata from '../../components/Metadata'

const StyleGuidePage = ({ code, toc }) => {
  React.useEffect(() => {
    document.querySelector('body').dataset.section = 'style-guide'
  })

  const Component = React.useMemo(() => getMDXComponent(code), [code])
  return (
    <div className='prose'>
      <Head>
        <link rel="stylesheet" href="/styles/style-guide.css" />
      </Head>

      <Metadata title='Style guide' />

      <h1 className='serif normal'>
        <span>Style Guide</span>
        {/* <span className='subtitle caption sans ml-12 color-caption'>Style, usage, and grammar for the web.</span> */}
      </h1>
      <p className='lead color-caption mt-8'>
        My personal and always in progress guide to style, usage, and grammar for writing on the web
      </p>

      <TableOfContents content={toc} className='mt-24' />

      <Component />
    </div>
  )
}

export const getStaticProps = async (context) => {
  const files = await getMdxFileOrDirectory(`src/pages/style-guide`)
  const { code, toc } = await compileMdx('style-guide', files)

  return {
    props: { code, toc },
  }
}

export default StyleGuidePage
