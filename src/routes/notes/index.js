import React from 'react';
import {useRouteData} from '@remix-run/react';
import {json} from '@remix-run/data';
import {getNotes} from '../../utils/note.server';
import terminal from 'img:../../images/terminal.png';
import designSystems from 'img:../../images/design-systems.png';
import styles from 'css:../../styles/pages/notes.css'
import Link from '../../components/Link';

const FeaturedCard = ({title, description, image, url}) => (
	<Link to={url} className='featured-card unstyled p-16 block'>
		<img src={image} alt="" />
		<h2 className='mt-12 smaller' style={{fontSize: '1.5em'}}>{title}</h2>
		<p className='mt-4 color-caption'>{description}</p>
	</Link>
)

export const loader = async () => {
	return json(await getNotes(), {
		headers: {
			'cache-control': 'public, max-age=300, stale-while-revalidate=86400'
		}
	});
};

export function headers({loaderHeaders}) {
	return {
		'cache-control': loaderHeaders.get('cache-control')
	};
}

export function meta() {
	return {
		title: 'Notes | Chase McCoy'
	};
}

export const links = () => {
	return [{rel: 'stylesheet', href: styles}];
};

export let handle = { section: 'notes' };

const Notes = () => {
	const notes = useRouteData();

	return (
		<div className='prose'>
			<header>
				<h1>Notes</h1>
			</header>

			<main>
				<div className='grid' style={{margin: '24px -8px'}}>
					<FeaturedCard title='Code' description='Useful code snippets and techniqes for making great websites.' image={terminal.src} url='/notes/code' />
					<FeaturedCard title='Design systems' description='Useful code snippets and techniqes for making great websites.' image={designSystems.src} url='/notes/code' />
				</div>

				{notes.map((note) => (
					<p key={note.slug}>
						<Link to={`/notes/${note.slug}`}>{note.title}</Link>
						<br />
						<small>{note.excerpt}</small>
					</p>
				))}
			</main>
		</div>
	);
};

export default Notes;
