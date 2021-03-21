import sortBy from 'sort-by'
import matter from 'gray-matter'
import {octokit} from './octokit'
import config from '../../remix.config'
import { downloadDirectory, downloadMdxFileOrDirectory, downloadFile } from './github'
import { compileMdx } from './compile-mdx'

async function getPost(slug: string) {
  const postFiles = await downloadMdxFileOrDirectory(
    `${config.content.path}/${slug}`
  )
  
  const { code, frontmatter } = await compileMdx(slug, postFiles)
  return { slug, code, frontmatter }
}

function typedBoolean<T>(
  value: T
): value is Exclude<T, '' | 0 | false | null | undefined> {
  return Boolean(value)
}

async function getPosts() {
  const { data } = await octokit.repos.getContent(config.content)

  if (!Array.isArray(data)) throw new Error('Wut github?')

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
        slug: fileDir.replace(`${config.content.path}/`, '').replace('.mdx', '')
      }
    })
  )

  const files = result.filter(typedBoolean)

  const posts = await Promise.all(
    files.map(async ({ slug, content }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      return { slug, frontmatter }
    })
  )

  return posts
    .filter(({frontmatter}) => !!frontmatter.title)
    .sort(sortBy('-frontmatter.date'))
}

export { getPost, getPosts }
