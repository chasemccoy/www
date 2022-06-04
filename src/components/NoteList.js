import React from 'react'
import Link from './Link'

const NoteList = ({ notes }) => {
  return (
    <div className="flow" style={{ '--flow-spacing': '0.5em' }}>
      {notes.map(({ slug, title }, i) => (
        <React.Fragment key={slug}>
          {i !== 0 && <hr className="dashed mb-12" />}
          <Link
            to={`/notes/${slug}`}
            className="block unstyled smaller tighter"
          >
            {title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}

export default NoteList
