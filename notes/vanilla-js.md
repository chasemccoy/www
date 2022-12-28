---
title: Vanilla Javascript
excerpt: JavaScript has come a long way since the height of jQuery, and many solutions that were best outsourced to a package are now easy to build in plain JS.
tags:
  - js
---

## Date formatting

```js
const date = new Date()

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const month = months[date.getMonth()]
const day = date.getDate()
const year = date.getFullYear()

// January 1, 2021
return `${month} ${day}, ${year}`

// 1/1/2021
return `${date.getMonth() + 1}/${day}/${year}`
```
