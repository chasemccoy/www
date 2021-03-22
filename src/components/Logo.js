import React, { useEffect, useRef } from 'react'
import Link from './Link'

const clamp = function (min, n, max) {
  return Math.min(Math.max(n, min), max)
}

const R = function (x, y, time) {
  return Math.floor(180 + 64 * Math.cos((x * x - y * y) / 300 + time))
}

const G = function (x, y, time) {
  return Math.floor(
    180 +
      64 *
        Math.sin(
          (x * x * Math.cos(time / 2) + y * y * Math.sin(time / 3)) / 300
        )
  )
}

const B = function (x, y, time) {
  return Math.floor(
    200 +
      64 *
        Math.sin(
          5 * Math.sin(time / 9) +
            ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
        )
  )
}

const Mark = (props) => {
  const canvas = useRef()
  const canvas2 = useRef()

  useEffect(() => {
    const context = canvas.current.getContext('2d')
    const context2 = canvas2.current.getContext('2d')
    let time = 0

    context.scale(2, 2)
    context2.scale(2, 2)

    const color = function (x, y, r, g, b) {
      context.fillStyle = `rgb(${r}, ${g}, ${b})`
      context.fillRect(x, y, 10, 10)

      context2.fillStyle = `rgb(${r}, ${g}, ${b})`
      context2.fillRect(x, y, 10, 10)
    }

    const startAnimation = function () {
      for (let x = 0; x <= 32; x++) {
        for (let y = 0; y <= 32; y++) {
          const r = clamp(80, R(x, y, time), 255)
          const g = clamp(80, G(x, y, time), 245)
          const b = clamp(80, B(x, y, time), 255)
          color(x, y, r, g, b)
        }
      }
      time = time + 0.02
      window.requestAnimationFrame(startAnimation)
    }

    startAnimation()
  }, [])

  return (
    <Link
      to='/'
      style={{
        display: 'inline-block',
        margin: '8px 0 16px 0'
      }}
      {...props}
    >
      <div className='logo-canvas-wrapper'>
        <canvas ref={canvas} width='64' height='64' />
        <canvas ref={canvas2} width='64' height='64' />
      </div>
    </Link>
  )
}

export default Mark
