import React from 'react'
import Link from './Link'

const now = [
  <><Link to='/notes/web-communities'>Web communities</Link> and carving out spaces online that are respectful of our time and attention.</>,
  <>Building multi-tiered design systems that scale from building blocks to full experiences.</>,
  <>Learning how to play guitar 🎸🙂 Send me your favorite tutorials!</>
]

const bgColors = [
  "var(--color-blue-offset--100)",
  "var(--color-green-offset--100)",
  "var(--color-yellow-offset--100)"
]

const primaryColors = [
  "var(--color-blue)",
  "var(--color-green)",
  "var(--color-yellow)"
]

const Now = () => {
  return (
    <React.Fragment>
      <h2 className='serif normal mt-24' style={{fontSize: '2rem'}}>
        Now
        <span className='sans ml-8 inline-block color-caption' style={{fontSize: '0.9rem', transform: 'translateY(-1px)'}}>
          Three things I’m currently focused on.
        </span>
      </h2>

      <hr className='mt-4 dashed' />

      <div className='grid mt-16' style={{'--gap': '12px','--item-min-size': '190px'}}>
        {now.map((item, i) => (
          <div className='p-12' key={i} style={{background: bgColors[i], borderRadius: '12px'}}>
            <div className='bold flex align--center justify-center pb-2' style={{background: primaryColors[i], borderRadius: '50%', width: '1.8rem', height: '1.8rem'}}>{i + 1}</div>
            <p className='mt-12 hyphens smaller tighter'>{item}</p>
          </div>
        ))}
      </div>

      <p className='color-caption mt-12 smaller tighter'>If any of these things sounds interesting to you and you’d like to chat about them, please <Link href="mailto:hi@chasem.co" style={{color: 'inherit'}}>send me a note!</Link></p>
    </React.Fragment>
  )
}
 
export default Now