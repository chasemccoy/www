import {bundleMDX} from 'mdx-bundler'
import remarkPrism from 'remark-prism'
import gfm from 'remark-gfm'

async function compileMdx(slug: string, githubFiles: Array<GitHubFile>) {
  const indexRegex = new RegExp(`${slug}\\/index.mdx?$`)
  const indexFile = githubFiles.find(({path}) => indexRegex.test(path))
  if (!indexFile) throw new Error(`${slug} has no index.mdx file.`)

  const rootDir = indexFile.path.replace(/index.mdx?$/, '')
  
  const relativeFiles: Array<GitHubFile> = githubFiles.map(
    ({path, content}) => ({
      path: path.replace(rootDir, './'),
      content,
    }),
  )
  const files = arrayToObj(relativeFiles, {
    keyName: 'path',
    valueName: 'content',
  })

  const remarkPlugins = [
    gfm,
    remarkPrism,
  ]

  const {frontmatter, code} = await bundleMDX(indexFile.content, {
    files,
    xdmOptions(input, options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        ...remarkPlugins,
      ]
      return options
    },
  })

  return {
    code,
    frontmatter,
  }
}

function arrayToObj<ItemType extends Record<string, unknown>>(
  array: Array<ItemType>,
  {keyName, valueName}: {keyName: keyof ItemType; valueName: keyof ItemType},
) {
  const obj: Record<string, ItemType[keyof ItemType]> = {}
  for (const item of array) {
    const key = item[keyName]
    if (typeof key !== 'string') {
      throw new Error(`${keyName} of item must be a string`)
    }
    const value = item[valueName]
    obj[key] = value
  }
  return obj
}

export {compileMdx}