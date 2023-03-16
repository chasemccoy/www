---
title: Regex recipes
excerpt: I’ve always been terrible at regex—here are some snippets that come in handy.
tags:
  - web dev
---

<book-mark url='https://github.com/VerbalExpressions/JSVerbalExpressions'></book-mark>

<book-mark url="https://blog.jim-nielsen.com/2019/batch-rename-dates"></book-mark>

### Get URLs from the src attribute of an HTML image tag

```js
const srcRegex = /<img.*?src=['"](.*?)['"]/
const src = srcRegex.exec(string)[1]

// string = "<img src='http://link-to-image.com/image.png' />"
// src = "http://link-to-image.com/image.png"
```

### Test whether a URL is internal or not

```js
const internal = /^\/(?!\/)/.test(url)
```

### Strip HTML tags out of a string

```js
const stripHTML = (string) => string.replace(/<[^>]+>/g, '')
```
