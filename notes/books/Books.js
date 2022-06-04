import React from 'react'
import sortBy from 'sort-by'
import clsx from 'clsx'

export const recents = [
  {
    title: 'Laziness Does Not Exist',
    author: 'Devon Price',
    url: 'https://bookshop.org/books/laziness-does-not-exist/9781982140106',
    image: 'laziness.jpeg',
  },
  {
    title: 'They Can’t Kill Us Until They Kill Us',
    author: 'Hanif Abdurraqib',
    url: 'https://bookshop.org/books/they-can-t-kill-us-until-they-kill-us/9781937512651',
    image: 'kill-us.jpeg',
  },
  {
    title: 'A Swim in a Pond in the Rain',
    author: 'George Saunders',
    url: 'https://bookshop.org/books/a-swim-in-a-pond-in-the-rain-in-which-four-russians-give-a-master-class-on-writing-reading-and-life/9781984856029',
    image: 'saunders.jpeg',
  },
  {
    title: 'LaserWriter II',
    author: 'Tamara Shopsin',
    url: 'https://bookshop.org/books/laserwriter-ii/9780374602574',
    image: 'laserwriter.jpeg',
  },
  {
    title: 'Bird by Bird',
    author: 'Anne Lamott',
    url: 'https://bookshop.org/books/bird-by-bird-some-instructions-on-writing-and-life/9780385480017',
    image: 'birdbybird.jpg',
  },
  {
    title: 'Kitchen Confidential',
    author: 'Anthony Bourdain',
    url: 'https://bookshop.org/books/kitchen-confidential-adventures-in-the-culinary-underbelly-9780060899226/9780060899226',
    image: 'kitchen.jpg',
  },
  {
    title: 'The Anthropocene Reviewed',
    author: 'John Green',
    url: 'https://bookshop.org/books/the-anthropocene-reviewed-signed-edition-essays-on-a-human-centered-planet/9780525555216',
    image: 'anthropocene.jpg',
  },
  {
    title: 'The Ministry for the Future',
    author: 'Kim Stanley Robinson',
    url: 'https://bookshop.org/books/the-ministry-for-the-future/9780316300131',
    image: 'ministry.jpeg',
  },
  {
    title: 'Uncanny Valley',
    author: 'Anna Wiener',
    url: 'https://bookshop.org/books/uncanny-valley-a-memoir/9780374278014',
    image: 'uncanny.jpg',
  },
  {
    title: 'Yearbook',
    author: 'Seth Rogen',
    url: 'https://bookshop.org/books/yearbook-9781984825407/9781984825407',
    image: 'yearbook.jpg',
  },
  {
    title: 'Fallen Glory',
    author: 'James Crawford',
    url: 'https://bookshop.org/books/fallen-glory-the-lives-and-deaths-of-history-s-greatest-buildings/9781250118318',
    image: 'fallen-glory.jpg',
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    url: 'https://bookshop.org/books/circe-9781549117640/9780316556347',
    image: 'circe.jpg',
  },
  {
    title: 'We Were Eight Years in Power',
    author: 'Ta-Nehisi Coates ',
    url: 'https://bookshop.org/books/we-were-eight-years-in-power-an-american-tragedy/9780399590573',
    image: 'eight-years.jpg',
  },
  {
    title: 'How to Do Nothing',
    author: 'Jenny Odell',
    url: 'https://bookshop.org/books/how-to-do-nothing-resisting-the-attention-economy/9781612197494',
    image: 'do-nothing.jpg',
  },
  {
    title: 'A Promised Land',
    author: 'Barack Obama',
    url: 'https://bookshop.org/books/a-promised-land/9781524763169',
    image: 'promised-land.jpg',
  },
  {
    title: 'Radicalized',
    author: 'Cory Doctorow',
    url: 'https://bookshop.org/books/radicalized-four-tales-of-our-present-moment/9781250229250',
    image: 'radicalized.jpg',
  },
]

