import React from 'react';
import {useRouteData} from '@remix-run/react';
import {json} from '@remix-run/data';
import {getPosts} from '../utils/post.server';
import Link from '../components/Link';
import styles from 'css:../styles/pages/blog.css'

export const loader = async () => {
	return json(await getPosts(), {
		headers: {
			'cache-control': 'public, max-age=300, stale-while-revalidate=86400'
		}
	});
};

export function headers() {
	return {
		'cache-control': 'public, max-age=300'
	};
}

export function meta() {
	return {
		title: 'Blog | Chase McCoy'
	};
}

export const links = () => {
	return [{rel: 'stylesheet', href: styles}];
};

export let handle = { section: 'blog' };

const Blog = () => {
	const posts = useRouteData();

	return (
		<div className='flow'>
			{/* <header>
				<h1>Blog</h1>
			</header> */}

			<main className='flow' style={{'--flow-spacing': '1.5em', marginTop: '-8px'}}>
				{posts.map((post) => (
					<Link href={post.slug} className='block unstyled no-hover' key={post.slug}>
						<article>
							<h2 className='serif' style={{fontSize: '1.5em'}}>{post.title}</h2>
							<p className='color-caption'>{post.excerpt}</p>
						</article>
					</Link>
				))}
			</main>
		</div>
	);
};

export default Blog;
