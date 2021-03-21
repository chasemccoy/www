import {bundleMDX} from 'mdx-bundler'
import visit from 'unist-util-visit'
import remarkPrism from 'remark-prism'
import gfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import toc from 'mdast-util-toc'
import toHast from 'mdast-util-to-hast'
import toHtml from 'hast-util-to-html'

async function compileMdx(slug, githubFiles) {
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

  let tocData = null

  const imageTransformer = (tree) => {
    visit(tree, 'image', (node) => {
      const filename = String(node.url)
      node.url = `/img/${slug}/${filename}`
    })
  }

  const getToC = (tree) => {
    const mdast = toc(tree)
    if (mdast.map) {
      tocData = toHtml(toHast(mdast.map))
    }
  }

  const remarkPlugins = [
    gfm,
    function remapImageUrls() {
      return imageTransformer
    },
    function generateToC() {
      return getToC
    },
    remarkPrism,
    remarkSlug
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
    toc: tocData
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