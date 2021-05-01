import nodePath from 'path';
import fs from 'fs';

const {readdir, readFile, lstat} = fs.promises;
const imageRegex = /\.(gif|jpe?g|png|webp|svg)$/i;

async function getFileObject(path) {
	const fileData = await readFile(path, 'utf-8');
	return {
		path,
		content: Buffer.from(fileData, 'utf-8')
	};
}

async function isDirectory(path) {
	const stats = await lstat(path);
	return stats.isDirectory();
}

async function getMdxFileOrDirectory(mdxFileOrDirectory) {
	const parentDir = nodePath.dirname(mdxFileOrDirectory);
	const dirList = await getDirList(parentDir);

	const basename = nodePath.basename(mdxFileOrDirectory);
	const potentials = dirList.filter(({name}) => name.startsWith(basename));

	const file = potentials.find(({name}) => name.endsWith('mdx'));
	if (file) {
		const {content} = await getFile(file.path, file.sha);
		// /content/about.mdx => entry is about.mdx, but compileMdx needs
		// the entry to be called "/content/index.mdx" so we'll set it to that
		// because this is the entry for this path
		return [{path: nodePath.join(mdxFileOrDirectory, 'index.mdx'), content}];
	}

	const directory = potentials.find(({type}) => type === 'dir');
	if (!directory) {
		return [];
	}

	return getDirectory(mdxFileOrDirectory);
}

async function getDirectory(dir) {
	let dirList = await getDirList(dir);
	// Never download images, they're handled locally
	dirList = dirList.filter(({path}) => !imageRegex.test(path));

	const result = await Promise.all(
		dirList.map(async ({path: fileDir, type, sha}) => {
			switch (type) {
				case 'file': {
					return getFile(fileDir, sha);
				}

				case 'dir': {
					return getDirectory(fileDir);
				}

				default: {
					throw new Error(`Unexpected repo file type: ${type}`);
				}
			}
		})
	);

	return result.flat();
}

async function getFile(path, sha) {
	return getFileObject(path);
}

async function getDirList(dir) {
	const directory = await isDirectory(dir);

	if (directory) {
		const dirents = await readdir(dir, {withFileTypes: true});
		return dirents.map((dirent) => ({
			name: dirent.name,
			path: nodePath.join(dir, dirent.name),
			type: dirent.isDirectory() ? 'dir' : 'file'
		}));
	}

	return {
		path: dir
	};
}

export {
	getMdxFileOrDirectory,
	getDirectory,
	getFile,
	getDirList
};
