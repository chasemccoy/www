import path from 'path'
import Image from '@11ty/eleventy-img'
import logWarningFor from './utils/warnings.js'
import { remove } from './utils/remove-key-from.js'
import generateAttrsObject from './utils/generate-attrs-object.js'
import { typeObjectError, typeFunctionError } from './utils/errors.js'

export default function markdownItEleventyImg(
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

    // Don't try to do special stuff with externally hosted images
    if (tokenAttributes.src.startsWith('http')) {
      return `<img src="${tokenAttributes.src}" />`
    }

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
