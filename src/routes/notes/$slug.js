import React from 'react';
import {json} from '@remix-run/data';
import {useRouteData} from '@remix-run/react';
import {getMDXComponent} from 'mdx-bundler/client';
import {getNote, getCategory} from '../../utils/note.server';
import mdxComponents from '../../utils/mdx-components';
import TableOfContents from '../../components/TableOfContents';
import Link from '../../components/Link';
import {Folder} from '../../components/Icon';
import {capitalize, slugify} from '../../utils';
import config from '../../../remix.config'

export const loader = async ({params}) => {
	if (config.noteCategories.includes(params.slug)) {
		const notes = await getCategory(params.slug)

		return json(notes, {
			headers: {
				'cache-control': 'public, max-age=300, stale-while-revalidate=86400'
			}
	});
	}

	const note = await getNote(params.slug);
	return json(note, {
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

export function meta({data: note}) {
	return {
		title: `${note.title} | Chase McCoy`
	};
}

export let handle = { section: 'notes' };

const Note = () => {
	const data = useRouteData()

	if (Array.isArray(data)) {
		return (
			<div className='prose'>
				<header>
					<h1>{capitalize(data[1].category)}</h1>
				</header>

				<main>
					{data.map((note) => (
						<p key={note.slug}>
							<Link to={`/notes/${note.slug}`}>{note.title}</Link>
							<br />
							<small>{note.excerpt}</small>
						</p>
					))}
				</main>
			</div>
		)
	}

	const {code, title, excerpt, toc, category} = data;
	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<article className="prose">
			<header className='flow'>
				<h1>{title}</h1>
				<p className='lead mt-8 color-caption'>{excerpt}</p>
				<p className='smaller mt-16'>
					<Link
						className='unstyled bold'
						to={`/notes/${slugify(category)}`}
						style={{color: 'var(--section-color)'}}
						css={`
							color: var(--section-color);
							&:hover {
								text-decoration: underline;
							}
						`}
					>
						<Folder
							className='inline'
							style={{position: 'relative', top: '-0.2em'}}
						/>{' '}
						{capitalize(category)}
					</Link>
				</p>
				<TableOfContents content={toc} />
				<hr className='dashed' />
			</header>

			<main className="prose">
				<Component components={mdxComponents} />
			</main>
		</article>
	);
};

export default Note;
