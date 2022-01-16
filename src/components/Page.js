import React from 'react'

const Page = ({ children, tableOfContents, header, ...rest }) => {
  return (
    <React.Fragment>
      <div className='wrapper'>
        <article>
          {header && (
            <div
              className='mb-12'
              style={{
                padding: '0 var(--article-padding)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-code)',
                color: 'var(--color-gray--400)',
              }}
            >
              {header}
            </div>
          )}
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-large)',
              padding: 'var(--article-padding)',
            }}
            {...rest}
          >
            {children}
          </div>
        </article>

        {tableOfContents && <div id='sidebar'>{tableOfContents}</div>}
      </div>
    </React.Fragment>
  )
}

export default Page
