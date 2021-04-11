const clamp = function (min, n, max) {
	return Math.min(Math.max(n, min), max);
};

const R = function (x, y, time) {
	return Math.floor(180 + 64 * Math.cos((x * x - y * y) / 300 + time));
};

const G = function (x, y, time) {
	return Math.floor(
		180 +
			64 *
				Math.sin(
					(x * x * Math.cos(time / 2) + y * y * Math.sin(time / 3)) / 300
				)
	);
};

const B = function (x, y, time) {
	return Math.floor(
		200 +
			64 *
				Math.sin(
					5 * Math.sin(time / 9) +
						((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
				)
	);
};


if (typeof window !== "undefined") {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      div {
        position: relative;
        width: 30px;
        height: 30px;
      }

      canvas {
        width: 30px;
        height: 30px;
        border-radius: 4px;
      }

      canvas + canvas {
        position: absolute;
        top: 0;
        left: 0;
        mix-blend-mode: multiply;
        opacity: 0.5;
      }
    </style>

    <div>
      <canvas width="64" height="64"></canvas>
      <canvas width="64" height="64"></canvas>
    </div>
  `;

  class Logo extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(template.content.cloneNode(true));
      const canvases = this.shadowRoot.querySelectorAll('canvas')

      const canvas = canvases[0]
      const canvas2 = canvases[1]

      const context = canvas.getContext('2d');
      const context2 = canvas2.getContext('2d');
      let time = 0;

      context.scale(2, 2);
      context2.scale(2, 2);

      const color = function (x, y, r, g, b) {
        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context.fillRect(x, y, 10, 10);

        context2.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context2.fillRect(x, y, 10, 10);
      };

      const startAnimation = function () {
        for (let x = 0; x <= 32; x++) {
          for (let y = 0; y <= 32; y++) {
            const r = clamp(80, R(x, y, time), 255);
            const g = clamp(80, G(x, y, time), 245);
            const b = clamp(80, B(x, y, time), 255);
            color(x, y, r, g, b);
          }
        }

        time += 0.02;
        window.requestAnimationFrame(startAnimation);
      };

      startAnimation();
    }
  }

  window.customElements.define("chsmc-logo", Logo);
}