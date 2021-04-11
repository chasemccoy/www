import React from 'react';
import Head from 'next/head'
import {getNotes} from '../../utils/note';
import Link from '../../components/Link';
import Marker from '../../components/Marker';
import {capitalize} from '../../utils';
import {Folder} from '../../components/Icon';
import clsx from 'clsx'
import Metadata from '../../components/Metadata';
import NoteList from '../../components/NoteList';
import Now from '../../components/Now';
import { quotes } from '../../../notes/misc/quotes/Quotes'
import { recents as recentBooks } from '../../../notes/misc/books/Books'
 
const FeaturedCard = ({title, description, image, url, className}) => (
	<Link to={url} className={clsx('featured-card', 'unstyled', 'flex', 'flex-column', 'space-between', className)}>
		<img src={image} alt="" />
		<div className='px-16 pb-16'>
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

const Notes = ({ notes }) => {
	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
	const recentBook = recentBooks[0]

	React.useEffect(() => {
    document.querySelector('body').dataset.section = 'notes'
  })

	return (
		<div className='prose'>
			<Head>
        <link rel="stylesheet" href="/styles/notes.css" />
      </Head>

			<Metadata title="Notes" description="My digital garden containing a collection of links, thoughts, ideas, images, quotes, and other miscellanea I've collected on my travels across the web." />

			<header>
				<h1><span className='smaller' style={{position: 'relative', top: '-3px'}}>🌱</span> Notes</h1>
				<p
					className="mt-12 serif hyphens"
					style={{
						fontSize: '1.4rem',
						lineHeight: 1.3,
					}}
				>
					Welcome to my <Link to='/notes/digital-gardens' className='italic'
					style={{
						textDecoration: 'underline',
						textDecorationColor: 'var(--section-color)',
						textDecorationThickness : '2px'
					}}>
					digital&nbsp;garden
				</Link>—a personal wiki of neat stuff I’ve collected during my travels on the web.
				</p>
			</header>

			<main className='mt-12'>
				<p>This section is a grab bag of links, clippings, and notes on any and all subjects (but mostly web stuff). Notes here are evergreen and are often updated or changed as I learn mroe about a subject.</p>

				<Now />

				<Marker className='mt-32'>Featured</Marker>

				<div className='mt-24 mb-16 grid' style={{'--item-min-size': '225px'}}>
					<FeaturedCard title='Code' description='Useful code snippets and techniqes for making great websites.' image='/images/terminal.png' url='/notes/code' className='code' />

					<div className='quote-card p-16 flex flex-column space-between' style={{background: 'var(--color-gray--100)', borderRadius: '12px'}}>
						<div>
							<p>{randomQuote.content}</p>
							<div className='mt-8 flex align--center space-between'>
								<p className='italic bold'>— {randomQuote.metadata}</p>
							</div>
						</div>

						<Link to="/notes/quotes" className='button mt-16 px-8 py-8 block unstyled bold smaller no-hover' style={{background: 'var(--color-yellow)', borderRadius: '8px', textAlign: 'center'}}>More quotes →</Link>
					</div>

					<div className='quote-card p-16 flex flex-column' style={{background: 'var(--color-gray--100)', borderRadius: '12px', justifyContent: 'flex-end'}}>
						<div className='flex align--flex-start'>
							<img src={`/img/books/${recentBook.image}`} alt={recentBook.title} style={{width: '40%', borderRadius: '4px', alignSelf: 'flex-start'}} />

							<div className='ml-12' style={{alignSelf: 'flex-end'}}>
								<p className='smaller color-caption'>Recently read</p>
								<p className='mt-8'>
									<span className='bold tighter' style={{fontSize: '1.5rem'}}>{recentBook.title}</span><br /> by {recentBook.author}
								</p>
							</div>
						</div>

						<Link to="/notes/books" className='button mt-16 px-8 py-8 block unstyled bold smaller no-hover' style={{background: 'var(--color-blue)', borderRadius: '8px', textAlign: 'center'}}>What I’m reading →</Link>
					</div>

					<FeaturedCard title='Design systems' description='Notes on what they are, how they work, and more.' image='/images/design-systems.png' url='/notes/design-systems' className='green' />
				</div>

				<Marker className='mt-48'>All notes</Marker>

				{Object.keys(notes).map((category, i) => (
					<div className={clsx(i > 0 ? 'mt-48': 'mt-24')} key={category}>
						<h2 className='mt-0'>
							<Link to={`/notes/${category}`} className='unstyled'>
								<Folder 
									className='inline mr-8 color-caption' 
									style={{width: '1em', position: 'relative', top: '-0.18em'}}
								/> 
								{capitalize(category).replace('-', ' ')}
							</Link>
						</h2>

						<NoteList notes={notes[category]} />
					</div>
				))}
			</main>
		</div>
	);
};

export const getStaticProps = async (context) => {
	const notes = await getNotes(false)
	
  return {
    props: {notes}
  }
}

export default Notes;
