import React from 'react';
import {json} from '@remix-run/data';
import {useRouteData} from '@remix-run/react';
import {getMDXComponent} from 'mdx-bundler/client';
import {getNote, getCategory} from '../../utils/note.server';
import mdxComponents from '../../utils/mdx-components';
import TableOfContents from '../../components/TableOfContents';
import Link from '../../components/Link';
import {capitalize} from '../../utils';
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

	const {code, title, excerpt, toc} = data;
	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<div className="prose">
			<header>
				<h1>{title}</h1>
				<p>{excerpt}</p>
			</header>
			<main className="prose">
				<TableOfContents content={toc} />
				<Component components={mdxComponents} />
			</main>
		</div>
	);
};

export default Note;
