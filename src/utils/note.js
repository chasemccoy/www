import nodePath from 'path'
import matter from 'gray-matter'
import config from '../../next.config'
import { getFile, getDirList, isDirectory } from './fs'
import { compileMdx } from './compile-mdx'

const CONTENT_PATH = 'notes'

async function getNote(slug) {
  const notes = await getNotes()
  const note = notes.find((note) => note.slug === slug)
  if (!note) {
    throw new Error(`Note for slug "${slug}" wasn’t found`)
  }

  const isDir = await isDirectory(`${CONTENT_PATH}/${note.category}/${slug}`)
  const path = isDir
    ? `${CONTENT_PATH}/${note.category}/${slug}/index.mdx`
    : `${CONTENT_PATH}/${note.category}/${slug}.mdx`

  const { code, frontmatter, toc } = await compileMdx(path, slug)
  if (frontmatter.modified) {
    frontmatter.modified = new Date(frontmatter.modified).toISOString()
  }
  return { slug, code, ...frontmatter, toc, category: note.category }
}

async function getCategory(category) {
  const data = await getDirList(nodePath.join('notes', category))

  if (!Array.isArray(data)) {
    throw new Error('No notes found')
  }

  const result = await Promise.all(
    data.map(async ({ path: fileDir }) => {
      const fileData = await getDirList(fileDir)

      const file = Array.isArray(fileData)
        ? fileData.find(
            ({ type, path }) =>
              (type === 'file' && path.endsWith('mdx')) || path.endsWith('md')
          )
        : fileData

      if (!file) {
        console.warn(`No index.mdx file for ${fileDir}`)
        return null
      }

      const postFile = await getFile(file.path, file.sha)

      return {
        ...postFile,
        slug: fileDir
          .replace('notes/', '')
          .replace(`${category}/`, '')
          .replace('.mdx', ''),
      }
    })
  )

  const files = result.filter((v) => Boolean(v))

  const posts = await Promise.all(
    files.map(async ({ slug, content }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      if (frontmatter.modified) {
        frontmatter.modified = new Date(frontmatter.modified).toISOString()
      }
      return { slug, ...frontmatter, category }
    })
  )

  return posts.filter((p) => !p.hidden)
}

async function getNotes(flat = true) {
  const result = await Promise.all(
    config.noteCategories.map((category) => {
      return getCategory(category)
    })
  )

  if (!flat) {
    const groups = result.reduce((acc, posts) => {
      const category = posts[0].category
      return {
        ...acc,
        [category]: posts,
      }
    }, {})

    return groups
  }

  return result.flat()
}

export { getNote, getCategory, getNotes }
