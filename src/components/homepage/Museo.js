import React from 'react';
import Link from '../Link';

const Museo = (props) => {
	return (
		<div className="museo" {...props}>
			<div className="prose">
				<div>
					<h1>
						<Link to="https://museo.app" className="unstyled">
							<span className="color-blue">Museo</span>
							<span className='subtitle'>
								.app
							</span>
						</Link>
					</h1>

					<p className="lead mt-0">
						A visual search engine for free-to-use images from some of the best
						museums in the world.
					</p>
				</div>

				<div className="mt-0">
					<p className="smaller mt-8">
						<Link to="https://museo.app">Museo</Link> is an open source web
						interface that connects you with the the following institutions:
					</p>

					<ul className="smaller mt-8">
						<li>
							<Link to="https://www.artic.edu/archival-collections/explore-the-collection">
								The Art Institute of Chicago
							</Link>
						</li>
						<li>
							<Link to="https://www.rijksmuseum.nl/nl">The Rijksmuseum</Link>
						</li>
						<li>
							<Link to="https://harvardartmuseums.org">
								The Harvard Art Museums
							</Link>
						</li>
						<li>And more...</li>
					</ul>

					<p className="smaller mt-12">
						This tool is possible because these institutions provide open and
						free API access to their collections. All of the images you find
						with Museo are completely free-to-use, so download away.
					</p>
				</div>
			</div>

			<div className="image-container">
				<img
					src='/images/museo.png'
					alt="View of the Golden Bend in the Herengracht, Gerrit Adriaensz."
				/>
				<img
					src='/images/museo.jpg'
					className="mobile-only mobile-breakout"
					alt="View of the Golden Bend in the Herengracht, Gerrit Adriaensz."
				/>
			</div>
		</div>
	);
};

export default Museo;
