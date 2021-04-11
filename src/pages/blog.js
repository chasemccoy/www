import React from 'react';
import Head from 'next/head'
import {getPosts} from '../utils/post';
import Link from '../components/Link';
import Metadata from '../components/Metadata';

const Blog = ({ posts }) => {
	React.useEffect(() => {
    document.querySelector('body').dataset.section = 'blog'
  })

	return (
		<div className='flow'>
			<Head>
        <link rel="stylesheet" href="/styles/blog.css" />
      </Head>

			<Metadata title='Blog' description="What's on my mind, and links to some interesting stuff on the web." />
			
			{/* <header>
				<h1>Blog</h1>
			</header> */}

			<main className='flow' style={{marginTop: '-4px'}}>
				{posts.map((post, i) => (
					<React.Fragment key={post.slug}>
						{i !== 0 && <hr className='dashed' />}
						<Link href={post.slug} className='block unstyled no-hover'>
							<article>
								<h2 className='serif tighter' style={{fontSize: '1.4em'}}>{post.title}</h2>
								<p className='color-caption'>{post.excerpt}</p>
							</article>
						</Link>
					</React.Fragment>
				))}
			</main>
		</div>
	);
};

export const getStaticProps = async (context) => {
	const posts = await getPosts()
	
  return {
    props: {posts}
  }
}

export default Blog;
