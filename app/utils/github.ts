import nodePath from 'path'
import {octokit} from './octokit'
import config from '../../remix.config'

async function downloadMdxFileOrDirectory(
  mdxFileOrDirectory: string,
) {
  const parentDir = nodePath.dirname(mdxFileOrDirectory)
  const dirList = await downloadDirList(parentDir)

  const basename = nodePath.basename(mdxFileOrDirectory)
  const potentials = dirList.filter(({ name }) => name.startsWith(basename))

  for (const extension of ['.mdx', '.md']) {
    const file = potentials.find(({ name }) => name.endsWith(extension))
    if (file) {
      // eslint-disable-next-line no-await-in-loop
      const { content } = await downloadFile(file.path, file.sha)
      // /content/about.mdx => entry is about.mdx, but compileMdx needs
      // the entry to be called "/content/index.mdx" so we'll set it to that
      // because this is the entry for this path
      return [{ path: nodePath.join(mdxFileOrDirectory, 'index.mdx'), content }]
    }
  }
  const directory = potentials.find(({ type }) => type === 'dir')
  if (!directory) return []

  return downloadDirectory(mdxFileOrDirectory)
}

async function downloadDirectory(
  dir: string,
) {
  const dirList = await downloadDirList(dir)

  const result = await Promise.all(
    dirList.map(async ({ path: fileDir, type, sha }) => {
      switch (type) {
        case 'file': {
          return downloadFile(fileDir, sha)
        }
        case 'dir': {
          return downloadDirectory(fileDir)
        }
        default: {
          throw new Error(`Unexpected repo file type: ${type}`)
        }
      }
    }),
  )

  return result.flat()
}

async function downloadFile(
  path: string,
  sha: string,
) {
  const { data } = await octokit.request(
    'GET /repos/{owner}/{repo}/git/blobs/{file_sha}',
    {
      owner: config.content.owner,
      repo: config.content.repo,
      file_sha: sha,
    },
  )
  const encoding = data.encoding
  return { path, content: Buffer.from(data.content, encoding).toString() }
}

async function downloadDirList(dir: string) {
  const { data } = await octokit.repos.getContent({
    owner: config.content.owner,
    repo: config.content.repo,
    path: dir,
  })

  if (!Array.isArray(data)) {
    throw new Error(
      `Tried to download content from ${JSON.stringify(
        config.content,
      )} at ${dir}. GitHub did not return an array of files. This should never happen...`,
    )
  }

  return data
}

export { downloadMdxFileOrDirectory, downloadDirectory, downloadFile }