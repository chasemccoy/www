import React from 'react'
import { getNote, getNotes } from '../../utils/note'
import TableOfContents from '../../components/TableOfContents'
import Link from '../../components/Link'
import { Tag, Clock } from '../../components/Icon'
import { formatDate } from '../../utils'
import config from '../../../next.config'
import Metadata from '../../components/Metadata'
import Page from '../../components/Page'
import RenderMDX from '../../components/RenderMDX'

const githubLink = (slug) =>
  `https://github.com/${config.repo}/edit/main/notes/${slug}.mdx`

const Note = ({ data }) => {
  const { code, title, excerpt, toc, slug, modifiedDate, tags } = data

  return (
    <Page
      article
      className="prose"
      tableOfContents={
        toc && (
          <>
            <TableOfContents content={toc} />
            <hr className="dashed" />
            <Link to={githubLink(slug)} className="block">
              Edit on GitHub
            </Link>
          </>
        )
      }
      header={
        <header className="flow center">
          <h1 className="long-form">{title}</h1>
          <p
            className="lead mt-8 color-caption"
            style={{ maxWidth: '70ch', margin: '0 auto' }}
          >
            {excerpt}
          </p>
          <div
            className="mt-16 mono color-caption flex align-center gap-24 justify-center"
            style={{ fontSize: '0.7em' }}
          >
            {tags && (
              <span title="Tags">
                <Tag className="inline mr-6" />
                <span>{tags.join(', ')}</span>
              </span>
            )}
            {modifiedDate && (
              <span title="Last modified">
                <Clock
                  className="inline mr-6"
                  style={{ position: 'relative', top: '-1.5px' }}
                />
                {formatDate(new Date(modifiedDate))}
              </span>
            )}
          </div>
        </header>
      }
    >
      <Metadata title={title} description={excerpt} />

      <div className="prose">
        <RenderMDX code={code} />
      </div>
    </Page>
  )
}

const NotePage = ({ note = {} }) => {
  return <Note data={note} />
}

export const getStaticProps = async ({ params }) => {
  // if (config.noteCategories.includes(params.slug)) {
  //   const notes = await getCategory(params.slug)

  //   return {
  //     props: { notes },
  //   }
  // }

  const note = await getNote(params.slug)

  return {
    props: { note, hasSidebar: !!note.toc },
  }
}

export const getStaticPaths = async () => {
  const notes = await getNotes()

  const notePaths = notes.map((note) => ({
    params: { slug: note.slug },
  }))

  // const categoryPaths = config.noteCategories.map((category) => ({
  //   params: { slug: category },
  // }))

  return {
    paths: [...notePaths],
    fallback: false,
  }
}

export default NotePage
