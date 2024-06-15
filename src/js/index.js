function escapeHTML(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

class Bookmark extends HTMLElement {
  constructor() {
    super()
  }

  async fetchData() {
    const url = this.getAttribute('url')
    this.innerHTML = `<a href="${url}" class="loading" />`
    const response = await fetch(
      `https://api.chsmc.workers.dev/url-metadata?url=${url}`
    )
    const json = await response.json()
    this.data = json
    this.render()
  }

  async connectedCallback() {
    await this.fetchData()
  }

  render() {
    const { title, description, image } = this.data
    const url = this.getAttribute('url')
    this.innerHTML = `
      <a href="${this.getAttribute(
        'url'
      )}" target="_blank"  rel="noopener" class="unstyled flex">
        ${image ? `<img src="${image}" />` : ''}
        <div>
          ${
            title
              ? `<h2 class="line-clamp" style="--lines: 1;">${escapeHTML(
                  title
                )}</h2>`
              : ''
          }
          ${
            description
              ? `<p class="line-clamp smaller" style="--lines: 2;">${escapeHTML(
                  description
                )}</p>`
              : ''
          }
          <p class="line-clamp smaller" style="--lines: 1;">${escapeHTML(
            url
          )}</p>
        </div>
      </a>
    `
  }
}

const populateBookmarks = async () => {
  const bookmarksContainer = Array.from(
    document.querySelectorAll('bookmark-list')
  )

  if (!bookmarksContainer || bookmarksContainer.length === 0) {
    return
  }

  const response = await fetch('https://api.chsmc.workers.dev/bookmarks')
  const bookmarks = await response.json()
  const ul = document.createElement('ul')

  bookmarks.slice(0, 10).forEach(({ url, title, description, image }) => {
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

const populateTableOfContents = () => {
  const tableOfContents = document.querySelector('table-of-contents')

  if (!tableOfContents) {
    return
  }

  const headings = Array.from(document.querySelectorAll('article h2'))
  if (headings && headings.length > 0) {
    const ul = document.createElement('ul')
    headings.forEach((heading) => {
      const a = document.createElement('a')
      const li = document.createElement('li')
      a.href = '#' + heading.id
      a.textContent = heading.textContent
      a.classList = 'unstyled'
      li.append(a)
      ul.append(li)
    })
    tableOfContents.append(ul)
    tableOfContents.hidden = false
  } else {
    tableOfContents.remove()
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

document.addEventListener('DOMContentLoaded', () => {
  customElements.define('book-mark', Bookmark)
  populateBookmarks()
  populateTableOfContents()
  populateNowPlaying()

  const divs = document.querySelectorAll('.creature > div')
  const elements = Array.from(divs)
  const hiddenElements = []

  function step() {
    hiddenElements.forEach((e) => {
      if (Math.random() < 0.7) {
        e.style.opacity = 1
      }
    })

    const n = randomInt(1, 10)
    const itemsToHide = Array.from(Array(n).keys())

    itemsToHide.forEach((i) => {
      const index = randomInt(0, elements.length - 1)
      const item = elements[index]
      item.style.opacity = 0
      hiddenElements.push(item)
    })

    setTimeout(() => {
      requestAnimationFrame(step)
    }, 1000 / 0.7)
  }

  window.requestAnimationFrame(step)
})
