<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);

// Fixed render settings (locked "high" quality, 30fps).
const CFG = { maxDim: 1920, dprCap: 1.5, fps: 30 };
const LOOK = {
  coverage: 0.46,
  wisp: 0.3,
  cumulus: 0.5,
  detail: 0.41,
  scale: 0.5,
  speed: 0.7,
  exposure: 1.25,
  mieG: 0.76,
  haze: 0.75,
  msfill: 1,
  irid: 0.3,
  stars: 0.5,
  dither: 1,
  pixel: 2.5,
  levels: 10,
};

// ---- approximate location from the browser timezone (no permission prompt) ----
const TZ_COORDS: Record<string, [number, number]> = {
  "America/New_York": [40.71, -74.01],
  "America/Chicago": [41.85, -87.65],
  "America/Denver": [39.74, -104.98],
  "America/Los_Angeles": [34.05, -118.24],
  "America/Phoenix": [33.45, -112.07],
  "America/Anchorage": [61.22, -149.9],
  "America/Toronto": [43.65, -79.38],
  "America/Vancouver": [49.28, -123.12],
  "America/Halifax": [44.65, -63.57],
  "America/Mexico_City": [19.43, -99.13],
  "America/Bogota": [4.71, -74.07],
  "America/Lima": [-12.05, -77.04],
  "America/Sao_Paulo": [-23.55, -46.63],
  "America/Argentina/Buenos_Aires": [-34.61, -58.38],
  "America/Santiago": [-33.45, -70.67],
  "Europe/London": [51.51, -0.13],
  "Europe/Dublin": [53.35, -6.26],
  "Europe/Lisbon": [38.72, -9.14],
  "Europe/Paris": [48.85, 2.35],
  "Europe/Madrid": [40.42, -3.7],
  "Europe/Berlin": [52.52, 13.4],
  "Europe/Rome": [41.9, 12.5],
  "Europe/Amsterdam": [52.37, 4.9],
  "Europe/Stockholm": [59.33, 18.07],
  "Europe/Athens": [37.98, 23.73],
  "Europe/Istanbul": [41.01, 28.98],
  "Europe/Moscow": [55.76, 37.62],
  "Africa/Cairo": [30.04, 31.24],
  "Africa/Lagos": [6.52, 3.38],
  "Africa/Johannesburg": [-26.2, 28.05],
  "Asia/Jerusalem": [31.78, 35.22],
  "Asia/Dubai": [25.2, 55.27],
  "Asia/Karachi": [24.86, 67.0],
  "Asia/Kolkata": [22.57, 88.36],
  "Asia/Bangkok": [13.76, 100.5],
  "Asia/Jakarta": [-6.21, 106.85],
  "Asia/Singapore": [1.35, 103.82],
  "Asia/Hong_Kong": [22.32, 114.17],
  "Asia/Shanghai": [31.23, 121.47],
  "Asia/Seoul": [37.57, 126.98],
  "Asia/Tokyo": [35.68, 139.69],
  "Australia/Sydney": [-33.87, 151.21],
  "Australia/Perth": [-31.95, 115.86],
  "Pacific/Auckland": [-36.85, 174.76],
  "Pacific/Honolulu": [21.31, -157.86],
};

function approxCoords(): [number, number] {
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    tz = "";
  }
  const known = TZ_COORDS[tz];
  if (known) return known;
  const off = -new Date().getTimezoneOffset();
  return [40, Math.max(-180, Math.min(180, off / 4))];
}

// ---- minimal SunCalc: sun altitude (degrees) for a date + lat/lng ----
const SC_RAD = Math.PI / 180;
const SC_E = SC_RAD * 23.4397;

function sunAltitudeDeg(date: Date, lat: number, lng: number): number {
  const d = date.valueOf() / 86400000 - 0.5 + 2440588 - 2451545;
  const m = SC_RAD * (357.5291 + 0.98560028 * d);
  const l =
    m +
    SC_RAD * (1.9148 * Math.sin(m) + 0.02 * Math.sin(2 * m) + 0.0003 * Math.sin(3 * m)) +
    SC_RAD * 102.9372 +
    Math.PI;
  const dec = Math.asin(Math.sin(SC_E) * Math.sin(l));
  const ra = Math.atan2(Math.sin(l) * Math.cos(SC_E), Math.cos(l));
  const h = SC_RAD * (280.16 + 360.9856235 * d) - SC_RAD * -lng - ra;
  return (
    (Math.asin(
      Math.sin(SC_RAD * lat) * Math.sin(dec) + Math.cos(SC_RAD * lat) * Math.cos(dec) * Math.cos(h),
    ) *
      180) /
    Math.PI
  );
}

