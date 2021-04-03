import React from 'react';
import Head from 'next/head'
import {getMDXComponent} from 'mdx-bundler/client';
import {getNote, getCategory, getNotes} from '../../utils/note';
import mdxComponents from '../../utils/mdx-components';
import TableOfContents from '../../components/TableOfContents';
import Link from '../../components/Link';
import {Folder} from '../../components/Icon';
import {capitalize} from '../../utils';
import config from '../../../next.config'

const Note = ({notes, note}) => {
	if (Array.isArray(notes)) {
		return (
			<div className='prose'>
				<Head>
					<link rel="stylesheet" href="/styles/notes.css" />
				</Head>

				<header>
					<h1>{capitalize(notes[1].category.replace('-', ' '))}</h1>
				</header>

				<main>
					{notes.map((item) => (
						<p key={item.slug}>
							<Link to={`/notes/${item.slug}`}>{item.title}</Link>
							<br />
							<small>{item.excerpt}</small>
						</p>
					))}
				</main>
			</div>
		)
	}

	const {code, title, excerpt, toc, category} = note;
	const Component = React.useMemo(() => getMDXComponent(code), [code]);

	return (
		<article className="prose">
			<Head>
        <link rel="stylesheet" href="/styles/notes.css" />
      </Head>

			<header className='flow'>
				<div className='badge mb-16'>Note</div>
				<h1>{title}</h1>
				<p className='lead mt-8 color-caption'>{excerpt}</p>
				<p className='smaller mt-16'>
					<Link
						className='unstyled bold'
						to={`/notes/${category}`}
						style={{color: 'var(--section-color)'}}
						css={`
							color: var(--section-color);
							&:hover {
								text-decoration: underline;
							}
						`}
					>
						<Folder
							className='inline mr-4'
							style={{position: 'relative', top: '-0.2em'}}
						/>
						{capitalize(category.replace('-', ' '))}
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

export const getStaticProps = async ({ params }) => {
	if (config.noteCategories.includes(params.slug)) {
		const notes = await getCategory(params.slug)

		return {
			props: {notes}
		}
	}

	const note = await getNote(params.slug);
	
	return {
		props: {note}
	}
}

export const getStaticPaths = async () => {
	const notes = await getNotes()

	const notePaths = notes.map(note => ({
		params: {slug: note.slug}
	}))

	const categoryPaths = config.noteCategories.map(category => ({
		params: {slug: category}
	}))

	return {
		paths: [...notePaths, ...categoryPaths],
		fallback: false
	}
}

export default Note;
