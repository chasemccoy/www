import nodePath from 'path';
import matter from 'gray-matter';
import config from '../../next.config';
import {
	downloadMdxFileOrDirectory,
	downloadFile,
	downloadDirList
} from './github';
import {compileMdx} from './compile-mdx';

async function getNote(slug) {
	const notes = await getNotes();
	const note = notes.find((note) => note.slug === slug);
	if (!note) { return null}
	const postFiles = await downloadMdxFileOrDirectory(
		`notes/${note.category}/${slug}`
	);

	const {code, frontmatter, toc} = await compileMdx(slug, postFiles);
	if (frontmatter.modified) {
		frontmatter.modified = new Date(frontmatter.modified).toISOString()
	}
	return {slug, code, ...frontmatter, toc, category: note.category};
}

async function getCategory(category) {
	const data = await downloadDirList(nodePath.join('notes', category));

	if (!Array.isArray(data)) {
		throw new TypeError('Something went wrong with the request to GitHub');
	}

	const result = await Promise.all(
		data.map(async ({path: fileDir}) => {
			const fileData = await downloadDirList(fileDir);

			const file = Array.isArray(fileData)
				? fileData.find(
						({type, path}) =>
							(type === 'file' && path.endsWith('mdx')) || path.endsWith('md')
				  )
				: fileData;

			if (!file) {
				console.warn(`No index.mdx file for ${fileDir}`);
				return null;
			}

			const postFile = await downloadFile(file.path, file.sha);

			return {
				...postFile,
				slug: fileDir
					.replace('notes/', '')
					.replace(`${category}/`, '')
					.replace('.mdx', '')
			};
		})
	);

	const files = result.filter((v) => Boolean(v));

	const posts = await Promise.all(
		files.map(async ({slug, content}) => {
			const matterResult = matter(content);
			const frontmatter = matterResult.data;
			if (frontmatter.modified) {
				frontmatter.modified = new Date(frontmatter.modified).toISOString()
			}
			return {slug, ...frontmatter, category};
		})
	);

	return posts;
}

async function getNotes(flat = true) {
	const result = await Promise.all(
		config.noteCategories.map((category) => {
			return getCategory(category);
		})
	);

	if (!flat) {
		const groups = result.reduce((acc, posts) => {
			const category = posts[0].category
			return {
				...acc,
				[category]: posts
			}
		}, {})
	
		return groups
	}

	return result.flat();
}

export {getNote, getCategory, getNotes};