// GLSL-style smoothstep, for the sun-elevation curves used per frame
function smooth01(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

const VERT = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }";
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define PI 3.141592653589793
#define I_STEPS 12
#define J_STEPS 6
uniform vec2 u_resolution; uniform float u_time;
uniform float u_coverage,u_wisp,u_cumulus,u_detail,u_scale,u_speed;
uniform vec2 u_seed;
uniform float u_sunEl,u_sunAz,u_exposure,u_mieG,u_haze,u_msfill,u_irid,u_stars;
uniform float u_dither,u_pixel,u_levels;
float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i),b=hash(i+vec2(1.0,0.0)),c=hash(i+vec2(0.0,1.0)),d=hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
const mat2 M=mat2(1.6,1.2,-1.2,1.6);
float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<6;i++){ s+=a*noise(p); p=M*p; a*=0.5; } return s; }
float ridged(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<5;i++){ float n=noise(p); n=1.0-abs(2.0*n-1.0); s+=a*n*n; p=M*p; a*=0.5; } return s; }
float cumulusBase(vec2 uv,float aspect,float time,float scale,float speed){
  vec2 p=vec2(uv.x*aspect,uv.y); p.y*=1.2; p*=(1.5*scale); p+=vec2(time*0.012*speed,0.0); p+=u_seed;
  vec2 q=vec2(fbm(p),fbm(p+vec2(5.2,1.3))); return fbm(p+1.7*q); }
float Bayer2(vec2 a){ a=floor(a); return fract(a.x*0.5+a.y*a.y*0.75); }
#define Bayer4(a) (Bayer2(0.5*(a))*0.25+Bayer2(a))
#define Bayer8(a) (Bayer4(0.5*(a))*0.25+Bayer2(a))
const float R_PLANET=6371000.0,R_ATMOS=6471000.0,SUN_I=22.0,H_RAY=8000.0,H_MIE=1200.0,BETA_MIE_BASE=21e-6;
const vec3 BETA_RAY=vec3(5.8e-6,13.5e-6,33.1e-6);
const vec3 BETA_OZO=vec3(0.650e-6,1.881e-6,0.085e-6);
float ozoneDensity(float h){ return max(0.0,1.0-abs(h-25000.0)/15000.0); }
vec2 rsi(vec3 r0,vec3 rd,float sr){ float b=dot(r0,rd),c=dot(r0,r0)-sr*sr,d=b*b-c; if(d<0.0) return vec2(1e5,-1e5); d=sqrt(d); return vec2(-b-d,-b+d); }
vec3 atmosphere(vec3 r,vec3 r0,vec3 pSun){
  vec2 p=rsi(r0,r,R_ATMOS); if(p.x>p.y) return vec3(0.0); p.x=max(p.x,0.0);
  float iStep=(p.y-p.x)/float(I_STEPS),iT=p.x;
  vec3 totalRay=vec3(0.0),totalMie=vec3(0.0); float odRay=0.0,odMie=0.0,odOzo=0.0;
  float mieG=u_mieG, betaMie=BETA_MIE_BASE*u_haze;
  float mu=dot(r,pSun),mumu=mu*mu,gg=mieG*mieG;
  float pRay=3.0/(16.0*PI)*(1.0+mumu);
  float pMie=3.0/(8.0*PI)*((1.0-gg)*(mumu+1.0))/(pow(1.0+gg-2.0*mu*mieG,1.5)*(2.0+gg));
  for(int i=0;i<I_STEPS;i++){
    vec3 iPos=r0+r*(iT+iStep*0.5); float iH=length(iPos)-R_PLANET;
    float odSRay=exp(-iH/H_RAY)*iStep, odSMie=exp(-iH/H_MIE)*iStep; odRay+=odSRay; odMie+=odSMie; odOzo+=ozoneDensity(iH)*iStep;
    float jStep=rsi(iPos,pSun,R_ATMOS).y/float(J_STEPS),jT=0.0,jOdRay=0.0,jOdMie=0.0,jOdOzo=0.0;
    for(int j=0;j<J_STEPS;j++){ vec3 jPos=iPos+pSun*(jT+jStep*0.5); float jH=length(jPos)-R_PLANET;
      jOdRay+=exp(-jH/H_RAY)*jStep; jOdMie+=exp(-jH/H_MIE)*jStep; jOdOzo+=ozoneDensity(jH)*jStep; jT+=jStep; }
    vec3 attn=exp(-(betaMie*(odMie+jOdMie)+BETA_RAY*(odRay+jOdRay)+BETA_OZO*(odOzo+jOdOzo)));
    totalRay+=odSRay*attn; totalMie+=odSMie*attn; iT+=iStep; }
  vec3 single=pRay*BETA_RAY*totalRay+pMie*betaMie*totalMie;
  float fill=1.0-exp(-odRay*8.0e-6); fill*=fill;
  vec3 ms=vec3(0.55,0.60,0.74)*fill*u_msfill*0.12;
  return SUN_I*(single+ms); }
