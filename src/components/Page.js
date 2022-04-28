import React from 'react'

const Page = ({
  article = false,
  children,
  tableOfContents,
  ...rest
}) => {
  const Container = article ? 'article' : 'div'
  return (
    <React.Fragment>
      <Container {...rest}>
        {children}
      </Container>

      {tableOfContents && (
        <div
          id="sidebar"
          className="flow"
          style={{
            '--flow-spacing': '12px',
            fontSize: '0.75rem',
            color: 'var(--color-caption)',
            '--link-color': 'var(--color-caption)',
          }}
        >
          {tableOfContents}
        </div>
      )}
    </React.Fragment>
  )
}

export default Page
