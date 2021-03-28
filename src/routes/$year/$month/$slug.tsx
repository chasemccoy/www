import React from 'react';
import {json} from '@remix-run/data';
import {useRouteData} from '@remix-run/react';
import {getMDXComponent} from 'mdx-bundler/client';
import {getPost} from '../../../utils/post.server';
import mdxComponents from '../../../utils/mdx-components';
import { formatDate } from '../../../utils';
import styles from 'css:../../../styles/pages/blog.css'

export const loader = async ({params, context}) => {
	const post = await getPost(params.slug);

	const date = new Date(post.date);
	const year = date.getFullYear().toString();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);

	if (params.year !== year || params.month !== month) {
		return new Response('Not found', {status: 404});
	}

	const oneDay = 86400;
	const secondsSincePublished = (Date.now() - post.date) / 1000;
	const barelyPublished = secondsSincePublished < oneDay;

	// If this was barely published then only cache it for one minute, giving you
	// a chance to make edits and have them show up within a minute for visitors.
	// But after the first day, then cache for a week, then if you make edits
	// they'll show up eventually, but you don't have to rebuild and redeploy to
	// get them there.
	// const maxAge = barelyPublished ? 60 : oneDay * 7;

	const maxAge = 300; // 5 minutes

	// If the max-age has expired, we'll still send the current cached version of
	// the post to visitors until the CDN has cached the new one. If it's been
	// expired for more than one month though (meaning nobody has visited this
	// page for a month) we'll make them wait to see the newest version.
	const swr = oneDay * 30;

	return json(post, {
		headers: {
			'cache-control': `public, max-age=${maxAge}, stale-while-revalidate=${swr}`
		}
	});
};

export function headers({loaderHeaders}) {
	return {
		'cache-control': loaderHeaders.get('cache-control')
	};
}

export function meta({data: post}) {
	return {
		title: `${post.title} | Chase McCoy`
	};
}

export const links = () => {
	return [{rel: 'stylesheet', href: styles}];
};

export let handle = { section: 'blog' };

const BlogPost = () => {
	const {code, title, excerpt, date} = useRouteData();
	const Component = React.useMemo(() => getMDXComponent(code), [code]);
	const formattedDate = formatDate(new Date(date))

	return (
		<article className="prose">
			<header className='flow'>
				<div className='badge mb-16'>Blog post</div>
				<h1>{title}</h1>
				<p className='lead mt-8 color-caption'>{excerpt}</p>
				<p className='smaller mt-16 color-caption bold'>{formattedDate}</p>
				<hr className='dashed' />
			</header>

			<Component components={mdxComponents} />
		</article>
	);
};

export default BlogPost;
