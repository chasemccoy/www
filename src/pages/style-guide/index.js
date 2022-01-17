import React from 'react'
import Head from 'next/head'
import { compileMdx } from '../../utils/compile-mdx'
import { getMDXComponent } from 'mdx-bundler/client'
import TableOfContents from '../../components/TableOfContents'
import Metadata from '../../components/Metadata'
import Page from '../../components/Page'

const StyleGuidePage = ({ code, toc }) => {
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  return (
    <Page
      article
      showCanvas
      tableOfContents={<TableOfContents content={toc} />}
      className='prose'
    >
      <Head>
        <link rel='stylesheet' href='/styles/style-guide.css' />
      </Head>

      <Metadata title='Style guide' />

      <h1 className='serif normal'>
        <span>Style Guide</span>
        {/* <span className='subtitle caption sans ml-12 color-caption'>Style, usage, and grammar for the web.</span> */}
      </h1>
      <p className='lead color-caption mt-8'>
        My personal and always in progress guide to style, usage, and grammar
        for writing on the web
      </p>

      <Component />
    </Page>
  )
}

export const getStaticProps = async (context) => {
  const { code, toc } = await compileMdx('src/pages/style-guide/index.mdx')

  return {
    props: { code, toc },
  }
}

export default StyleGuidePage
