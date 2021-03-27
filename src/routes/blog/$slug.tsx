import React from 'react';
import {json} from '@remix-run/data';
import {useRouteData} from '@remix-run/react';
import {getMDXComponent} from 'mdx-bundler/client';
import {getPost} from '../../utils/post.server';
import mdxComponents from '../../utils/mdx-components';

export const loader = async ({params, context}) => {
	const post = await getPost(params.slug);

	const oneDay = 86400;
	const secondsSincePublished = (Date.now() - post.date) / 1000;
	const barelyPublished = secondsSincePublished < oneDay;

	// If this was barely published then only cache it for one minute, giving you
	// a chance to make edits and have them show up within a minute for visitors.
	// But after the first day, then cache for a week, then if you make edits
	// they'll show up eventually, but you don't have to rebuild and redeploy to
	// get them there.
	const maxAge = barelyPublished ? 60 : oneDay * 7;

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

const BlogPost = () => {
	const {code, frontmatter, title, excerpt} = useRouteData();
	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<>
			<header>
				<h1>{title}</h1>
				<p>{excerpt}</p>
			</header>
			<main className="prose">
				<Component components={mdxComponents} />
			</main>
		</>
	);
};

export default BlogPost;
