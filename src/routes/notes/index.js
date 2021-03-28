import React from 'react';
import {useRouteData} from '@remix-run/react';
import {json} from '@remix-run/data';
import {getNotes} from '../../utils/note.server';
import terminal from 'img:../../images/terminal.png';
import designSystems from 'img:../../images/design-systems.png';
import styles from 'css:../../styles/pages/notes.css'
import Link from '../../components/Link';
import {capitalize} from '../../utils';
import {Folder} from '../../components/Icon';
import clsx from 'clsx'

const FeaturedCard = ({title, description, image, url, className}) => (
	<Link to={url} className={clsx('featured-card', 'unstyled', 'block', className)}>
		<img src={image} alt="" />
		<div className='p-16'>
			<h2 className='mt-0 smaller' style={{fontSize: '1.5em'}}>
				<Folder 
					className='inline mr-8' 
					style={{width: '1em', position: 'relative', top: '-0.16em'}}
				/> 
				{title}
			</h2>
			<p className='mt-4 color-caption'>{description}</p>
		</div>
	</Link>
)

export const loader = async () => {
	return json(await getNotes(false), {
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
				<div className='mb-24 grid' style={{'--item-min-size': '225px'}}>
					<FeaturedCard title='Code' description='Useful code snippets and techniqes for making great websites.' image={terminal.src} url='/notes/code' />
					<FeaturedCard title='Design systems' description='Useful code snippets and techniqes for making great websites.' image={designSystems.src} url='/notes/design-systems' className='green' />
				</div>

				<hr />

				{Object.keys(notes).map(category => (
					<React.Fragment key={category}>
						<h2>
							<Link to={`/notes/${category}`} className='unstyled'>
								<Folder 
									className='inline mr-8 color-caption' 
									style={{width: '1em', position: 'relative', top: '-0.18em'}}
								/> 
								{capitalize(category).replace('-', ' ')}
							</Link>
						</h2>
						<div className='flow'>
							{notes[category].map((note) => (
								<Link to={`/notes/${note.slug}`} className='block unstyled' key={note.slug}>
									<p className='bold'>{note.title}</p>
									<p>{note.excerpt}</p>
								</Link>
							))}
						</div>
					</React.Fragment>
				))}

				{/* {notes.map((note) => (
					<p key={note.slug}>
						<Link to={`/notes/${note.slug}`}>{note.title}</Link>
						<br />
						<small>{note.excerpt}</small>
					</p>
				))} */}
			</main>
		</div>
	);
};

export default Notes;
