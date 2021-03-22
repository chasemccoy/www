export const getColorForSection = (section) => {
  switch (section) {
    case 'blog':
      return 'var(--color-red)'
    case 'notes':
      return 'var(--color-purple)'
    case 'books':
      return 'var(--color-blue)'
    case 'quotes':
      return 'var(--color-yellow)'
    default:
      return 'var(--color-green)'
  }
}

export const getURLForPost = post => {
  const date = new Date(post.date)
  const year = date.getFullYear().toString()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  return `/${year}/${month}/${post.slug}`
}