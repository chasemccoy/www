import React from 'react'
import clsx from 'clsx'

const TableOfContents = ({ content, className }) => {
  if (!content) {
    return null
  }

  return (
    <div className={clsx('toc', className)}>
      <h2 className="mt-0 mb-4">Table of contents</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}

export default TableOfContents
