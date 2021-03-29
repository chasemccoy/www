import React from 'react';
import {recents, favorites} from "./_data";
import Link from "../../components/Link";
import sortBy from 'sort-by'
import clsx from 'clsx'

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

export function headers() {
	return {
		'cache-control': 'public, max-age=604800'
	};
}

export function meta() {
	return {
		title: 'Books | Chase McCoy'
	};
}

export let handle = { section: 'books' };

const Books = () => {
  const sortedFavorites = favorites.sort(sortBy("title"))

	return (
		<>
			<header className='prose mb-40'>
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

export default Books;
