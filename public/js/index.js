const populateBookmarks = async () => {
  const bookmarksContainer = Array.from(
    document.querySelectorAll('bookmark-list'),
  )

  if (!bookmarksContainer || bookmarksContainer.length === 0) {
    return
  }

  const response = await fetch('https://api.chsmc.workers.dev/bookmarks')
  const bookmarks = await response.json()
  const ul = document.createElement('ul')

  bookmarks.slice(0, 10).forEach(({ url, title }) => {
    const a = document.createElement('a')
    const li = document.createElement('li')
    a.href = url
    a.textContent = title || url
    a.target = '_blank'
    a.classList = 'unstyled'
    a.title = title || url
    li.append(a)
    ul.append(li)
  })

  bookmarksContainer.forEach((container) => {
    container.append(ul.cloneNode(true))
  })
}

const populateNowPlaying = async () => {
  const musicContainer = Array.from(document.querySelectorAll('now-playing'))

  if (!musicContainer || musicContainer.length === 0) {
    return
  }

  const response = await fetch('https://api.chsmc.workers.dev/music')
  const data = await response.json()
  const { recentTracks } = data

  if (!recentTracks || recentTracks.length === 0) {
    return
  }

  const { name, artist, image } = recentTracks[0]
  const span = document.createElement('span')
  const img = document.createElement('img')
  const imgContainer = document.createElement('div')
  span.textContent = `${name} by ${artist}`
  img.src = image
  img.alt = ''
  imgContainer.className = 'image-container'
  imgContainer.append(img)

  musicContainer.forEach((container) => {
    container.append(imgContainer.cloneNode(true))
    container.append(span.cloneNode(true))
  })
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

document.addEventListener('DOMContentLoaded', () => {
  void populateBookmarks()
  void populateNowPlaying()
})
