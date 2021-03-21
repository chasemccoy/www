import React from 'react'
import {useRouteData, Link} from '@remix-run/react'
import {json} from '@remix-run/data'
import {getNotes} from '../../utils/note'

export const loader = async () => {
  return json(await getNotes(), {
    headers: {
      'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  })
}

export function headers() {
  return {
    'cache-control': 'public, max-age=10',
  }
}

export function meta() {
  return {
    title: 'Notes | Chase McCoy',
  }
}

const Notes = () => {
  const notes = useRouteData()

  return (
    <div>
      <header>
        <h1>Notes</h1>
      </header>

      <main>
        {notes.map(note => (
          <p key={note.slug}>
            <Link to={`/notes/${note.slug}`}>{note.title}</Link>
            <br />
            <small>{note.excerpt}</small>
          </p>
        ))}
      </main>
    </div>
  )
}

export default Notes