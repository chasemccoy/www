import nodePath from 'path'
import fs from 'fs'

const POSTS_DIR = nodePath.join(process.cwd(), '/posts/')
const NOTES_DIR = nodePath.join(process.cwd(), '/notes/')
let DIR = POSTS_DIR

const { readdir, readFile, lstat } = fs.promises
const imageRegex = /\.(gif|jpe?g|png|webp|svg)$/i

async function getFileObject(path) {
  const fileData = await readFile(nodePath.join(DIR, path), 'binary')
  return {
    path: (path.endsWith('.mdx') && !path.endsWith('index.mdx'))
      ? nodePath.join(path.replace('.mdx', ''), 'index.mdx') 
      : path,
    content: Buffer.from(fileData)
  }
}  

async function getFiles(path, notes = false) {
  if (notes) {DIR = NOTES_DIR}
  
  const absolutePath = nodePath.join(DIR, path)
  const potentialMDXFilePath = absolutePath + '.mdx'
  let stats = null

  try {
    stats = await lstat(potentialMDXFilePath) 
  } catch (error) {
    
  }

  if (stats && stats.isFile()) {
    const file = await getFileObject(path + '.mdx')
    return [file]
  }

  const dirents = await readdir(absolutePath, { withFileTypes: true });

  const files = await Promise.all(
    dirents
      .filter(dirent => !imageRegex.test(dirent.name))
      .map((dirent) => {
        const res = nodePath.join(path, dirent.name);

        if (dirent.isDirectory()) return getFiles(res)

        return getFileObject(res)
      })
  );

  return files.flat();
}

export { getFiles }