---
title: Generating friendly, unique identifiers
excerpt: Using the friendly-words package from Glitch to create human readable identifiers.
---

In a recent project, I needed a way to create unique identifiers that met these criteria:

- Human readable (and human friendly)
- Short
- Random

Creating short and random IDs is pretty easy, but making them human readable is a bit trickier, since you'll need a list of words to use. I knew that [Glitch](https://glitch.com) was doing this well — when you create a new project you get random names like "reminiscent-chickadee" or "cultured-tadpole". That's exactly the sort of thing I wanted.

I got to digging, and it turns out that [Glitch has opened source their word list on GitHub](https://github.com/FogCreek/friendly-words). The `friendly-words` repo houses lists of words in four categories that are friendly (the Glitch folks are friendly, and I know they take great care to use friendly language) and available as a package on npm.

Once I had that, it was super simple to wire up a function to return a string generated from these word sets:

```js
import words from 'friendly-words'

const randomName = () => {
  const { predicates, objects } = words
  const predicate = predicates[Math.floor(Math.random() * predicates.length)]
  const object = objects[Math.floor(Math.random() * objects.length)]
  return `${predicate}-${object}`
}
```

Thanks to the folks at Glitch for making this awesome resource available to the community! Check out the repo on GitHub to learn more:

<Bookmark url='https://github.com/FogCreek/friendly-words' />
