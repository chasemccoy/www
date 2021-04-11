import React from 'react'
import Link from './Link'

const NoteList = ({ notes }) => {
  return (
    <div className='flow' style={{'--flow-spacing': '0.75em'}}>
      {notes.map(({ slug, title, excerpt }, i) => (
        <React.Fragment key={slug}>
          {i !== 0 && <hr className='dashed' />}
          <Link to={`/notes/${slug}`} className='block unstyled no-hover'>
            <p className='bold'>{title}</p>
            <p>{excerpt}</p>
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}
 
export default NoteList