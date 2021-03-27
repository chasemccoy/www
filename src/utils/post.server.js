import sortBy from 'sort-by'
import matter from 'gray-matter'
import {octokit} from './octokit.server'
import config from '../../remix.config'
import { downloadMdxFileOrDirectory, downloadFile, downloadDirList } from './github.server'
import { compileMdx } from './compile-mdx.server'

export const getSlugForPost = (slug, postDate) => {
  const date = new Date(postDate)
  const year = date.getFullYear().toString()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  return `/${year}/${month}/${slug}`
}

async function getPost(slug) {
  const postFiles = await downloadMdxFileOrDirectory(
    `${config.content.path}/${slug}`
  )

  const { code, frontmatter } = await compileMdx(slug, postFiles)
  return { slug, code, ...frontmatter }
}

async function getPosts() {
  const data = await downloadDirList(config.content.path)

  if (!Array.isArray(data)) throw new Error()

  const result = await Promise.all(
    data.map(async ({ path: fileDir }) => {
      const fileData = await downloadDirList(fileDir)

      const file = Array.isArray(fileData) 
        ? fileData.find(({ type, path }) =>
            (type === 'file' && path.endsWith('mdx'))
          ) 
        : fileData

      if (!file) {
        console.warn(`No index.mdx file for ${fileDir}`)
        return null
      }

      const postFile = await downloadFile(file.path, file.sha)
      return {
        ...postFile,
        slug: fileDir.replace(`${config.content.path}/`, '').replace('.mdx', '')
      }
    })
  )

  const files = result.filter(v => Boolean(v))

  const posts = await Promise.all(
    files.map(async ({ slug, content }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      return { slug: getSlugForPost(slug, frontmatter.date), ...frontmatter }
    })
  )

  return posts
    .filter(({title}) => !!title)
    .sort(sortBy('-date'))
}

export { getPost, getPosts }
