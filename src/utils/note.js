import matter from 'gray-matter'
import { getFile, getDirList, isDirectory } from './fs'
import { compileMdx } from './compile-mdx'
import childProcess from 'child_process'

const CONTENT_PATH = 'notes'

function execShellCommand(cmd) {
  const exec = childProcess.exec
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

async function getLastModifiedDate(path) {
  let date = await execShellCommand(`git log -1 --format=%cD ${path}`)
  date = new Date(date.replace('\n', ''))
  date.setHours(0, 0, 0, 0)
  return date.toString()
}

async function getNote(slug) {
  const notes = await getNotes()
  const note = notes.find((note) => note.slug === slug)
  if (!note) {
    throw new Error(`Note for slug "${slug}" wasn’t found`)
  }

  const isDir = await isDirectory(`${CONTENT_PATH}/${slug}`)
  const path = isDir
    ? `${CONTENT_PATH}/${slug}/index.mdx`
    : `${CONTENT_PATH}/${slug}.mdx`

  const modifiedDate = await getLastModifiedDate(path)

  const { code, frontmatter, toc } = await compileMdx(path, slug)
  return {
    slug,
    code,
    ...frontmatter,
    toc,
    modifiedDate,
  }
}

async function getTags() {
  const notes = await getNotes()
  const tags = {}

  notes.forEach((note) => {
    if (note.tags) {
      note.tags.forEach((tag) => {
        if (!tags[tag]) {
          tags[tag] = []
        }
        tags[tag].push(note)
      })
    }
    else {
      tags.misc = tags.misc ? tags.misc.concat(note) : [note]
    }
  })

  return tags
}

async function getNotes() {
  const data = await getDirList(CONTENT_PATH)

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

      const noteFile = await getFile(file.path, file.sha)

      return {
        ...noteFile,
        slug: fileDir.replace('notes/', '').replace('.mdx', ''),
      }
    })
  )

  const files = result.filter((v) => Boolean(v))

  const notes = await Promise.all(
    files.map(async ({ slug, content, path }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      const modifiedDate = await getLastModifiedDate(path)
      return { slug, ...frontmatter, modifiedDate }
    })
  )

  return notes
    .filter((note) => !note.hidden)
    .sort((a, b) => {
      return a.title.localeCompare(b.title)
    })
}

// async function getCategory(category) {
//   const data = await getDirList(nodePath.join('notes', category))

//   if (!Array.isArray(data)) {
//     throw new Error('No notes found')
//   }

//   const result = await Promise.all(
//     data.map(async ({ path: fileDir }) => {
//       const fileData = await getDirList(fileDir)

//       const file = Array.isArray(fileData)
//         ? fileData.find(
//             ({ type, path }) =>
//               (type === 'file' && path.endsWith('mdx')) || path.endsWith('md')
//           )
//         : fileData

//       if (!file) {
//         console.warn(`No index.mdx file for ${fileDir}`)
//         return null
//       }

//       const noteFile = await getFile(file.path, file.sha)

//       return {
//         ...noteFile,
//         slug: fileDir
//           .replace('notes/', '')
//           .replace(`${category}/`, '')
//           .replace('.mdx', ''),
//       }
//     })
//   )

//   const files = result.filter((v) => Boolean(v))

//   const notes = await Promise.all(
//     files.map(async ({ slug, content, path }) => {
//       const matterResult = matter(content)
//       const frontmatter = matterResult.data
//       const modifiedDate = await getLastModifiedDate(path)
//       return { slug, ...frontmatter, category, modifiedDate }
//     })
//   )

//   return notes
//     .filter((note) => !note.hidden)
//     .sort((a, b) => {
//       return a.title.localeCompare(b.title)
//     })
// }

// async function getNotes(flat = true) {
//   const result = await Promise.all(
//     config.noteCategories.map((category) => {
//       return getCategory(category)
//     })
//   )

//   if (!flat) {
//     const groups = result.reduce((acc, notes) => {
//       const category = notes[0].category
//       return {
//         ...acc,
//         [category]: notes,
//       }
//     }, {})

//     return groups
//   }

//   return result.flat()
// }

async function getRecentlyModifiedNotes() {
  const notes = await getNotes()
  const sorted = notes.sort(
    (a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate)
  )
  return sorted
}

export { getNote, getNotes, getRecentlyModifiedNotes, getTags }
