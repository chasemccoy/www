import React from 'react'
import { LayoutContext } from '../pages/_app'

const Page = ({
  article = false,
  children,
  tableOfContents,
  header,
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
        {...rest}
      >
        {header}
        <div className="wrapper">
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
