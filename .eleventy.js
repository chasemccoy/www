const fs = require('fs')
const path = require('path')

const Image = require('@11ty/eleventy-img')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItEleventyImg = require('./utils/markdown-it-eleventy-img')
const embedTwitter = require('eleventy-plugin-embed-twitter')
const embedYouTube = require('eleventy-plugin-youtube-embed')

const pluginRSS = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

const filters = require('./utils/filters')

const mdRender = new markdownIt()

// Image shortcode for .njk files
async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [null],
    formats: ['webp', 'jpg'],
    outputDir: './_site/img',
  })

  let imageAttributes = {
    alt,
    sizes,
    loading: 'lazy',
    decoding: 'async',
  }

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: 'inline',
  })
}

module.exports = async function (config) {
  const { EleventyRenderPlugin } = await import('@11ty/eleventy')
  config.addPassthroughCopy({ 'src/js': 'js' })
  config.addPassthroughCopy({ public: '/' })
  config.setUseGitIgnore(false)

  Object.keys(filters).forEach((filter) => {
    config.addFilter(filter, filters[filter])
  })

  // Add plugins
  config.addPlugin(pluginRSS)
  config.addPlugin(EleventyRenderPlugin)
  config.addPlugin(pluginSyntaxHighlight)
  config.addPlugin(embedTwitter, {
    doNotTrack: true,
  })
  config.addPlugin(embedYouTube, {
    lite: true,
    recommendSelfOnly: true,
  })

  config.addNunjucksAsyncShortcode('image', imageShortcode)
  config.addPairedShortcode('slot', function (content, name) {
    if (!name) throw new Error('Missing name for {% slot %} block!')
    this.page[name] = content
    return ''
  })

  // Create an array of all tags
  config.addCollection('tagList', function (collection) {
    let tagSet = new Set()
    collection.getAll().forEach((item) => {
      ;(item.data.tags || []).forEach((tag) => tagSet.add(tag))
    })

    return filters.filterTagList([...tagSet])
  })

  config.addCollection('postsByYear', function (collection) {
    const posts = collection.getFilteredByTag('posts')
    return filters.groupByYear(filters.filterHidden(posts))
  })

  config.addCollection('featuredPosts', function (collection) {
    const posts = collection
      .getFilteredByTag('posts')
      .filter((p) => !!p.data.title && p.data.featured)
    return filters.filterHidden(posts).reverse()
  })

  config.addCollection('feed', function (collection) {
    const highlights = collection.items[0].data.highlights.map((highlight) => {
      highlight.type = 'highlight'
      return highlight
    })

    const posts = filters
      .filterHidden(collection.getFilteredByTag('posts'))
      .map((post) => {
        post.type = 'post'
        return post
      })

    return [...highlights, ...posts].sort(function (a, b) {
      return new Date(a.date) - new Date(b.date)
    })
  })

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAnchor, {
      slugify: config.getFilter('slug'),
    })
    .use(markdownItEleventyImg, {
      imgOptions: {
        widths: [null],
        formats: ['webp', 'png'],
        urlPath: '/img',
        outputDir: './_site/img',
        sharpOptions: {
          animated: true,
        },
        filenameFormat: function (id, src, width, format, options) {
          const extension = path.extname(src)
          const name = path.basename(src, extension)
          const dir = path.dirname(src).split('/').slice(-1)[0]
          return `${dir}-${name}.${format}`
        },
      },
      renderImage(image, attributes) {
        const [Image, options] = image
        const [src, attrs] = attributes

        Image(src, options)

        attrs.loading = 'lazy'
        attrs.decoding = 'async'
        const metadata = Image.statsSync(src, options)
        const imageMarkup = Image.generateHTML(metadata, attrs, {
          whitespaceMode: 'inline',
        })

        return `<figure>${imageMarkup}${
          attrs.title
            ? `<figcaption>${mdRender.render(attrs.title)}</figcaption>`
            : ''
        }</figure>`
      },
    })

  markdownLibrary.linkify.set({ fuzzyLink: false })
  config.setLibrary('md', markdownLibrary)

  config.setServerOptions({
    port: 1995,
  })

  return {
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: '.',
      includes: 'src/_includes',
      data: 'src/_data',
      output: '_site',
    },
  }
}
