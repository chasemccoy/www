import React from 'react'

const Callout = ({ children, ...rest }) => (
  <aside
    className='callout sans p-12 pl-16 smaller'
    style={{
      borderLeft: '4px solid var(--color-accent)',
      background: 'var(--color-gray--100)',
    }}
    {...rest}
  >
    {children}
  </aside>
)

export default Callout
