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

module.exports = function (config) {
  config.addPassthroughCopy({ 'src/js': 'js' })
  config.addPassthroughCopy({ public: '/' })
  config.setUseGitIgnore(false)

  // Add plugins
  config.addPlugin(pluginRSS)
  config.addPlugin(pluginSyntaxHighlight)
  config.addPlugin(embedTwitter, {
    doNotTrack: true,
  })
  config.addPlugin(embedYouTube, {
    lite: true,
    modestBranding: true,
    recommendSelfOnly: true,
  })

  config.addNunjucksAsyncShortcode('image', imageShortcode)
  config.addPairedShortcode('slot', function (content, name) {
    if (!name) throw new Error('Missing name for {% slot %} block!')
    this.page[name] = content
    return ''
  })

  Object.keys(filters).forEach((filter) => {
    config.addFilter(filter, filters[filter])
  })

  // Create an array of all tags
  config.addCollection('tagList', function (collection) {
    let tagSet = new Set()
    collection.getAll().forEach((item) => {
      ;(item.data.tags || []).forEach((tag) => tagSet.add(tag))
    })

    return filters.filterTagList([...tagSet])
  })

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .disable('code')
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
