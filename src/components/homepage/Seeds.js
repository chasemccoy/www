import React from 'react';
import Link from '../Link';
import {Seeds} from '../Icon';

const SeedsPage = () => {
	return (
		<div className="homepage--seeds mobile-breakout">
			<section className="prose hyphens">
				<Link className="unstyled" to="https://seeds.sproutsocial.com">
					<h2 className="mt-0">
						<Seeds className="logo mr-12" />
						<span className="mr-12">Seeds</span>
						<span className="subtitle">
							Sprout Social’s design system and component library.
						</span>
					</h2>
				</Link>

				<p className="lead">
					As lead of the Design Systems team at Sprout I{' '}
					<Link to="https://sproutsocial.com/insights/sprout-social-design-refresh">
						helped ship a complete redesign of our product
					</Link>
					, developed a{' '}
					<Link to="https://medium.com/styled-components/how-to-build-a-great-component-library-a40d974a412d">
						themeable component library
					</Link>
					, and{' '}
					<Link to="https://medium.com/sprout-social-design/design-system-health-3004551060f0">
						fostered a healthy community to support our system
					</Link>
					.
				</p>

				<p>
					The{' '}
					<Link to="https://seeds.sproutsocial.com">Seeds design system</Link>{' '}
					covers a large breath of content for stakeholders across product and
					brand design, writing, engineering, and more. Under my leadership, a
					small team of 3 people grew this system from the ground up to support
					a massive product organization. I used both my technical and design
					skills to help us achieve a system powered by a strong community of
					users and contributors.
				</p>
			</section>

			<img
				src='/images/seeds-screenshot.png'
				alt=""
				className="mt-32"
				style={{
					width: 'calc(100% - var(--padding))',
					marginLeft: 'auto'
				}}
			/>

			<section className="hyphens prose color-gray--400">
				<img
					src='/images/seeds.png'
					className="photo-site"
					alt="A photograph of the Seeds website on a laptop."
				/>

				<p className="intro mt-0 larger">
					A successful design system practice combines two things:{' '}
					<span className="product">products</span> and{' '}
					<span className="program">programs</span>
				</p>

				<p>
					<span className="product">Products</span> take the form of
					documentation websites, design tokens, component libraries, and custom
					design or developer tools. The problems in this space are often
					technical and lay the foundation for a healthy system.
				</p>

				<img
					src='/images/ds-planning.jpg'
					alt="A screenshot of the Sprout Social web application."
					className="photo-planning"
				/>

				<div className="mobile-photos prose">
					<img
						src='/images/seeds.png'
						alt="A photograph of the Seeds website on a laptop."
					/>
					<img
						src='/images/ds-planning.jpg'
						alt="A screenshot of the Sprout Social web application."
					/>
				</div>

				<p className="clear-right">
					While product help to make our user’s work more correct and efficient,{' '}
					<span className="program">programs</span> make work more collaborative
					and inclusive. These are the services and activities that the system
					team provides to their users. I like to focus on three in particular:
				</p>

				<ol className="mt-16 mb-12 pb-4 pl-12">
					<li>
						<p>
							<b>Consultation</b>
						</p>
					</li>
					<li style={{'--accent-color': 'var(--color-green)'}}>
						<p>
							<b>Partnership</b>
						</p>
					</li>
					<li style={{'--accent-color': 'var(--color-blue)'}}>
						<p>
							<b>Documentation</b>
						</p>
					</li>
				</ol>

				<p>
					Providing services like these for our users builds trust and
					investment in the system, and helps them integrate systems thinking
					back into their own work. Being service-oriented also provides lots of
					great opportunities for on-the-spot user research that, in turn, can
					be used to improve our core products and programs.
				</p>

				<Link
					to="https://seeds.sproutsocial.com"
					className="unstyled cta bold larger mt-24"
				>
					Visit Seeds to learn more
				</Link>
			</section>
		</div>
	);
};

export default SeedsPage;
