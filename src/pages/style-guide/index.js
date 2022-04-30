import React from 'react'
import Head from 'next/head'
import { compileMdx } from '../../utils/compile-mdx'
import TableOfContents from '../../components/TableOfContents'
import Metadata from '../../components/Metadata'
import Page from '../../components/Page'
import RenderMDX from '../../components/RenderMDX'

const StyleGuidePage = ({ code, toc }) => {
  return (
    <Page
      article
      header={
        <div className='center'>
          <h1 className="serif normal">Style Guide</h1>

          <p className="lead color-caption mt-8">
            My personal and always in progress guide to style, usage, and
            grammar for writing on the web
          </p>
        </div>
      }
      tableOfContents={<TableOfContents content={toc} />}
      className="prose"
    >
      {/* <Head>
        <link rel="stylesheet" href="/styles/style-guide.css" />
      </Head> */}

      <Metadata title="Style guide" />

      <RenderMDX code={code} />
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
