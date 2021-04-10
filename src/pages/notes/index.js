import React from 'react';
import Head from 'next/head'
import {getNotes} from '../../utils/note';
import Link from '../../components/Link';
import Marker from '../../components/Marker';
import {capitalize} from '../../utils';
import {Folder} from '../../components/Icon';
import clsx from 'clsx'
import Metadata from '../../components/Metadata';
import { quotes } from '../../../notes/misc/quotes/Quotes'
 
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

const Notes = ({ notes }) => {
	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

	React.useEffect(() => {
    document.querySelector('body').dataset.section = 'notes'
  })

	return (
		<div className='prose'>
			<Head>
        <link rel="stylesheet" href="/styles/notes.css" />
      </Head>

			<Metadata title="Notes" />

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

			<main>
				{/* <h2 className='eyebrow'>Categories</h2> */}
				<div className='mt-32 mb-16 grid' style={{'--item-min-size': '225px'}}>
					<FeaturedCard title='Code' description='Useful code snippets and techniqes for making great websites.' image='/images/terminal.png' url='/notes/code' className='code' />
					<FeaturedCard title='Design systems' description='Useful code snippets and techniqes for making great websites.' image='/images/design-systems.png' url='/notes/design-systems' className='green' />

					<div className='quote-card p-12' style={{background: 'var(--color-gray--100)', borderRadius: '12px'}}>
						<p>{randomQuote.content}</p>
						<div className='mt-8 flex align--center space-between'>
							<p className='italic bold'>— {randomQuote.metadata}</p>
						</div>

						<Link to="/notes/quotes" className='button mt-16 px-8 py-4 block unstyled bold smaller' style={{background: 'var(--color-purple)', borderRadius: '8px', textAlign: 'center', color: 'white'}}>More quotes →</Link>
					</div>
				</div>

				

				{/* <hr /> */}
				<h2 className='eyebrow mt-48'>All notes</h2>

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
						<div className='flow' style={{'--flow-spacing': '0.75em'}}>
							{notes[category].map((note, j) => (
								<React.Fragment key={note.slug}>
									{j !== 0 && <hr className='dashed' />}
									<Link to={`/notes/${note.slug}`} className='block unstyled no-hover'>
										<p className='bold'>{note.title}</p>
										<p>{note.excerpt}</p>
									</Link>
								</React.Fragment>
							))}
						</div>
					</div>
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

export const getStaticProps = async (context) => {
	const notes = await getNotes(false)
	
  return {
    props: {notes}
  }
}

export default Notes;
