const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
  let url = 'https://api.chsmc.workers.dev/highlights-feed'

  try {
    return EleventyFetch(url, {
      duration: '1d',
      type: 'json',
    })
  } catch (error) {
    return []
  }
}