vec3 sunlightColor(vec3 r0,vec3 pSun){
  float far=rsi(r0,pSun,R_ATMOS).y,step=far/float(J_STEPS),t=0.0,odR=0.0,odM=0.0,odO=0.0;
  for(int j=0;j<J_STEPS;j++){ vec3 pos=r0+pSun*(t+step*0.5); float h=max(length(pos)-R_PLANET,0.0);
    odR+=exp(-h/H_RAY)*step; odM+=exp(-h/H_MIE)*step; odO+=ozoneDensity(h)*step; t+=step; }
  return exp(-(BETA_RAY*odR+BETA_MIE_BASE*u_haze*1.1*odM+BETA_OZO*odO)); }
vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0); }
vec3 spectrum(float t){ return clamp(vec3(1.5-abs(4.0*t-1.0),1.5-abs(4.0*t-2.0),1.5-abs(4.0*t-3.0)),0.0,1.0); }
vec3 getSunDir(){ float el=radians(u_sunEl),az=radians(u_sunAz); return normalize(vec3(sin(az)*cos(el),sin(el),cos(az)*cos(el))); }
vec3 getViewDir(vec2 uv,float aspect){ return normalize(vec3((uv.x-0.5)*aspect*0.9,uv.y*0.9+0.02,1.0)); }
// ---- night sky: layered stars + milky way ----
vec2 hash22(vec2 p){ return vec2(hash(p),hash(p+47.13)); }
vec3 starLayer(vec2 sp,float gridScale,float coverage,float coreR,float t){
  vec2 g=sp*gridScale; vec2 i=floor(g); vec2 f=fract(g)-0.5;
  f-=(hash22(i)-0.5)*0.7; float r=length(f);
  float present=step(1.0-coverage,hash(i+3.7));
  float mag=pow(hash(i+9.1),3.0);                 // steep falloff: many faint, few brilliant
  float radius=coreR*(0.7+0.4*mag); float core=smoothstep(radius,0.0,r);
  float s=core*present*(0.18+1.5*mag);            // wide range; the brightest punch to white
  float rnd=hash(i+13.1); s*=0.9+0.1*sin(t*(0.25+0.35*rnd)+rnd*6.2831);  // slow, subtle twinkle
  float temp=hash(i+21.3);                        // cool blue-white <-> warm amber
  vec3 tint=mix(vec3(0.74,0.83,1.0),vec3(1.0,0.85,0.70),temp);
  return s*mix(vec3(1.0),tint,0.5); }
float milkyBand(vec2 sp){
  float a=-0.62; vec2 c=sp-vec2(0.7,0.52);
  vec2 q=mat2(cos(a),-sin(a),sin(a),cos(a))*c;
  q.y+=0.10*(fbm(sp*1.6+12.0)-0.5); float w=0.12;
  return exp(-(q.y*q.y)/(2.0*w*w)); }
vec3 nightSky(vec2 uv,float aspect,float t){
  vec2 sp=vec2(uv.x*aspect,uv.y);
  float dens=0.35+0.65*fbm(sp*2.0+50.0);          // low-freq clustering field
  float band=milkyBand(sp); float densB=dens*(1.0+band*1.6);  // stars crowd into the band
  vec3 stars=vec3(0.0);
  stars+=starLayer(sp,46.0,0.05*densB,0.11,t)*1.00;   // bright, large, sparse
  stars+=starLayer(sp,95.0,0.09*densB,0.12,t)*0.70;   // medium
  stars+=starLayer(sp,185.0,0.15*densB,0.09,t)*0.45;  // fine dust
  float neb=fbm(sp*4.5+30.0); float dust=ridged(sp*3.2+5.0);
  float glow=band*(0.35+0.65*neb)*(1.0-0.55*dust);
  vec3 glowCol=mix(vec3(0.55,0.66,0.95),vec3(1.0,0.94,0.86),neb);
  return stars+glowCol*glow*0.055; }
