import sortBy from 'sort-by';
import matter from 'gray-matter';
import config from '../../next.config';
import {
	downloadMdxFileOrDirectory,
	downloadFile,
	downloadDirList
} from './github.js';
import {compileMdx} from './compile-mdx.server.js';

export const getSlugForPost = (slug, postDate) => {
	const date = new Date(postDate);
	const year = date.getFullYear().toString();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	return `/${year}/${month}/${slug}`;
};

const getParamsForPost = (slug, postDate) => {
	const date = new Date(postDate);
	const year = date.getFullYear().toString();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	return {year, month, slug}
};

async function getPost(slug) {
	const postFiles = await downloadMdxFileOrDirectory(
		`${config.content.path}/${slug}`
	);

	const {code, frontmatter} = await compileMdx(slug, postFiles);
	frontmatter.date = new Date(frontmatter.date).toISOString()
	return {slug, code, ...frontmatter};
}

async function getPosts() {
	const data = await downloadDirList(config.content.path);

	if (!Array.isArray(data)) {
		throw new TypeError();
	}

	const result = await Promise.all(
		data.map(async ({path: fileDir}) => {
			const fileData = await downloadDirList(fileDir);

			const file = Array.isArray(fileData)
				? fileData.find(
						({type, path}) => type === 'file' && path.endsWith('mdx')
				  )
				: fileData;

			if (!file) {
				console.warn(`No index.mdx file for ${fileDir}`);
				return null;
			}

			const postFile = await downloadFile(file.path, file.sha);
			return {
				...postFile,
				slug: fileDir.replace(`${config.content.path}/`, '').replace('.mdx', '')
			};
		})
	);

	const files = result.filter((v) => Boolean(v));

	const posts = await Promise.all(
		files.map(async ({slug, content}) => {
			const matterResult = matter(content);
			const frontmatter = matterResult.data;
			frontmatter.date = new Date(frontmatter.date).toISOString()
			const params = getParamsForPost(slug, frontmatter.date)
			const fullSlug = `/${params.year}/${params.month}/${slug}`;

			return {
				slug: fullSlug,
				params: {...params},
				...frontmatter
			};
		})
	);

	return posts.filter(({title}) => Boolean(title)).sort(sortBy('-date'));
}

export {getPost, getPosts};
