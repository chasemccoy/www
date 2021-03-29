import nodePath from 'path';
import fs from 'fs';
import {octokit} from './octokit.server';
import config from '../../remix.config';

const USE_FILESYSTEM_IN_DEV_MODE = true;

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

async function downloadMdxFileOrDirectory(mdxFileOrDirectory) {
	const parentDir = nodePath.dirname(mdxFileOrDirectory);
	const dirList = await downloadDirList(parentDir);

	const basename = nodePath.basename(mdxFileOrDirectory);
	const potentials = dirList.filter(({name}) => name.startsWith(basename));

	const file = potentials.find(({name}) => name.endsWith('mdx'));
	if (file) {
		const {content} = await downloadFile(file.path, file.sha);
		// /content/about.mdx => entry is about.mdx, but compileMdx needs
		// the entry to be called "/content/index.mdx" so we'll set it to that
		// because this is the entry for this path
		return [{path: nodePath.join(mdxFileOrDirectory, 'index.mdx'), content}];
	}

	const directory = potentials.find(({type}) => type === 'dir');
	if (!directory) {
		return [];
	}

	return downloadDirectory(mdxFileOrDirectory);
}

async function downloadDirectory(dir) {
	let dirList = await downloadDirList(dir);
	// Never download images, they're handled locally
	dirList = dirList.filter(({path}) => !imageRegex.test(path));

	const result = await Promise.all(
		dirList.map(async ({path: fileDir, type, sha}) => {
			switch (type) {
				case 'file': {
					return downloadFile(fileDir, sha);
				}

				case 'dir': {
					return downloadDirectory(fileDir);
				}

				default: {
					throw new Error(`Unexpected repo file type: ${type}`);
				}
			}
		})
	);

	return result.flat();
}

async function downloadFile(path, sha) {
	if (process.env.NODE_ENV === 'development' && USE_FILESYSTEM_IN_DEV_MODE) {
		return getFileObject(path);
	}

	const {data} = await octokit.request(
		'GET /repos/{owner}/{repo}/git/blobs/{file_sha}',
		{
			owner: config.content.owner,
			repo: config.content.repo,
			file_sha: sha
		}
	);
	const {encoding} = data;
	return {path, content: Buffer.from(data.content, encoding).toString()};
}

async function downloadDirList(dir) {
	if (process.env.NODE_ENV === 'development' && USE_FILESYSTEM_IN_DEV_MODE) {
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

	const {data} = await octokit.repos.getContent({
		owner: config.content.owner,
		repo: config.content.repo,
		path: dir
	});

	// If (!Array.isArray(data)) {
	//   throw new Error(
	//     `Tried to download content from ${JSON.stringify(
	//       config.content,
	//     )} at ${dir}. GitHub did not return an array of files. This should never happen...`,
	//   )
	// }

	return data;
}

export {
	downloadMdxFileOrDirectory,
	downloadDirectory,
	downloadFile,
	downloadDirList
};
