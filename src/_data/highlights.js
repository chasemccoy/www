import EleventyFetch from '@11ty/eleventy-fetch'

export default async function() {
  let url = 'https://api.chsmc.workers.dev/highlights-feed'

  try {
    return EleventyFetch(url, {
      duration: '6h', 
      type: 'json',
    })
  } catch (error) {
    return []
  }
}
