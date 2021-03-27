import React from 'react'
import classname from 'clsx';

const Marker = ({ children, className, ...rest }) => {
  return (
    <h2 className={classname('marker', className)} {...rest}>
      <span>{children}</span>
    </h2>
  )
}

export default Marker