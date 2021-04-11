import React from 'react'

const Callout = ({ children, ...rest }) => (
  <aside 
    className='callout sans p-12 pl-16 smaller' 
    style={{borderLeft: '4px solid var(--section-color)', background: 'var(--section-color-offset)'}} 
    {...rest}
  >
    {children}
  </aside>
)

export default Callout