export const favorites = [
  {
    title: 'The Perks of Being a Wallflower',
    author: 'Stephen Chbosky',
    description:
      "If you read any book on this page, let it be this one. Have you ever read a story and felt as though it was somehow written about you? That's how I feel about *Perks*. It's heartbreaking, funny, and captures what it's like to grow up and navigate the world.",
    url: 'https://www.amazon.com/Stephen-Chbosky-Perks-Wallflower-1-2-1999/dp/B00HTK217O',
    image: 'perks.jpg',
  },
  {
    title: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    description:
      'There are tons of resources out there to learn about web design, but one of my favorite resources is classic graphic design books that focus on print. If you can learn the basics of grids in print design, you will have a design superpower in your toolbelt. This book is one of my favorite on grids (and design in general).',
    url: 'https://www.amazon.com/dp/3721201450/ref=cm_sw_r_cp_dp_T1_DqLFzbJPXTPCH',
    image: 'grid-systems.jpg',
  },
  {
    title: 'Steal Like an Artist',
    author: 'Austin Kleon',
    description:
      "I reread this book more often than any other. Austin Kleon is a constant source of inspiration in all mediums, but his seminal book on ceativity is a must-read. Short and to the point, he discusses how to absorb inspiration and turn it into something meanigful and productive. Plus, it's cheap cheap cheap. Buy this book.",
    url: 'https://www.amazon.com/Steal-Like-Artist-Things-Creative/dp/0761169253',
    image: 'steal.jpg',
  },
  {
    title: 'The Shape of Design',
    author: 'Frank Chimero',
    url: 'https://shapeofdesignbook.com',
    image: 'shape.jpg',
  },
  {
    title: 'I Seem to Be a Verb',
    author: 'R. Buckminster Fuller',
    url: 'https://www.amazon.com/Seem-Be-Verb-Environment-Future/dp/B0006CZBHO',
    image: 'verb.jpg',
  },
  {
    title: 'Daily Rituals: How Artists Work',
    author: 'Mason Currey',
    url: 'https://www.amazon.com/Daily-Rituals-How-Artists-Work/dp/0307273601',
    image: 'rituals.jpg',
  },
  {
    title: 'Broad Band',
    author: 'Claire L. Evans',
    url: 'https://www.amazon.com/Broad-Band-Untold-Story-Internet/dp/0735211752',
    image: 'broadband.jpg',
  },
  {
    title: 'Ruined by Design',
    author: 'Mike Monteiro',
    url: 'https://ruinedby.design',
    image: 'ruined-by-design.jpg',
  },
]

const Book = ({ book, small = false, ...rest }) => (
  <div className="flex align--flex-end" {...rest}>
    <a
      href={book.url}
      target="__blank"
      className="unstyled"
      style={{ width: '100%' }}
    >
      <img
        src={`/img/books/${book.image}`}
        alt={`${book.title} by ${book.author}`}
        style={{ boxShadow: 'var(--shadow-medium)', width: '100%', margin: 0 }}
      />

      <div className="mt-8" style={{ height: '6em' }}>
        <h3 className={clsx('serif', !small && 'larger', 'mb-2', 'mt-4')}>
          {book.title}
        </h3>
        <p className="smaller color-gray--500 mt-4">{book.author}</p>
      </div>
    </a>
  </div>
)

const Books = () => {
  const sortedFavorites = favorites.sort(sortBy('title'))

  return (
    <>
      <h2 className="mt-32">Recently read</h2>

      <div className="horizontal-scroll mt-24 pb-24">
        <div>
          {recents.map((book) => (
            <Book
              small
              book={book}
              key={book.title}
              style={{ width: '160px' }}
            />
          ))}
        </div>
      </div>

      <h2 className="mt-40">Favorites</h2>

      <div
        className="grid mt-32"
        style={{ '--gap': '24px', '--item-min-size': '150px' }}
      >
        {sortedFavorites.map((book) => (
          <Book book={book} key={book.title} />
        ))}
      </div>
    </>
  )
}

export default Books
