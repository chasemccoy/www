const path = require('path')
const Image = require('@11ty/eleventy-img')
const logWarningFor = require('./utils/warnings')
const { remove } = require('./utils/remove-key-from')
const generateAttrsObject = require('./utils/generate-attrs-object')
const { typeObjectError, typeFunctionError } = require('./utils/errors')

module.exports = function markdownItEleventyImg(
  md,
  { imgOptions = {}, globalAttributes = {}, renderImage } = {}
) {
  typeObjectError(imgOptions, 'imgOptions')
  typeObjectError(globalAttributes, 'globalAttributes')
  typeFunctionError(renderImage, 'renderImage')

  logWarningFor(globalAttributes)

  md.renderer.rules.image = (tokens, index, rendererOptions, env, renderer) => {
    const token = tokens[index]

    const tokenAttributes = generateAttrsObject(token)

    const src = path.join(
      './',
      env.page.filePathStem.replace('index', ''),
      tokenAttributes.src
    )

    const tokenAttributesWithoutSrc = remove('src').from(tokenAttributes)

    const globalAttributesWithoutTitle = remove('title').from(globalAttributes)

    const imageAttributes = {
      ...globalAttributesWithoutTitle,
      ...tokenAttributesWithoutSrc,
    }

    if (renderImage) {
      const image = [Image, imgOptions]
      const attributes = [src, imageAttributes]
      return renderImage(image, attributes)
    }

    Image(src, imgOptions)

    const metadata = Image.statsSync(src, imgOptions)
    const imageMarkup = Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: 'inline',
    })

    return imageMarkup
  }
}
