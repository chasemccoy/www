import React from 'react'
import { getNotes, getRecentlyModifiedNotes } from '../../utils/note'
import Link from '../../components/Link'
import Page from '../../components/Page'
import Marker from '../../components/Marker'
import { capitalize } from '../../utils'
import { Folder } from '../../components/Icon'
import clsx from 'clsx'
import Metadata from '../../components/Metadata'
import NoteList from '../../components/NoteList'
import { quotes } from '../../../notes/misc/quotes/Quotes'
import { recents as recentBooks } from '../../../notes/misc/books/Books'

const Notes = ({ notes, recentNotes }) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  const recentBook = recentBooks[0]

  return (
    <Page className="prose">
      <Metadata
        title="Notes"
        description="My digital garden containing a collection of links, thoughts, ideas, images, quotes, and other miscellanea I've collected on my travels across the web."
      />

      <header>
        <h1>
          <span
            className="smaller"
            style={{ position: 'relative', top: '-3px' }}
          >
            🌱
          </span>{' '}
          Notes
        </h1>
        <p
          className="mt-12 serif hyphens"
          style={{
            fontSize: '1.4rem',
            lineHeight: 1.3,
          }}
        >
          Welcome to my{' '}
          <Link to="/notes/digital-gardens" className="italic">
            digital&nbsp;garden
          </Link>
          —a personal wiki of neat stuff I’ve collected during my travels on the
          web.
        </p>
      </header>

      <div className="mt-8">
        <p>
          This section is a grab bag of links, clippings, and notes on any and
          all subjects (but mostly web stuff). Notes here are evergreen and are
          often updated or changed as I learn more about a subject.
        </p>

        <Marker className="mt-32">Recent</Marker>

        <div
          className="mt-16 grid"
          style={{ '--item-min-size': '250px', '--gap': '12px' }}
        >
          {recentNotes.map((note) => (
            <Link
              to={`/notes/${note.slug}`}
              className="block unstyled p-16 card"
              key={note.slug}
            >
              <h2 className="mt-0" style={{fontSize: '1rem'}}>{note.title}</h2>
              <div className="color-caption smaller mt-4">{note.excerpt}</div>
            </Link>
          ))}
        </div>

        <Marker className="mt-40">All notes</Marker>

        <div
          className="multi-column mt-24"
          style={{
            '--columns': 2,
            '--min-column-width': '12em',
            '--gap': '32px',
          }}
        >
          {Object.keys(notes).map((category, i) => (
            <div className="mb-48" key={category}>
              <h2 className="mt-0 unstyled">
                <Link
                  to={`/notes/${category}`}
                  className="unstyled flex align-center"
                >
                  <Folder
                    className="inline mr-6 color-caption"
                    style={{
                      width: '1.25em',
                      position: 'relative',
                      top: '-3px',
                    }}
                  />
                  {capitalize(category).replace('-', ' ')}
                </Link>
              </h2>

              <NoteList notes={notes[category]} />
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

export const getStaticProps = async (context) => {
  const notes = await getNotes(false)
  const recentNotes = await getRecentlyModifiedNotes()

  return {
    props: { notes, recentNotes: recentNotes.slice(0, 4) },
  }
}

export default Notes
