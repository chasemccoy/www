import React from 'react'
import Head from 'next/head'
import { getNote, getCategory, getNotes } from '../../utils/note'
import TableOfContents from '../../components/TableOfContents'
import Link from '../../components/Link'
import { Folder } from '../../components/Icon'
import { capitalize, formatDate } from '../../utils'
import config from '../../../next.config'
import Metadata from '../../components/Metadata'
import NoteList from '../../components/NoteList'
import Page from '../../components/Page'
import RenderMDX from '../../components/RenderMDX'

const githubLink = (slug, category) =>
  `https://github.com/${config.repo}/edit/main/notes/${category}/${slug}.mdx`

const Category = ({ notes }) => {
  const categoryName = capitalize(notes[1].category.replace('-', ' '))

  return (
    <Page
      className='prose'
      header={
        <h1 className='normal' style={{ color: 'inherit' }}>
          <Link to='/' className='unstyled normal'>
            ~
          </Link>
          <span className='normal mx-4'>/</span>
          <Link to='/notes' className='unstyled'>
            Notes
          </Link>
          <span className='normal ml-4 mr-8'>/</span>
          <Folder
            className='inline mr-4'
            style={{ width: '1em', position: 'relative', top: '-0.14em' }}
          />
          {categoryName}
        </h1>
      }
    >
      <Head>
        <link rel='stylesheet' href='/styles/notes.css' />
      </Head>

      <Metadata title={categoryName} />

      <NoteList notes={notes} />
    </Page>
  )
}

const Note = ({ data }) => {
  const { code, title, excerpt, toc, category, slug, modifiedDate } = data

  return (
    <Page
      article
      showCanvas
      className='prose'
      tableOfContents={
        toc && (
          <>
            <TableOfContents content={toc} />
            <hr className='dashed' />
            <Link to={githubLink(slug, category)} className='block'>
              Edit on GitHub
            </Link>
          </>
        )
      }
      header={
        <div className='flex space-between mobile-stack gap-4'>
          <Link
            className='unstyled color-section flex align-center'
            to={`/notes/${category}`}
          >
            <Folder
              className='inline mr-6'
              style={{ position: 'relative', top: '-1.5px' }}
            />
            {capitalize(category.replace('-', ' '))}
          </Link>

          {modifiedDate && <p>Updated: {formatDate(new Date(modifiedDate))}</p>}
        </div>
      }
    >
      <Head>
        <link rel='stylesheet' href='/styles/notes.css' />
      </Head>

      <Metadata title={title} description={excerpt} />

      <header className='flow'>
        <h1>{title}</h1>
        <p className='lead mt-8 color-caption'>{excerpt}</p>
        <hr className='dashed' />
      </header>

      <div className='prose'>
        <RenderMDX code={code} />
      </div>
    </Page>
  )
}

const NotePage = ({ notes, note = {} }) => {
  if (Array.isArray(notes)) {
    return <Category notes={notes} />
  }

  return <Note data={note} />
}

export const getStaticProps = async ({ params }) => {
  if (config.noteCategories.includes(params.slug)) {
    const notes = await getCategory(params.slug)

    return {
      props: { notes },
    }
  }

  const note = await getNote(params.slug)

  return {
    props: { note },
  }
}

export const getStaticPaths = async () => {
  const notes = await getNotes()

  const notePaths = notes.map((note) => ({
    params: { slug: note.slug },
  }))

  const categoryPaths = config.noteCategories.map((category) => ({
    params: { slug: category },
  }))

  return {
    paths: [...notePaths, ...categoryPaths],
    fallback: false,
  }
}

export default NotePage
