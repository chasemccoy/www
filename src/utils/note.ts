import nodePath from 'path'
import sortBy from 'sort-by'
import matter from 'gray-matter'
import {octokit} from './octokit'
import { downloadDirectory, downloadMdxFileOrDirectory, downloadFile } from './github'
import { compileMdx } from './compile-mdx'

const config = {
  content: {
    owner: 'chasemccoy',
    repo: 'catalog',
    path: 'notes',
  }
}

async function getNote(slug) {
  const postFiles = await downloadMdxFileOrDirectory(
    `${config.content.path}/${slug}`
  )
  
  const { code, frontmatter } = await compileMdx(slug, postFiles)
  return { slug, code, frontmatter }
}

async function getCategory(category) {
  const { data } = await octokit.repos.getContent({
    ...config.content, 
    path: nodePath.join(config.content.path, category)
  })

  if (!Array.isArray(data)) throw new Error('Something went wrong with the request to GitHub')

  const result = await Promise.all(
    data.map(async ({ path: fileDir }) => {
      // console.log(fileDir)
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

      console.log(file.sha)

      const postFile = await downloadFile(file.path, file.sha)

      console.log('downloaded')
      return {
        ...postFile,
        slug: fileDir.replace(`${config.content.path}/`, '').replace('.mdx', '')
      }
    })
  )

  console.log('GHYUI*OGYIGYU*(G*YGF(^*Y&G^&*GY^&*FG^&FG^&(G&TFT&F&T*FT&F^&TF')

  const files = result.filter(v => Boolean(v))

  const posts = await Promise.all(
    files.map(async ({ slug, content }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      return { slug, frontmatter }
    })
  )

  return posts
}

async function getNotes() {
  const { data } = await octokit.repos.getContent(config.content)

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
        slug: fileDir.replace(`${config.content.path}/`, '').replace('.mdx', '')
      }
    })
  )

  const files = result.filter(v => Boolean(v))

  const posts = await Promise.all(
    files.map(async ({ slug, content }) => {
      const matterResult = matter(content)
      const frontmatter = matterResult.data
      return { slug, frontmatter }
    })
  )

  return posts
}

export { getNote, getCategory, getNotes }
