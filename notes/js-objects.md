---
title: Javascript objects
tags:
  - js
  - web dev
---

## Conditional properties

```js
const obj = {
  ...(condition && { prop: value })
}
```

## Default values

If you wanna have values with variants in an object you usually do this, which is annoying:

```js
color: {
  default: 'gray',
  light: 'lightGray',
  dark: 'darkGray'
}
```

Instead, do this:

```js
color: Object.assign('gray', {
  light: 'lightGray',
  dark: 'darkGray'
})
```

Now you can access the default value with `color` instead of `color.default`. [Thanks to Max Stoiber for this tip](https://twitter.com/mxstbr/status/998975061636866048).

## Destructuring an array

[@swyx shares this great tip on Twitter](https://twitter.com/swyx/status/1172604337366941697), again proving that I will never learn all of the secrets of objects in JavaScript.

```js
const getFirstLast = (array) => {
  const { 0: first, length: len, [len - 1]: last } = array

  return { first, last }
}

getFirstLast('apple')
// {first: "a", last: "e"}
getFirstLast([1, 2, 3, 4, 5, 6])
// {first: 1, last: 6}
```
