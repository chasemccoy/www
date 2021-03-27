import React, {useState, useEffect} from 'react'
// import clsx from 'clsx'

const API_URL = url => `https://api.microlink.io?url=${url}`

const Bookmark = ({url}) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(API_URL(url))
      const json = await response.json()
      setData(json.data)
    }

    fetchData()
  }, [])

  if (!data) { 
    return <div className='bookmark-loader' />
  }

  return (
    <a href={url} target="_blank" className='unstyled bookmark flex'>
      {data.image && (
        <div className='flex--no-shrink'>
          <img src={data.image.url} alt="" />
        </div>
      )}

      <div className='px-12 py-8 flow'>
        <div>
          <p className='bold mb-4'>{data.title}</p>
          <p className='smaller description'>{data.description}</p>
        </div>
        
        <p className='smaller color-caption'>{data.url}</p>
      </div>
    </a>
  )
}

// const Bookmark = ({ media = ['image', 'logo'], className, ...rest }) => (
//   <Microlink media={media} lazy={false} className={clsx(className, 'microlink')} {...rest} />
// )

export default Bookmark
