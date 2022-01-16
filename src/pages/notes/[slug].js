import React from 'react'
import Head from 'next/head'
import { getMDXComponent } from 'mdx-bundler/client'
import { getNote, getCategory, getNotes } from '../../utils/note'
import mdxComponents from '../../utils/mdx-components'
import TableOfContents from '../../components/TableOfContents'
import Link from '../../components/Link'
import { Folder } from '../../components/Icon'
import { capitalize } from '../../utils'
import config from '../../../next.config'
import Metadata from '../../components/Metadata'
import NoteList from '../../components/NoteList'
import Page from '../../components/Page'

const githubLink = (slug, category) =>
  `https://github.com/${config.repo}/edit/main/notes/${category}/${slug}.mdx`

const Category = ({ notes }) => {
  const categoryName = capitalize(notes[1].category.replace('-', ' '))

  React.useEffect(() => {
    document.querySelector('body').dataset.section = 'notes'
  })

  return (
    <Page
      className='prose'
      header={
        <header>
          <h1
            style={{
              fontSize: '.75rem',
              fontFamily: 'var(--font-code)',
            }}
            className='normal'
          >
            <Link to='/' className='unstyled normal color-gray--400'>
              ~
            </Link>
            <span className='color-gray--400 normal mx-4'>/</span>
            <Link to='/notes' className='unstyled color-gray--400'>
              Notes
            </Link>
            <span className='color-gray--400 normal ml-4 mr-8'>/</span>
            <Folder
              className='inline color-purple mr-4'
              style={{ width: '1em', position: 'relative', top: '-0.14em' }}
            />
            {categoryName}
          </h1>
        </header>
      }
    >
      <Head>
        <link rel='stylesheet' href='/styles/notes.css' />
      </Head>

      <Metadata title={categoryName} />
      <div>
        <NoteList notes={notes} />
      </div>
    </Page>
  )
}

const Note = ({ data, portal: Portal }) => {
  const { code, title, excerpt, toc, category, slug } = data
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  React.useEffect(() => {
    document.querySelector('body').dataset.section = 'notes'
  })

  return (
    <Page
      className='prose'
      tableOfContents={<TableOfContents content={toc} />}
      header={
        <p className='smaller mt-16'>
          <Link
            className='unstyled bold color-section'
            to={`/notes/${category}`}
            css={`
              color: var(--section-color);
              &:hover {
                text-decoration: underline;
              }
            `}
          >
            <Folder
              className='inline mr-4'
              style={{ position: 'relative', top: '-0.2em' }}
            />
            {capitalize(category.replace('-', ' '))}
          </Link>

          <Link className='ml-16' to={githubLink(slug, category)}>
            Edit on GitHub
          </Link>
        </p>
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
        <Component components={mdxComponents} />
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
