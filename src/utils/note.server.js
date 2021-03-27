import nodePath from 'path'
import sortBy from 'sort-by'
import matter from 'gray-matter'
import config from '../../remix.config'
import {octokit} from './octokit.server'
import { downloadDirectory, downloadMdxFileOrDirectory, downloadFile } from './github.server'
import { getFiles } from './filesystem.server'
import { compileMdx } from './compile-mdx.server'

async function getNote(slug) {
  const notes = await getNotes()
  const note = notes.find(note => note.slug === slug)
  let postFiles = []

  if (process.env.NODE_ENV === 'development') {
    postFiles = await getFiles(`${note.category}/${slug}`, true)
  }
  else {
    postFiles = await downloadMdxFileOrDirectory(
      `notes/${note.category}/${slug}`
    )
  }

  const { code, frontmatter, toc } = await compileMdx(slug, postFiles)
  return { slug, code, ...frontmatter, toc }
}

async function getCategory(category) {
  const { data } = await octokit.repos.getContent({
    ...config.content, 
    path: nodePath.join('notes', category)
  })

  if (!Array.isArray(data)) throw new Error('Something went wrong with the request to GitHub')

  const result = await Promise.all(
    data.map(async ({ path: fileDir }) => {
      const { data: fileData } = await octokit.repos.getContent({
        owner: config.content.owner,
        repo: config.content.repo,
        path: fileDir,
      })

      const file = Array.isArray(fileData) 
        ? fileData.find(({ type, path }) =>
            (type === 'file' && path.endsWith('mdx')) || path.endsWith('md')
          ) 
        : fileData

      if (!file) {
        console.warn(`No index.mdx file for ${fileDir}`)
        return null
      }

      const postFile = await downloadFile(file.path, file.sha)

      return {
        ...postFile,
        slug: fileDir
          .replace(`notes/`, '')
          .replace(`${category}/`, '')
          .replace('.mdx', '')
      }
    })
  )

  const files = result.filter(v => Boolean(v))

  const posts = await Promise.all(
    files.map(async ({ slug, content }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      return { slug, ...frontmatter, category }
    })
  )

  return posts
}

async function getNotes() {
  const result = await Promise.all(
    config.noteCategories.map(category => {
      return getCategory(category)
    })
  )

  return result.flat()
}

export { getNote, getCategory, getNotes }
