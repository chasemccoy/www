const App = {}

const isOverflown = ({
  clientWidth,
  clientHeight,
  scrollWidth,
  scrollHeight,
}) => {
  return scrollHeight > clientHeight || scrollWidth > clientWidth
}

document.addEventListener('DOMContentLoaded', () => {
  App.fixedHeader = document.getElementById('fixed-header')
  App.scrollHeader = document.getElementById('scroll-header')

  App.headerIntersectionCallback = (entries, observer) => {
    const currentEntry = entries[0]

    if (!currentEntry) return

    if (currentEntry.isIntersecting) {
      App.scrollHeader.classList.add('hidden')
    } else {
      App.scrollHeader.classList.remove('hidden')
    }

    document.documentElement.style.setProperty(
      '--scroll-header-height',
      App.scrollHeader.offsetHeight + 'px'
    )
  }

  App.observer = new IntersectionObserver(App.headerIntersectionCallback)

  App.observer.observe(App.fixedHeader)

  const imageGalleries = document.querySelectorAll('image-gallery')
  imageGalleries.forEach((element) => {
    if (!isOverflown(element)) {
      element.classList.add('no-overflow')
    }
  })
})