vec3 scene(vec2 fragCoord){
  vec2 uv=fragCoord/u_resolution.xy; float aspect=u_resolution.x/u_resolution.y;
  vec3 sunDir=getSunDir(), viewDir=getViewDir(uv,aspect); float cosT=dot(viewDir,sunDir);
  vec3 r0=vec3(0.0,R_PLANET+1.0,0.0); vec3 sky=atmosphere(viewDir,r0,sunDir);
  float disc=smoothstep(0.99966,0.99986,cosT); sky+=disc*vec3(1.0,0.95,0.88)*20.0;
  vec3 col=aces(sky*u_exposure);
  // night: lift the sky from black toward an inky moonlit blue, then add stars + milky way
  float nightFade=1.0-smoothstep(0.0,0.10,sunDir.y);
  col+=vec3(0.020,0.040,0.105)*nightFade;
  if(nightFade*u_stars>0.001){
    float darkMask=1.0-smoothstep(0.12,0.45,dot(col,vec3(0.3,0.59,0.11)));
    col+=nightSky(uv,aspect,u_time)*nightFade*darkMask*u_stars; }
  float dayT=smoothstep(-0.04,0.32,sunDir.y);
  vec3 sun=sunlightColor(r0,sunDir); float sunMean=dot(sun,vec3(0.3333));
  vec3 litColor=clamp(sun*(1.55/(sunMean+0.42)),0.0,1.3);
  float twi=smoothstep(0.18,-0.06,sunDir.y);
  vec3 ambCol=mix(vec3(0.60,0.68,0.82),vec3(0.42,0.36,0.56),twi);
  ambCol=mix(ambCol,vec3(0.30,0.22,0.40),smoothstep(0.05,-0.10,sunDir.y));
  ambCol+=vec3(0.04,0.06,0.10)*nightFade;  // faint cool moonlight on night clouds
  float halo=pow(max(cosT,0.0),5.0);
  vec2 p=vec2(uv.x*aspect,uv.y); float ca=cos(0.30),sa=sin(0.30); p=mat2(ca,-sa,sa,ca)*p; p.y*=2.6; p*=(2.2*u_scale); p+=u_seed;
  float t=u_time*0.03*u_speed; vec2 drift=vec2(t,t*0.15); vec2 cp=p+drift;
  vec2 q=vec2(fbm(cp),fbm(cp+vec2(3.3,1.7)));
  vec2 rr=vec2(fbm(cp+2.4*q+vec2(1.7,9.2)),fbm(cp+2.4*q+vec2(8.3,2.8)));
  float cirBase=fbm(cp+2.0*rr);
  vec2 fp=p; fp.y*=1.7; float fil=ridged(fp*1.9+rr*1.5+drift*1.3);
  float cirD=cirBase+(fil-0.5)*u_detail;
  float cirLo=mix(0.64,0.34,u_coverage),cirHi=cirLo+mix(0.55,0.18,u_wisp);
  float cirA=smoothstep(cirLo,cirHi,cirD); cirA=pow(cirA,1.15);
  cirA*=mix(0.30,1.0,smoothstep(0.12,0.58,uv.y)); cirA*=(0.6+0.4*dayT);
  float cirShade=smoothstep(0.1,0.95,cirBase); vec3 cirColor=mix(ambCol,litColor,cirShade);
  cirColor=mix(cirColor,clamp(litColor*1.2,0.0,1.3),halo*0.7);
  col=mix(col,cirColor,clamp(cirA,0.0,1.0));
  float cmlC=cumulusBase(uv,aspect,u_time,u_scale,u_speed);
  vec2 cmlP=vec2(uv.x*aspect,uv.y); cmlP.y*=1.2; cmlP*=(1.5*u_scale); cmlP+=u_seed;
  float billow=fbm(cmlP*2.4+vec2(u_time*0.012*u_speed,0.0));
  float cmlD=cmlC*0.65+billow*0.35;
  float cmlLo=mix(0.58,0.40,u_coverage),cmlHi=cmlLo+0.14;
  float cmlA=smoothstep(cmlLo,cmlHi,cmlD); cmlA=pow(cmlA,0.85);
  float wCml=smoothstep(0.82,0.02,uv.y); cmlA*=wCml*u_cumulus; cmlA=clamp(cmlA,0.0,1.0);
  vec2 sdir=normalize(vec2(sunDir.x/aspect,sunDir.y)+vec2(1e-4,1e-4)); float e2=0.02;
  float cmlF=cumulusBase(uv+e2*sdir,aspect,u_time,u_scale,u_speed);
  float cmlB=cumulusBase(uv-e2*sdir,aspect,u_time,u_scale,u_speed);
  float litF=clamp(0.5+(cmlB-cmlF)*3.0,0.06,1.0);
  vec3 cmlColor=mix(ambCol,litColor,litF); cmlColor+=litColor*halo*0.4;
  vec3 iridM=mix(vec3(1.0),spectrum(fract(cmlD*5.0+cosT*7.0)),0.6);
  cmlColor=mix(cmlColor,cmlColor*iridM*1.4,smoothstep(0.05,0.97,cosT)*u_irid);
  col=mix(col,cmlColor,cmlA);
  return clamp(col,0.0,1.0); }
