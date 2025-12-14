function escapeHTML(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

class Bookmark extends HTMLElement {
  constructor() {
    super()
  }

  async fetchData() {
    const url = this.getAttribute('url')
    this.innerHTML = `<a href="${url}" class="loading" />`
    const response = await fetch(
      `https://api.chsmc.workers.dev/url-metadata?url=${url}`
    )
    const json = await response.json()
    this.data = json
    this.render()
  }

  async connectedCallback() {
    await this.fetchData()
  }

  render() {
    const { title, description, image } = this.data
    const url = this.getAttribute('url')
    this.innerHTML = `
      <a href="${this.getAttribute(
        'url'
      )}" target="_blank"  rel="noopener" class="unstyled flex">
        ${image ? `<img src="${image}" />` : ''}
        <div>
          ${
            title
              ? `<h2 class="line-clamp" style="--lines: 1;">${escapeHTML(
                  title
                )}</h2>`
              : ''
          }
          ${
            description
              ? `<p class="line-clamp smaller" style="--lines: 2;">${escapeHTML(
                  description
                )}</p>`
              : ''
          }
          <p class="line-clamp smaller" style="--lines: 1;">${escapeHTML(
            url
          )}</p>
        </div>
      </a>
    `
  }
}

const populateBookmarks = async () => {
  const bookmarksContainer = Array.from(
    document.querySelectorAll('bookmark-list')
  )

  if (!bookmarksContainer || bookmarksContainer.length === 0) {
    return
  }

  const response = await fetch('https://api.chsmc.workers.dev/bookmarks')
  const bookmarks = await response.json()
  const ul = document.createElement('ul')

  bookmarks.slice(0, 10).forEach(({ url, title, description, image }) => {
    const a = document.createElement('a')
    const li = document.createElement('li')
    a.href = url
    a.textContent = title || url
    a.target = '_blank'
    a.classList = 'unstyled'
    a.title = title || url
    li.append(a)
    ul.append(li)
  })

  bookmarksContainer.forEach((container) => {
    container.append(ul.cloneNode(true))
  })
}

const populateNowPlaying = async () => {
  const musicContainer = Array.from(document.querySelectorAll('now-playing'))

  if (!musicContainer || musicContainer.length === 0) {
    return
  }

  const response = await fetch('https://api.chsmc.workers.dev/music')
  const data = await response.json()
  const { recentTracks } = data

  if (!recentTracks || recentTracks.length === 0) {
    return
  }

  const { name, artist, image } = recentTracks[0]
  const span = document.createElement('span')
  const img = document.createElement('img')
  const imgContainer = document.createElement('div')
  span.textContent = `${name} by ${artist}`
  img.src = image
  img.alt = ''
  imgContainer.className = 'image-container'
  imgContainer.append(img)

  musicContainer.forEach((container) => {
    container.append(imgContainer.cloneNode(true))
    container.append(span.cloneNode(true))
  })
}

const populateTableOfContents = () => {
  const tableOfContents = document.querySelector('table-of-contents')

  if (!tableOfContents) {
    return
  }

  const headings = Array.from(document.querySelectorAll('article h2'))
  if (headings && headings.length > 0) {
    const ul = document.createElement('ul')
    headings.forEach((heading) => {
      const a = document.createElement('a')
      const li = document.createElement('li')
      a.href = '#' + heading.id
      a.textContent = heading.textContent
      a.classList = 'unstyled'
      li.append(a)
      ul.append(li)
    })
    tableOfContents.append(ul)
    tableOfContents.hidden = false
  } else {
    tableOfContents.remove()
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

document.addEventListener('DOMContentLoaded', () => {
  customElements.define('book-mark', Bookmark)
  populateBookmarks()
  populateTableOfContents()
  populateNowPlaying()

  const divs = document.querySelectorAll('.creature > div')
  const elements = Array.from(divs)
  const hiddenElements = []

  function step() {
    hiddenElements.forEach((e) => {
      if (Math.random() < 0.7) {
        e.style.opacity = 1
      }
    })

    const n = randomInt(1, 10)
    const itemsToHide = Array.from(Array(n).keys())

    itemsToHide.forEach((i) => {
      const index = randomInt(0, elements.length - 1)
      const item = elements[index]
      if (item) {
        item.style.opacity = 0
        hiddenElements.push(item)
      }
    })

    setTimeout(() => {
      requestAnimationFrame(step)
    }, 1000 / 0.7)
  }

  window.requestAnimationFrame(step)

  // ––––––––––––

  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl');
  
  function resize() {
    // Read the actual displayed size from CSS
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Set buffer to match display size (with device pixel ratio for sharpness)
    canvas.width = displayWidth * window.devicePixelRatio;
    canvas.height = displayHeight * window.devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const config = {
    "seed": Math.random(),
    "gridSize": 12,
    "cellGap": 0.04,
    "noiseScale": 0.9,
    "swirlIntensity": 0.45,
    "colorVariation": 0.1,
    "minDotSize": 0.08,
    "maxDotSize": 0.12,
    "dotSizeVariation": 0.25,
    "dotSoftness": 0.055,
    "grain": 0.15,
    "vignette": 0,
    "flowSpeed": 0.25,
    "noiseDrift": 0,
    "driftChaos": 0,
    "colorDrift": 0,
    "dotBreathe": 0.1,
    "shimmer": 0,
    "color1": "#005F60",
    "color2": "#014445",
    "color3": "#014445",
    "color4": "#2A8081",
    "color5": "#005F60",
    "dotColor": "#fff"
  };
    
  const vs = `attribute vec2 a_position; varying vec2 v_uv;
    void main() { v_uv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }`;
  
  const fs = `precision highp float;
    varying vec2 v_uv;
    uniform float u_seed, u_time, u_gridSize, u_cellGap, u_noiseScale, u_swirlIntensity;
    uniform float u_colorVariation, u_minDotSize, u_maxDotSize, u_dotSizeVariation, u_dotSoftness;
    uniform float u_grain, u_vignette, u_flowSpeed, u_noiseDrift, u_driftChaos;
    uniform float u_colorDrift, u_dotBreathe, u_shimmer;
    uniform float u_aspectRatio;
    uniform vec3 u_color1, u_color2, u_color3, u_color4, u_color5, u_dotColor;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    float fbm(vec2 p, float seed) {
      float value = 0.0, amplitude = 0.5; vec2 shift = vec2(100.0 + seed * 50.0);
      for (int i = 0; i < 4; i++) { value += amplitude * snoise(p + shift); p *= 2.0; amplitude *= 0.5; }
      return value;
    }
    
    vec3 getColor(float t, float seed) {
      float offset = fract(seed * 0.1) * u_colorVariation; t = fract(t + offset);
      float s = 0.2;
      if (t < s) return mix(u_color1, u_color2, t / s);
      else if (t < s * 2.0) return mix(u_color2, u_color3, (t - s) / s);
      else if (t < s * 3.0) return mix(u_color3, u_color4, (t - s * 2.0) / s);
      else if (t < s * 4.0) return mix(u_color4, u_color5, (t - s * 3.0) / s);
      else return mix(u_color5, u_color1, (t - s * 4.0) / s);
    }
    
    void main() {
      vec2 uv = v_uv;
      uv.x *= u_aspectRatio;
      vec2 cellUV = fract(uv * u_gridSize); vec2 cellID = floor(uv * u_gridSize);
      vec2 cellCenter = (cellID + 0.5) / u_gridSize;
      float slowTime = u_time * u_flowSpeed, colorTime = u_time * u_colorDrift;
      float driftTime = u_time * u_noiseDrift;
      vec2 noiseDrift = vec2(sin(driftTime * 0.7) * 0.5 + sin(driftTime * 1.3 + 1.5) * 0.3 + sin(driftTime * 2.1 + 3.0) * 0.2,
                              cos(driftTime * 0.5) * 0.5 + cos(driftTime * 1.1 + 2.0) * 0.3 + cos(driftTime * 1.7 + 4.0) * 0.2);
      float chaosTime = u_time * u_noiseDrift * 2.0;
      vec2 chaosDrift = vec2(sin(chaosTime * 2.3 + u_seed) * sin(chaosTime * 0.7) + cos(chaosTime * 3.1 + 1.0),
                              cos(chaosTime * 1.9 + u_seed * 0.5) * cos(chaosTime * 0.9) + sin(chaosTime * 2.7 + 2.0)) * u_driftChaos * 0.5;
      vec2 totalDrift = noiseDrift + chaosDrift;
      vec2 flowOffset = vec2(sin(slowTime * 0.7) * 0.1, cos(slowTime * 0.5) * 0.1);
      vec2 animatedCenter = cellCenter + totalDrift * 0.15;
      float n1 = fbm(animatedCenter * u_noiseScale + flowOffset, u_seed);
      float n2 = fbm(animatedCenter * u_noiseScale + vec2(100.0, 50.0) + flowOffset * 0.8, u_seed + 10.0);
      float n3 = fbm(animatedCenter * u_noiseScale * 0.5 + vec2(200.0, 150.0) + flowOffset * 0.5, u_seed + 20.0);
      float swirlAnim = u_swirlIntensity + sin(slowTime * 0.3) * 0.05;
      float swirl = fbm(animatedCenter * 1.5 + vec2(n1, n2) * swirlAnim + flowOffset * 0.3, u_seed + 5.0);
      float colorIndex = fract(swirl * 0.5 + 0.5 + n3 * u_colorVariation + colorTime * 0.1);
      vec3 bgColor = getColor(colorIndex, u_seed);
      float dotSizeNoise = fbm(animatedCenter * 3.0 + vec2(50.0), u_seed + 30.0);
      float baseDotSize = u_minDotSize + dotSizeNoise * u_dotSizeVariation;
      float cellPhase = fract(sin(dot(cellID, vec2(41.123, 17.456))) * 12345.6789) * 6.28318;
      float breathe = sin(u_time * 0.5 + cellPhase) * u_dotBreathe;
      float sizeVariation = smoothstep(-0.3, 0.3, n1) * (u_maxDotSize - u_minDotSize) * 0.5;
      float dotRadius = baseDotSize + sizeVariation + breathe;
      float cellNoise = fract(sin(dot(cellID, vec2(12.9898, 78.233)) + u_seed) * 43758.5453);
      if (cellNoise > 0.85) dotRadius *= 0.3; else if (cellNoise > 0.7) dotRadius *= 1.3;
      dotRadius = clamp(dotRadius, u_minDotSize * 0.5, u_maxDotSize);
      vec2 toCenter = cellUV - vec2(0.5); float dist = length(toCenter);
      vec3 dotCol = u_dotColor;
      float dotColorNoise = fract(sin(dot(cellID + vec2(u_seed), vec2(45.123, 89.456))) * 12345.6789);
      if (dotColorNoise > 0.92) dotCol = getColor(fract(colorIndex + 0.5), u_seed);
      else if (dotColorNoise > 0.85) dotCol = mix(u_dotColor, bgColor, 0.2);
      float shimmerPhase = fract(sin(dot(cellID, vec2(73.156, 29.783))) * 54321.987) * 6.28318;
      float shimmer = 1.0 + sin(u_time * 1.5 + shimmerPhase) * u_shimmer;
      dotCol *= shimmer;
      float dotMask = 1.0 - smoothstep(dotRadius - u_dotSoftness, dotRadius + u_dotSoftness * 0.5, dist);
      float borderDist = min(min(cellUV.x, 1.0 - cellUV.x), min(cellUV.y, 1.0 - cellUV.y));
      bgColor *= 0.9 + smoothstep(0.0, u_cellGap, borderDist) * 0.1;
      vec3 color = mix(bgColor, dotCol, dotMask);
      color += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233) + u_seed)) * 43758.5453) - 0.5) * u_grain;
      color *= 1.0 - length(v_uv - 0.5) * u_vignette;
      gl_FragColor = vec4(color, 1.0);
    }`;
    
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    return shader;
  }
  
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  
  function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? [parseInt(r[1],16)/255, parseInt(r[2],16)/255, parseInt(r[3],16)/255] : [1,1,1];
  }
    
  const startTime = performance.now();

  function render(time) {
    const elapsed = (time - startTime) / 1000;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    gl.uniform1f(gl.getUniformLocation(program, 'u_seed'), config.seed);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), elapsed);
    gl.uniform1f(gl.getUniformLocation(program, 'u_aspectRatio'), canvas.width / canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, 'u_gridSize'), config.gridSize);
    gl.uniform1f(gl.getUniformLocation(program, 'u_cellGap'), config.cellGap);
    gl.uniform1f(gl.getUniformLocation(program, 'u_noiseScale'), config.noiseScale);
    gl.uniform1f(gl.getUniformLocation(program, 'u_swirlIntensity'), config.swirlIntensity);
    gl.uniform1f(gl.getUniformLocation(program, 'u_colorVariation'), config.colorVariation);
    gl.uniform1f(gl.getUniformLocation(program, 'u_minDotSize'), config.minDotSize);
    gl.uniform1f(gl.getUniformLocation(program, 'u_maxDotSize'), config.maxDotSize);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dotSizeVariation'), config.dotSizeVariation);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dotSoftness'), config.dotSoftness);
    gl.uniform1f(gl.getUniformLocation(program, 'u_grain'), config.grain);
    gl.uniform1f(gl.getUniformLocation(program, 'u_vignette'), config.vignette);
    gl.uniform1f(gl.getUniformLocation(program, 'u_flowSpeed'), config.flowSpeed);
    gl.uniform1f(gl.getUniformLocation(program, 'u_noiseDrift'), config.noiseDrift);
    gl.uniform1f(gl.getUniformLocation(program, 'u_driftChaos'), config.driftChaos);
    gl.uniform1f(gl.getUniformLocation(program, 'u_colorDrift'), config.colorDrift);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dotBreathe'), config.dotBreathe);
    gl.uniform1f(gl.getUniformLocation(program, 'u_shimmer'), config.shimmer);
    gl.uniform3fv(gl.getUniformLocation(program, 'u_color1'), hexToRgb(config.color1));
    gl.uniform3fv(gl.getUniformLocation(program, 'u_color2'), hexToRgb(config.color2));
    gl.uniform3fv(gl.getUniformLocation(program, 'u_color3'), hexToRgb(config.color3));
    gl.uniform3fv(gl.getUniformLocation(program, 'u_color4'), hexToRgb(config.color4));
    gl.uniform3fv(gl.getUniformLocation(program, 'u_color5'), hexToRgb(config.color5));
    gl.uniform3fv(gl.getUniformLocation(program, 'u_dotColor'), hexToRgb(config.dotColor));
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  
  requestAnimationFrame(render);
})
