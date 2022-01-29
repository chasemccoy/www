import React from 'react'
import clsx from 'clsx'

const PropertyList = ({ label, children, className, ...rest }) => {
  return (
    <div className={clsx('property-list', className)} {...rest}>
      <div className='color-caption'>{label}</div>
      <div>{children}</div>
    </div>
  )
}

export default PropertyList
