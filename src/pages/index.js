import React from 'react';
import Head from 'next/head'
import Link from '../components/Link';
import {Globe, Stripe} from '../components/Icon';
import DesignSystems from '../components/homepage/DesignSystems';
import Marker from '../components/Marker';
import FeaturedPosts from '../components/FeaturedPosts';
import Museo from '../components/homepage/Museo';
import Seeds from '../components/homepage/Seeds';
import {getPosts} from '../utils/post';

const Avatar = () => (
	<div className="avatar">
		<div>
			<img src='/images/avatar-yellow.png' alt="Chase McCoy" />
		</div>
	</div>
);

const Index = ({ posts }) => {
	return (
		<>
			<Head>
        <link rel="stylesheet" href="/styles/homepage.css" />
      </Head>

			<h2
				className="mb-12 serif hyphens"
				style={{
					fontSize: '1.7rem',
					lineHeight: 1.3,
					marginTop: '-6px'
				}}
			>
				Chase McCoy is a{' '}
				<span style={{color: 'var(--color-green)'}}>
					product designer&nbsp;✐
				</span>
				,{' '}
				<span style={{color: 'var(--color-blue)'}}>
					front-end engineer&nbsp;
					<span
						style={{
							fontSize: '2em',
							lineHeight: '1rem',
							verticalAlign: 'middle'
						}}
					>
						⌨&#xFE0E;
					</span>
				</span>
				, and{' '}
				<span style={{color: 'var(--color-red)'}}>
					internet explorer&nbsp;
					<Globe style={{display: 'inline', marginTop: '-4px'}} />
				</span>{' '}
				working on{' '}
				<span style={{color: 'var(--color-yellow)'}}>
					design systems&nbsp;❏
				</span>{' '}
				at{' '}
				<Link className='unstyled' to="https://stripe.com">
					<Stripe
						height="1em"
						style={{
							display: 'inline',
							verticalAlign: 'text-bottom',
							transform: 'translateY(-1px)'
						}}
					/>
				</Link>
			</h2>

			<div className="prose">
				<Avatar />
				
				<p className="hyphens">
					Growing up online is where I developed a love for visual and interface
					design, and I earned a degree in Computer Science so I could make
					those designs real. I got my start doing iOS design and development,
					but I spend most of my time these days thinking about the web—how it
					works, how it’s changing, and how we can make it a better place.
				</p>

				<p>
					This website is my home on the web, and in{' '}
					<Link to="https://thecreativeindependent.com/people/laurel-schwulst-my-website-is-a-shifting-house-next-to-a-river-of-knowledge-what-could-yours-be/">
						the words of Laurel Schwulst
					</Link>{' '}
					it is truly “a shifting house next to a river of knowledge.” I use
					this site to share my thoughts, keep a record of my work, and catalog
					the things I discover online.
				</p>

				<FeaturedPosts posts={posts} />
				{/* <ContactMe /> */}
			</div>

			<Marker className="mt-40">Now</Marker>

			<DesignSystems />

			<hr className="mt-40 mb-24" />

			<Museo />

			<div>
				<Marker className="mt-40 previously">Previously</Marker>

				<Seeds />

				{/* <Pico /> */}
			</div>
		</>
	);
};

export const getStaticProps = async (context) => {
	const posts = await getPosts()
	const featuredPosts = posts.filter((post) => Boolean(post.featured));
	
  return {
    props: {posts: featuredPosts}
  }
}


export default Index;
