import React from 'react'
import { LayoutContext } from '../pages/_app'
import clsx from 'clsx'

const Page = ({
  article = false,
  children,
  tableOfContents,
  header,
  className,
  ...rest
}) => {
  const { setHasSidebar } = React.useContext(LayoutContext)
  const Container = article ? 'article' : 'div'

  React.useEffect(() => {
    setHasSidebar(!!tableOfContents)
  }, [tableOfContents, setHasSidebar])

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
          <Container>{children}</Container>
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
