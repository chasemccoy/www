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

  bookmarksContainer.forEach((container) => container.append(ul))
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

document.addEventListener('DOMContentLoaded', () => {
  customElements.define('book-mark', Bookmark)
  populateBookmarks()
  populateTableOfContents()
})
