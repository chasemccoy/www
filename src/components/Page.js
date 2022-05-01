import React from 'react'
import clsx from 'clsx'

const Page = ({
  article = false,
  children,
  tableOfContents,
  header,
  className,
  setHasSidebar,
  ...rest
}) => {
  const Container = article ? 'article' : 'div'

  if (!!tableOfContents && setHasSidebar) {
    setHasSidebar(true)
  }

  return (
    <React.Fragment>
      <div
        id="content"
        className={clsx(className, 'flex flex-column')}
        {...rest}
      >
        {header}

       {header && <hr className="dashed my-32" />}

        <div className="wrapper mt-0">
          <Container style={{width: '100%'}}>{children}</Container>
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
        </div>
      </div>
    </React.Fragment>
  )
}

export default Page
