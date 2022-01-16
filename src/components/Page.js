import React from 'react'

const Page = ({
  article = false,
  showCanvas = false,
  children,
  tableOfContents,
  header,
  ...rest
}) => {
  const Container = article ? 'article' : 'div'
  return (
    <React.Fragment>
      <div className='wrapper'>
        <Container className='content'>
          {header && (
            <div
              className='mb-8'
              style={{
                padding: '0 var(--article-padding)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-code)',
                color: 'var(--color-caption)',
                '--link-color': 'var(--color-caption)',
              }}
            >
              {header}
            </div>
          )}
          <div
            style={
              showCanvas
                ? {
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-large)',
                    padding: 'var(--article-padding)',
                  }
                : { padding: 'var(--article-padding)' }
            }
            {...rest}
          >
            {children}
          </div>
        </Container>

        {tableOfContents && <div id='sidebar'>{tableOfContents}</div>}
      </div>
    </React.Fragment>
  )
}

export default Page
