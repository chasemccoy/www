if (typeof window !== 'undefined') {
  const template = document.createElement('template')
  template.innerHTML = `
    <style>
      div {
        position: absolute;
        width: 100vw;
        height: 180px;
        opacity: 0.3;
        z-index: -1;
        border-radius: 0 0 30% 30%;
        overflow: hidden;
      }

      canvas {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }

      div:after {
        content: "";
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        background: radial-gradient(ellipse at top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%);
      }

      :host(.dark) div {
        height: 120px;
        mix-blend-mode: color;
        opacity: 0.5;
      }

      :host(.dark) div:after {
        background: radial-gradient(ellipse at top, rgba(34, 34, 34, 0.2), rgba(34, 34, 34, 1) 80%);
      }
    </style>

    <div>
      <canvas width="32" height="32"> 
    </div>
  `

  class Iridescence extends HTMLElement {
    constructor() {
      super()
      const dark = this.hasAttribute('dark')
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(template.content.cloneNode(true))
      const canvasElement = this.shadowRoot.querySelector('canvas')

      const canvas = canvasElement.getContext('2d')

      const col = (x, y, r, g, b) => {
        canvas.fillStyle = `rgb(${r},${g},${b})`
        canvas.fillRect(x, y, 1, 1)
      }

      const R = (x, y, t) => {
        return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t))
      }

      const G = (x, y, t) => {
        return Math.floor(
          192 +
            64 *
              Math.sin(
                (x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300
              )
        )
      }

      const B = (x, y, t) => {
        return Math.floor(
          192 +
            64 *
              Math.sin(
                5 * Math.sin(t / 9) +
                  ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
              )
        )
      }

      let t = 0

      const run = function () {
        for (let x = 0; x <= 35; x++) {
          for (let y = 0; y <= 35; y++) {
            col(x, y, R(x, y, t), G(x, y, t), B(x, y, t))
          }
        }
        t = t + 0.02
        window.requestAnimationFrame(run)
      }

      run()

      // window.addEventListener('mousemove', () => {
      //   window.requestAnimationFrame(run)
      // })
    }
  }

  window.customElements.define('chsmc-iridescence', Iridescence)
}