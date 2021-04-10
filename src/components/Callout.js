import React from 'react'

const Callout = ({ children, ...rest }) => (
  <div
    className='callout p-4'
    style={{border: '1px dashed var(--section-color)', borderRadius: '16px'}}
    {...rest}
  >
    <aside
      className='p-8'
      style={{
        borderRadius: '12px',
      }}
    >
      <div
        className='p-12'
        style={{
          background: 'var(--color-body-background)',
          borderRadius: '8px'
        }}
      >
        <div className='smaller'>{children}</div>
      </div>
    </aside>
  </div>
)

export default Callout
