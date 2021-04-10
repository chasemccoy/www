import React from 'react';
import Link from "../components/Link";
import sortBy from 'sort-by'
import clsx from 'clsx'
import Metadata from '../components/Metadata';

export const recents = [
  {
		title: 'Circe',
		author: 'Madeline Miller',
		url: "https://bookshop.org/books/circe-9781549117640/9780316556347",
		image: "circe.jpg",
	},
  {
		title: 'We Were Eight Years in Power',
		author: 'Ta-Nehisi Coates ',
		url: "https://bookshop.org/books/we-were-eight-years-in-power-an-american-tragedy/9780399590573",
		image: "eight-years.jpg",
	},
   {
		title: 'How to Do Nothing',
		author: 'Jenny Odell',
		url: "https://bookshop.org/books/how-to-do-nothing-resisting-the-attention-economy/9781612197494",
		image: "do-nothing.jpg",
	}
]

export const favorites = [
  {
		title: 'The Perks of Being a Wallflower',
		author: 'Stephen Chbosky',
		description: "If you read any book on this page, let it be this one. Have you ever read a story and felt as though it was somehow written about you? That's how I feel about *Perks*. It's heartbreaking, funny, and captures what it's like to grow up and navigate the world.",
		url: "https://www.amazon.com/Stephen-Chbosky-Perks-Wallflower-1-2-1999/dp/B00HTK217O",
		image: "perks.jpg",
	},
	{
		title: "Grid Systems in Graphic Design",
		author: "Josef Müller-Brockmann",
		description: "There are tons of resources out there to learn about web design, but one of my favorite resources is classic graphic design books that focus on print. If you can learn the basics of grids in print design, you will have a design superpower in your toolbelt. This book is one of my favorite on grids (and design in general).",
		url: "https://www.amazon.com/dp/3721201450/ref=cm_sw_r_cp_dp_T1_DqLFzbJPXTPCH",
		image: "grid-systems.jpg",
	},
	{
		title: "Steal Like an Artist",
		author: "Austin Kleon",
		description: "I reread this book more often than any other. Austin Kleon is a constant source of inspiration in all mediums, but his seminal book on ceativity is a must-read. Short and to the point, he discusses how to absorb inspiration and turn it into something meanigful and productive. Plus, it's cheap cheap cheap. Buy this book.",
		url: "https://www.amazon.com/Steal-Like-Artist-Things-Creative/dp/0761169253",
		image: "steal.jpg",
	},
	{
		title: "The Shape of Design",
		author: "Frank Chimero",
		url: "https://shapeofdesignbook.com",
		image: "shape.jpg",
	},
	{
		title: "I Seem to Be a Verb",
		author: "R. Buckminster Fuller",
		url: "https://www.amazon.com/Seem-Be-Verb-Environment-Future/dp/B0006CZBHO",
		image: "verb.jpg",
	},
	{
		title: "Daily Rituals: How Artists Work",
		author: "Mason Currey",
		url: "https://www.amazon.com/Daily-Rituals-How-Artists-Work/dp/0307273601",
		image: "rituals.jpg",
	},
	{
		title: "Broad Band",
		author: "Claire L. Evans",
		url: "https://www.amazon.com/Broad-Band-Untold-Story-Internet/dp/0735211752",
		image: "broadband.jpg",
	},
	{
		title: "Ruined by Design",
		author: "Mike Monteiro",
		url: "https://ruinedby.design",
		image: "ruined-by-design.jpg",
	}
]

const Book = ({book, small = false, ...rest}) => (
  <div className='flex align--flex-end' {...rest}>
    <Link
      to={book.url}
      className='unstyled'
      style={{width: '100%'}}
    >
      <img
        src={`/img/books/${book.image}`}
        style={{boxShadow: 'var(--shadow-medium)'}}
      />

      <div className='mt-8' style={{height: small ? '4em' : '5em'}}>
        <h2 className={clsx('serif', !small && 'larger', 'mb-2')}>{book.title}</h2>
        <p className='smaller color-gray--500'>{book.author}</p>
      </div>
    </Link>
  </div>
)
const Books = () => {
  const sortedFavorites = favorites.sort(sortBy("title"))

	React.useEffect(() => {
    document.querySelector('body').dataset.section = 'books'
  })

	return (
		<>
			<Metadata title='Books' />

			<header className='prose mb-32'>
				<h1>Books</h1>
			</header>

      <h2 className='eyebrow'>Recently read</h2>

			<div className='books-recents horizontal-scroll mt-24 pb-12'>
        {recents.map(book => (
          <Book small book={book} key={book.title} style={{width: '160px'}} />
        ))}
      </div>

      <h2 className='eyebrow mt-40'>Favorites</h2>

      <div className='books-favorites grid mt-32' style={{'--gap': '24px','--item-min-size': '150px'}}>
        {sortedFavorites.map(book => (
          <Book book={book} key={book.title} />
        ))}
      </div>
		</>
	);
};

export const config = {
  unstable_runtimeJS: false
};

export default Books;
