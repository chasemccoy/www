import React from 'react'
import {json} from '@remix-run/data'
import {useRouteData} from '@remix-run/react'
import {getMDXComponent} from 'mdx-bundler/client'
import {getNote} from '../../utils/note.server'
import mdxComponents from '../../utils/mdx-components'
import TableOfContents from '../../components/TableOfContents'

export const loader = async ({params, context}) => {
  const post = await getNote(params.slug)
  return json(post, {
    headers: {
      'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  })
}

export function headers({loaderHeaders}) {
  return {
    'cache-control': loaderHeaders.get('cache-control'),
  }
}

export function meta({data: post}) {
  return {
    title: `${post.title} | Chase McCoy`,
  }
}

const Note = () => {
  const {code, title, excerpt, toc} = useRouteData()
  const Component = React.useMemo(() => getMDXComponent(code), [code])
  console.log(useRouteData())

  return (
    <>
      <header>
        <h1>{title}</h1>
        <p>{excerpt}</p>
      </header>
      <main className='prose'>
        <TableOfContents content={toc} />
        <Component components={mdxComponents} />
      </main>
    </>
  )
}

export default Note