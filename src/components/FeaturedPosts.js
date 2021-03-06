import React from 'react';
import Link from './Link';
import {getColorForSection} from '../utils';

const FeaturedPosts = ({posts}) => {
	return (
		<>
			<h3 className="mt-24 subheader">Featured writing</h3>

			<p
				className="mt-4 serif larger"
				style={{'--section-color': getColorForSection('blog')}}
			>
				{posts.slice(0, 4).map((post, i) => (
					<React.Fragment key={i}>
						{Boolean(i) && <span className="color-gray--500 mx-8">×</span>}
						<Link
							to={post.slug}
							style={{
								textDecorationColor: 'var(--color-gray--600)'
							}}
						>
							{post.title}
						</Link>
					</React.Fragment>
				))}
			</p>
		</>
	);
};

export default FeaturedPosts;