void main(){
  if(u_dither>0.5){
    float px=max(u_pixel,1.0); vec2 cell=floor(gl_FragCoord.xy/px);
    vec3 col=scene((cell+0.5)*px); float n=max(u_levels,2.0);
    float d=Bayer8(cell)-0.5;
    col+=d/(n-1.0); col=floor(col*(n-1.0)+0.5)/(n-1.0);
    gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
  } else {
    vec3 col=scene(gl_FragCoord.xy); col+=(hash(gl_FragCoord.xy+u_time)-0.5)/255.0;
    gl_FragColor=vec4(col,1.0);
  }
}`;

function initSky(el: HTMLCanvasElement): () => void {
  const ctx = (el.getContext("webgl", {
    antialias: false,
    depth: false,
    alpha: true,
    powerPreference: "low-power",
  }) || el.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!ctx) {
    el.style.display = "none"; // CSS gradient on the band shows through
    return () => {};
  }
  const gl = ctx; // non-null type so it stays valid inside the render closures

  const compile = (type: number, src: string): WebGLShader | null => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) {
    el.style.display = "none";
    return () => {};
  }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    el.style.display = "none";
    return () => {};
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  gl.uniform1f(u("u_coverage"), LOOK.coverage);
  gl.uniform1f(u("u_wisp"), LOOK.wisp);
  gl.uniform1f(u("u_cumulus"), LOOK.cumulus);
  gl.uniform1f(u("u_detail"), LOOK.detail);
  gl.uniform1f(u("u_scale"), LOOK.scale);
  gl.uniform1f(u("u_speed"), LOOK.speed);
  gl.uniform1f(u("u_exposure"), LOOK.exposure);
  gl.uniform1f(u("u_mieG"), LOOK.mieG);
  gl.uniform1f(u("u_haze"), LOOK.haze);
  gl.uniform1f(u("u_msfill"), LOOK.msfill);
  gl.uniform1f(u("u_irid"), LOOK.irid);
  gl.uniform1f(u("u_stars"), LOOK.stars);
  gl.uniform1f(u("u_dither"), LOOK.dither);
  gl.uniform1f(u("u_pixel"), LOOK.pixel);
  gl.uniform1f(u("u_levels"), LOOK.levels);
  gl.uniform2f(u("u_seed"), Math.random() * 100, Math.random() * 100);
  const uRes = u("u_resolution");
  const uTime = u("u_time");
  const uSunEl = u("u_sunEl");
  const uSunAz = u("u_sunAz");
  const uWisp = u("u_wisp");
  const uHaze = u("u_haze");
  const uMsfill = u("u_msfill");

  const coords = approxCoords();
  const frameInterval = 1000 / CFG.fps;
  let clock = 0;
  let last = 0;
  let acc = 0;
  let raf = 0;
  let running = false;
  let inView = false;
  let hidden = document.hidden;
  let renderedStatic = false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sunEl = 20;
  let lastSunCalc = -1e9;

  function updateSun(): void {
    const now = performance.now();
    if (now - lastSunCalc < 30000) return;
    lastSunCalc = now;
    const deg = sunAltitudeDeg(new Date(), coords[0], coords[1]);
    // Stretch the twilight descent: below TWILIGHT_TOP° the sun appears to fall at
    // 1/TWILIGHT_STRETCH the real rate, so night arrives gradually well after actual
    // sunset and each degree lingers; daytime (above TWILIGHT_TOP) tracks the sun 1:1.
    const TWILIGHT_TOP = 2;
    const TWILIGHT_STRETCH = 3;
    const shown = deg < TWILIGHT_TOP ? TWILIGHT_TOP + (deg - TWILIGHT_TOP) / TWILIGHT_STRETCH : deg;
    sunEl = Math.max(-2, Math.min(90, shown)); // -2 = the lowest the sun ever displays (night holds here)
  }

  function renderFrame(): void {
    updateSun();
    gl.uniform1f(uTime, clock);
    gl.uniform1f(uSunEl, sunEl);
    // sun-elevation-driven look, recomputed as the day progresses
    const aboveTen = smooth01(8, 12, sunEl);
    gl.uniform1f(uWisp, 0.6 + (LOOK.wisp - 0.6) * aboveTen); // 0.6 below 10°, LOOK.wisp above
    gl.uniform1f(uHaze, 1.5 * (1 - aboveTen)); // 1.5 below 10°, 0 above
    gl.uniform1f(uMsfill, LOOK.msfill * smooth01(40, 60, sunEl)); // daylight fill nears 0 below 40°
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function resize(): void {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);
    let w = r.width * dpr;
    let h = r.height * dpr;
    const longest = Math.max(w, h);
    if (longest > CFG.maxDim) {
      const s = CFG.maxDim / longest;
      w *= s;
      h *= s;
    }
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    if (el.width !== w || el.height !== h) {
      el.width = w;
      el.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
    const az = Math.round((Math.atan((-0.05 - 0.5) * (w / h) * 0.9) * 180) / Math.PI); // sun just off the left edge
    gl.uniform1f(uSunAz, az);
  }

  // Resizing the backing store (above) clears it to transparent, exposing the
  // gradient behind the canvas. Coalesce ResizeObserver bursts into a single
  // rAF and repaint in the same frame so no blank frame ever reaches the screen.
  let resizeRaf = 0;
  function scheduleResize(): void {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      resize();
      renderFrame();
    });
  }

  function tick(now: number): void {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (last === 0) last = now;
    let dt = now - last;
    last = now;
    if (dt > 250) dt = 250;
    clock += dt / 1000; // clock tracks real time → drift speed stays correct
    acc += dt;
    if (acc < frameInterval) return; // throttle draws to target fps
    acc -= frameInterval;
    if (acc > frameInterval) acc = 0;
    renderFrame();
  }

  function start(): void {
    if (running) return;
    running = true;
    last = 0;
    acc = 0;
    raf = requestAnimationFrame(tick);
  }

  function stop(): void {
    if (!running) return;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function sync(): void {
    const visible = inView && !hidden;
    if (reduced) {
      stop();
      if (visible && !renderedStatic) {
        renderFrame();
        renderedStatic = true;
      }
      return;
    }
    if (visible) start();
    else stop();
  }

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry) inView = entry.isIntersecting;
      sync();
    },
    { rootMargin: "200px" },
  );
  io.observe(el);

  const ro = new ResizeObserver(() => scheduleResize());
  ro.observe(el);

  const onVis = (): void => {
    hidden = document.hidden;
    sync();
  };
  document.addEventListener("visibilitychange", onVis);

  const onLost = (e: Event): void => {
    e.preventDefault();
    stop();
  };
  el.addEventListener("webglcontextlost", onLost, false);

  resize();
  renderFrame(); // immediate first paint; sync() then starts the loop if visible
  sync();

  return () => {
    stop();
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    el.removeEventListener("webglcontextlost", onLost);
    const ext = gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  };
}

let cleanup: (() => void) | null = null;

onMounted(() => {
  if (canvas.value) cleanup = initSky(canvas.value);
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <canvas ref="canvas" class="Sky" aria-hidden="true" />
</template>

<style scoped lang="scss">
.Sky {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

/* TEMP: time-of-day scrubber — remove with the slider in the template */
.Sky__debug {
  position: fixed;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(15, 22, 32, 0.78);
  color: #fff;
  font:
    12px/1 system-ui,
    sans-serif;

  input {
    width: 280px;
  }

  span {
    min-width: 56px;
    font-variant-numeric: tabular-nums;
  }
}
</style>
