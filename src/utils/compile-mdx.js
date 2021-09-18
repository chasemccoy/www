import { bundleMDX } from 'mdx-bundler'
import { visit } from 'unist-util-visit'
import rehypeShiki from '@leafac/rehype-shiki'
import gfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import smartypants from '@silvenon/remark-smartypants'
import { toc } from 'mdast-util-toc'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import * as shiki from 'shiki'
import remarkEmbedder from '@remark-embedder/core'
import oembedTransformer from '@remark-embedder/transformer-oembed'

const getOEmbedConfig = ({ provider }) => {
  if (provider.provider_name === 'Twitter') {
    return {
      params: {
        dnt: true,
        omit_script: true,
      },
    }
  }
  return null
}

async function compileMdx(slug, githubFiles) {
  const indexRegex = new RegExp(`${slug}\\/index.mdx?$`)
  const indexFile = githubFiles.find(({ path }) => indexRegex.test(path))
  if (!indexFile) {
    throw new Error(`${slug} has no index.mdx file.`)
  }

  const rootDir = indexFile.path.replace(/index.mdx?$/, '')

  const relativeFiles = githubFiles.map(({ path, content }) => ({
    path: path.replace(rootDir, './'),
    content,
  }))

  const files = arrayToObject(relativeFiles, {
    keyName: 'path',
    valueName: 'content',
  })

  let tocData = null

  const imageTransformer = () => {
    return (tree) => {
      visit(tree, 'image', (node, index, parent) => {
        const filename = String(node.url)
        node.url = `/img/${slug}/${filename}`

        if (node.title) {
          // Make sure images that get transformed to figures aren't nested within paragraph tags (which is invalid HTML)
          parent.type = 'div'
        }
      })
    }
  }

  const getToC = () => {
    return (tree) => {
      const mdast = toc(tree)
      if (mdast.map) {
        tocData = toHtml(toHast(mdast.map))
      }
    }
  }

  const remarkPlugins = [
    gfm,
    smartypants,
    imageTransformer,
    getToC,
    remarkSlug,
    [remarkEmbedder, { transformers: [[oembedTransformer, getOEmbedConfig]] }],
  ]

  const rehypePlugins = [
    [
      rehypeShiki,
      {
        highlighter: await shiki.getHighlighter({ theme: 'github-light' }),
      },
    ],
  ]

  const { frontmatter, code } = await bundleMDX(indexFile.content, {
    files,
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        ...remarkPlugins,
      ]

      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        ...rehypePlugins,
      ]

      return options
    },
    esbuildOptions(options) {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
  })

  return {
    code,
    frontmatter,
    toc: tocData,
  }
}

function arrayToObject(array, { keyName, valueName }) {
  const object = {}
  for (const item of array) {
    const key = item[keyName]
    if (typeof key !== 'string') {
      throw new TypeError(`${keyName} of item must be a string`)
    }

    const value = item[valueName]
    object[key] = value
  }

  return object
}

export { compileMdx }
