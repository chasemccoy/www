import React from 'react'
import sortBy from 'sort-by'

export const quotes = [
  {
    content: "There are no separate systems. The world is a continuum. Where to draw a boundary around a system depends on the purpose of the discussion.",
    metadata: "Donella H. Meadows"
  },
  {
    content:
      "Be regular and orderly in your life, so that you may be violent and original in your work.",
    metadata: "Gustave Flaubert",
    tags: ["creativity", "work", "life"],
  },
  {
    content:
      "One ought, every day at least, to hear a little song, read a good poem, see a fine picture, and, if it were possible, to speak a few reasonable words.",
    metadata: "Johann Wolfgang von Goethe",
    tags: ["creativity", "life"],
  },
  {
    content:
      "I must study politics and war, that my sons may have liberty to study mathematics and philosophy. My sons ought to study mathematics and philosophy, geography, natural history, naval architecture, navigation, commerce and agriculture, in order to give their children a right to study painting, poetry, music, architecture, statuary, tapestry, and porcelain.",
    metadata: "John Adams",
    tags: ["life", "responsibility", "art"],
  },
  {
    content:
      "All design work seems to have three common traits: there is a message to the work, the tone of that message, and the format that the work takes. Successful design has all three elements working in co-dependence to achieve a whole greater than the sum of the individual parts.",
    metadata: "Frank Chimero, The Shape of Design",
    tags: ["design"],
  },
  {
    content:
      "If you ever want to find out just how uninteresting you really are, get a job where the quality and frequency of your thoughts determine your livelihood. I’ve found that the only way I can keep writing every day, year after year, is to let my mind wander into new territories. To do that, I’ve had to cultivate a kind of mental playfulness.",
    metadata: "Bill Watterson",
  },
  {
    content:
      "Immature poets imitate; mature poets steal; bad poets deface what they take, and good poets make it into something better, or at least something different. The good poet welds his theft into a whole of feeling which is unique, utterly different from that from which it was torn; the bad poet throws it into something which has no cohesion.",
    metadata: "T.S. Eliot",
  },
  {
    content:
      "You don’t get to pick your family, but you can pick your teachers and you can pick your friends and you can pick the music you listen to and you can pick the books you read and you can pick the movies you see. You are, in fact, a mashup of what you choose to let into your life. You are the sum of your influences.",
    metadata: "Austin Kleon",
  },
  {
    content:
      "The whole problem with the world is that fools and fanatics are always so certain of themselves, but wiser people so full of doubts.",
    metadata: "Bertrand Russell",
  },
  {
    content:
      "No tree, it is said, can grow to heaven unless its roots reach down to hell.",
    metadata: "Carl Jung",
  },
  {
    content:
      "I live on Earth at the present, and I don't know what I am. I know that I am not a category. I am not a thing - a noun. I seem to be a verb, an evolutionary process - an integral function of the universe.",
    metadata: "R. Buckminster Fuller",
  },
  {
    content:
      "No man can wear one face to himself and another to the multitude, without finally getting bewildered as to which may be true.",
    metadata: "Nathaniel Hawthorne",
  },
  {
    content: "Think before you speak. Read before you think.",
    metadata: "Fran Lebowitz",
  },
  {
    content:
      "At times of change, the learners are the ones who will inherit the world, while the knowers will be beautifully prepared for a world which no longer exists.",
    metadata: "Alistair Smith",
  }
]

const Quotes = () => {
  const sortedQuotes = quotes.sort(sortBy("metadata"))

  return (
    <div className='multi-column mt-24' style={{'--columns': 2, '--min-column-width': '15em', '--gap': '32px'}}>
      {sortedQuotes.map((quote, i) => (
        <div className='quote mb-16 pb-16' key={i}>
          <p className='serif'>{quote.content}</p>
          <p className='mt-8 bold color-gray--600'>— {quote.metadata}</p>
        </div>
      ))}
    </div>
  )
}

export default Quotes