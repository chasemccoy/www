import nodePath from 'path'
import fs from 'fs'
const { readdir, readFile, lstat } = fs.promises

const imageRegex = /\.(gif|jpe?g|png|webp|svg)$/i

async function getFileObject(path) {
  const fileData = await readFile(path, 'utf-8')
  return {
    path,
    content: Buffer.from(fileData, 'utf-8'),
  }
}

async function isDirectory(path) {
  try {
    const stats = await lstat(path)
    return stats.isDirectory()
  } catch (error) {
    return false
  }
}

async function getDirectory(dir) {
  let dirList = await getDirList(dir)
  // Never download images, they're handled locally
  dirList = dirList.filter(({ path }) => !imageRegex.test(path))

  const result = await Promise.all(
    dirList.map(async ({ path: fileDir, type, sha }) => {
      switch (type) {
        case 'file': {
          return getFile(fileDir, sha)
        }

        case 'dir': {
          return getDirectory(fileDir)
        }

        default: {
          throw new Error(`Unexpected repo file type: ${type}`)
        }
      }
    })
  )

  return result.flat()
}

async function getFile(path, sha) {
  return getFileObject(path)
}

async function getDirList(dir) {
  const directory = await isDirectory(dir)

  if (directory) {
    const dirents = await readdir(dir, { withFileTypes: true })
    return (
      dirents
        // filter out hidden files
        .filter((dirent) => !/(^|\/)\.[^\/\.]/g.test(dirent.name))
        .map((dirent) => ({
          name: dirent.name,
          path: nodePath.join(dir, dirent.name),
          type: dirent.isDirectory() ? 'dir' : 'file',
        }))
    )
  }

  return {
    path: dir,
  }
}

export { getDirectory, getFile, getDirList, isDirectory }
