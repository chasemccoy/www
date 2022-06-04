import React from 'react'
import { getNotes, getRecentlyModifiedNotes, getTags } from '../../utils/note'
import Link from '../../components/Link'
import Page from '../../components/Page'
import Marker from '../../components/Marker'
// import { capitalize } from '../../utils'
import Metadata from '../../components/Metadata'
import NoteList from '../../components/NoteList'

const Notes = ({ notes, recentNotes, tags }) => {
  const [selectedTag, setSelectedTag] = React.useState(null)
  console.log(tags)

  const noteIsFiltered = (tags) => {
    if (selectedTag === 'misc') {
      return tags.length !== 0
    }

    if (selectedTag) {
      return !tags.includes(selectedTag)
    }

    return false
  }

  return (
    <Page className="prose">
      <Metadata
        title="Notes"
        description="My digital garden containing a collection of links, thoughts, ideas, images, quotes, and other miscellanea I've collected on my travels across the web."
      />

      <header className="center mb-24">
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
          className="mt-8 serif hyphens"
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
        {/* <p>
          This section is a grab bag of links, clippings, and notes on any and
          all subjects (but mostly web stuff). Notes here are evergreen and are
          often updated or changed as I learn more about a subject.
        </p> */}

        {/* <Marker className="mt-32">Recent</Marker>

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
              <h2 className="mt-0" style={{ fontSize: '1rem' }}>
                {note.title}
              </h2>
              <div className="color-caption smaller mt-4">{note.excerpt}</div>
            </Link>
          ))}
        </div>

        <Marker className="mt-40">
          {selectedTag ? `Notes tagged with “${selectedTag}”` : 'All notes'}
        </Marker> */}

        <form className="smaller tag-filter mt-24">
          <fieldset>
            <legend>Tags</legend>
            <input
              type="radio"
              value="all"
              id="all"
              checked={!selectedTag}
              onChange={() => setSelectedTag(null)}
            />
            <label htmlFor="all">all</label>
            {Object.keys(tags)
              .sort()
              .map((tag) => {
                return (
                  <React.Fragment key={tag}>
                    <input
                      type="radio"
                      value={tag}
                      id={tag}
                      checked={tag === selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                    />
                    <label htmlFor={tag}>{tag}</label>
                  </React.Fragment>
                )
              })}
          </fieldset>
        </form>

        <div className="mt-32 note-grid">
          {notes.map(({ slug, title, excerpt, tags = [] }) => (
            <React.Fragment key={slug}>
              {/* {i !== 0 && <hr className="dashed my-12" />} */}
              <Link
                to={`/notes/${slug}`}
                className="inline-block unstyled tighter card p-16 mb-16"
                style={
                  noteIsFiltered(tags)
                    ? { opacity: '0.45', width: '100%' }
                    : { width: '100%' }
                }
              >
                <div className="bold">{title}</div>
                {excerpt && (
                  <div className="color-caption smaller mt-4">{excerpt}</div>
                )}
              </Link>
            </React.Fragment>
          ))}

          {/* <NoteList notes={notesToRender} /> */}
        </div>
      </div>
    </Page>
  )
}

export const getStaticProps = async () => {
  const notes = await getNotes(false)
  const recentNotes = await getRecentlyModifiedNotes()
  const tags = await getTags()

  return {
    props: { notes, recentNotes: recentNotes.slice(0, 6), tags },
  }
}

export default Notes
