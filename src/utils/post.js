import sortBy from 'sort-by'
import matter from 'gray-matter'
import { getFile, getDirList, isDirectory } from './fs.js'
import { compileMdx } from './compile-mdx.js'
import nodePath from 'path'

const CONTENT_PATH = 'posts'

export const getSlugForPost = (slug, postDate) => {
  const date = new Date(postDate)
  const year = date.getFullYear().toString()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  return `/${year}/${month}/${slug}`
}

const getParamsForPost = (slug, postDate) => {
  const date = new Date(postDate)
  const year = date.getFullYear().toString()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  return { year, month, slug }
}

async function getPost(slug) {
  const isDir = await isDirectory(`${CONTENT_PATH}/${slug}`)
  const path = isDir
    ? `${CONTENT_PATH}/${slug}/index.mdx`
    : `${CONTENT_PATH}/${slug}.mdx`
  const resolvedPath = nodePath.resolve(path)

  const { code, frontmatter } = await compileMdx(resolvedPath, slug)
  frontmatter.date = new Date(frontmatter.date).toISOString()
  return { slug, code, ...frontmatter }
}

async function getPosts() {
  const data = await getDirList(CONTENT_PATH)

  if (!Array.isArray(data)) {
    throw new TypeError()
  }

  const result = await Promise.all(
    data.map(async ({ path: fileDir }) => {
      const fileData = await getDirList(fileDir)

      const file = Array.isArray(fileData)
        ? fileData.find(
            ({ type, path }) => type === 'file' && path.endsWith('mdx')
          )
        : fileData

      if (!file) {
        console.warn(`No index.mdx file for ${fileDir}`)
        return null
      }

      const postFile = await getFile(file.path, file.sha)
      return {
        ...postFile,
        slug: fileDir.replace(`${CONTENT_PATH}/`, '').replace('.mdx', ''),
      }
    })
  )

  const files = result.filter((v) => Boolean(v))

  const posts = await Promise.all(
    files.map(async ({ slug, content }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      frontmatter.date = new Date(frontmatter.date).toISOString()
      const params = getParamsForPost(slug, frontmatter.date)
      const fullSlug = `/${params.year}/${params.month}/${slug}`

      return {
        slug: fullSlug,
        params: { ...params },
        ...frontmatter,
      }
    })
  )

  return posts
    .filter(({ title, hidden }) => !hidden && Boolean(title))
    .sort(sortBy('-date'))
}

export { getPost, getPosts }
