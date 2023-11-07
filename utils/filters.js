const { groupBy, getDateComponents, capitalize } = require('./index')
const { DateTime } = require('luxon')
const CleanCSS = require('clean-css')

const filterTagList = (tags) => {
  return (tags || []).filter(
    (tag) => !['all', 'nav', 'post', 'posts', 'notes'].includes(tag)
  )
}

module.exports = {
  filterTagList,
  capitalize: (string) => {
    return capitalize(string)
  },
  groupByYear: (items) => {
    const groups = groupBy(items, (item) => {
      const { year } = getDateComponents(new Date(item.date))
      return year
    })

    const keys = Object.keys(groups).reverse()
    const results = {}
    keys.forEach((key) => (results[key] = groups[key]))
    return results
  },
  keys: (object) => {
    return Object.keys(object)
  },
  filterHidden: (items) => {
    return items.filter((item) => item.data.hidden !== true)
  },
  onlyHiddenPosts: (posts) => {
    return posts.filter((post) => post.data.hidden)
  },
  // Filter out collection items that have no assigned tags
  noTags: (items) => {
    return items.filter((item) => {
      const tags = filterTagList(item.data.tags)
      return tags.length === 0
    })
  },
  readableDate: (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'LLLL d, yyyy'
    )
  },
  shortDate: (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLL d')
  },
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  htmlDateString: (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd')
  },
  dateToPermalink: (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy/LL')
  },
  // Get the first `n` elements of a collection.
  head: (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return []
    }
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  },
  cssmin: (code) => {
    return new CleanCSS({}).minify(code).styles
  },
  titleize: (slug) => {
    return capitalize(slug.replace('-', ' '))
  },
}
