import React from 'react'
import { getNotes, getTags } from '../../utils/note'
import Link from '../../components/Link'
import Page from '../../components/Page'
import Metadata from '../../components/Metadata'

const Notes = ({ notes, tags }) => {
  const [selectedTag, setSelectedTag] = React.useState(null)

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
        </div>
      </div>
    </Page>
  )
}

export const getStaticProps = async () => {
  const notes = await getNotes()
  const tags = await getTags()

  return {
    props: { notes, tags },
  }
}

export default Notes
