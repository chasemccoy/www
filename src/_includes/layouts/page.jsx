export const data = {
  layout: 'layouts/base.jsx',
}

export default function ({ content }) {
  return (
    <>
      {{ html: content }}
    </>
  )
}
