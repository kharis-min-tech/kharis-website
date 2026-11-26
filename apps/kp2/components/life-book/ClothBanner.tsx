"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  /** One line per row of lettering. The first line is ink, the rest take the accent. */
  lines: string[];
  /** Small typewriter line under the lettering. */
  sub?: string;
  /** What the banner says, for screen readers. */
  label: string;
  className?: string;
  /** Width / height of the fabric. */
  aspect?: number;
  paper?: string;
  ink?: string;
  accent?: string;
  /** Wind strength, 0 to 2. */
  wind?: number;
};

/** Extra canvas around the fabric so folds can swing past its edges. */
const PAD_X = 0.06;
const PAD_Y = 0.14;
const SEGS_X = 56;
const PERSPECTIVE = 1400;

const VERT = `
attribute vec2 aUv;
attribute vec2 aZs;
uniform vec2 uSize;
uniform vec2 uHalf;
uniform float uP;
varying vec2 vUv;
varying float vShade;
varying float vZ;
void main() {
  vec3 p = vec3((aUv.x - 0.5) * uSize.x, (aUv.y - 0.5) * uSize.y, aZs.x);
  // The fabric gathers a little towards its middle as it billows.
  p.x -= (aUv.x - 0.5) * abs(aZs.x) * 0.08;
  float k = uP / (uP - p.z);
  gl_Position = vec4(p.x * k / uHalf.x, -p.y * k / uHalf.y, 0.0, 1.0);
  vUv = aUv;
  vShade = aZs.y;
  vZ = aZs.x;
}`;

const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uWeave;
varying vec2 vUv;
varying float vShade;
varying float vZ;
void main() {
  vec4 c = texture2D(uTex, vUv);
  // Woven threads: a faint cross-hatch that reads as fabric up close.
  float weave = 0.955 + 0.045 * sin(vUv.x * uWeave.x) * sin(vUv.y * uWeave.y);
  float sheen = pow(max(vShade - 1.0, 0.0), 2.0) * 1.6;
  gl_FragColor = vec4(c.rgb * vShade * weave + sheen, c.a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
  return shader;
}

function fontFamily(variable: string, fallback: string) {
  const value =
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim() ||
    getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value || fallback;
}

/** Paints the banner artwork: paper, halftone, a stitched hem and comic lettering. */
function paintTexture(
  canvas: HTMLCanvasElement,
  {
    lines,
    sub,
    paper,
    ink,
    accent,
    aspect,
  }: Required<Pick<Props, "lines" | "paper" | "ink" | "accent" | "aspect">> & { sub?: string },
) {
  const W = 1024;
  const H = Math.round(W / aspect);
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);

  // Halftone, heavier towards the bottom corner like printed shading.
  ctx.fillStyle = accent;
  for (let y = 0; y < H; y += 14) {
    for (let x = (y / 14) % 2 ? 7 : 0; x < W; x += 14) {
      const r = 3.4 * Math.max(0, (x / W + y / H) / 2 - 0.35);
      if (r > 0.3) {
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;

  // Hem: a solid border and a dashed stitch line inside it.
  const edge = W * 0.014;
  ctx.strokeStyle = ink;
  ctx.lineWidth = edge;
  ctx.strokeRect(edge / 2, edge / 2, W - edge, H - edge);
  ctx.setLineDash([W * 0.014, W * 0.01]);
  ctx.lineWidth = W * 0.0035;
  const inset = W * 0.03;
  ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
  ctx.setLineDash([]);

  const display = fontFamily("--font-anton", "Anton, Impact, sans-serif");
  const mono = fontFamily("--font-space", "'Space Mono', monospace");
  // Everything sits inside the stitched hem: lettering lines, a gap, then the small line.
  const pad = inset * 1.9;
  const subSize = sub ? H * 0.068 : 0;
  const gap = sub ? subSize * 0.9 : 0;
  const lineH = (H - pad * 2 - subSize - gap) / lines.length;
  let y = pad + lineH * 0.9;
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  lines.forEach((line, i) => {
    let size = lineH * 0.98;
    ctx.font = `${size}px ${display}`;
    const max = W * 0.86;
    const width = ctx.measureText(line.toUpperCase()).width;
    if (width > max) {
      size *= max / width;
      ctx.font = `${size}px ${display}`;
    }
    const text = line.toUpperCase();
    const shadow = size * 0.07;
    ctx.fillStyle = ink;
    ctx.fillText(text, W / 2 + shadow, y + shadow);
    ctx.lineWidth = size * 0.09;
    ctx.strokeStyle = ink;
    ctx.strokeText(text, W / 2, y);
    ctx.fillStyle = i === 0 ? paper : accent;
    ctx.fillText(text, W / 2, y);
    y += lineH;
  });
  if (sub) {
    ctx.font = `700 ${subSize}px ${mono}`;
    ctx.fillStyle = ink;
    ctx.fillText(sub.toUpperCase(), W / 2, pad + lineH * lines.length + gap + subSize * 0.8);
  }
}

/**
 * A comic banner printed on fabric that hangs from a rod and moves in the wind. The pointer
 * brushes the cloth and scrolling sends a gust through it. WebGL, with the lettering painted
 * into a texture; without WebGL the same banner shows as flat print. Reduced motion draws one
 * still frame.
 */
export function ClothBanner({
  lines,
  sub,
  label,
  className = "",
  aspect = 2.6,
  paper = "#fffdf5",
  ink = "#151218",
  accent = "#f7be1d",
  wind = 1,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flat, setFlat] = useState(false);
  const linesKey = lines.join("|");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      antialias: true,
      alpha: true,
    });
    if (!gl) {
      setFlat(true);
      return;
    }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      setFlat(true);
      return;
    }
    gl.useProgram(program);

    const NX = SEGS_X;
    const NY = Math.max(12, Math.round(SEGS_X / aspect));
    const cols = NX + 1;
    const rows = NY + 1;
    const count = cols * rows;

    const uv = new Float32Array(count * 2);
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        uv[(j * cols + i) * 2] = i / NX;
        uv[(j * cols + i) * 2 + 1] = j / NY;
      }
    const index = new Uint16Array(NX * NY * 6);
    let n = 0;
    for (let j = 0; j < NY; j++)
      for (let i = 0; i < NX; i++) {
        const a = j * cols + i;
        index.set([a, a + 1, a + cols, a + 1, a + cols + 1, a + cols], n);
        n += 6;
      }

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    const aUv = gl.getAttribLocation(program, "aUv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    const zs = new Float32Array(count * 2);
    const zsBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zsBuf);
    gl.bufferData(gl.ARRAY_BUFFER, zs, gl.DYNAMIC_DRAW);
    const aZs = gl.getAttribLocation(program, "aZs");
    gl.enableVertexAttribArray(aZs);
    gl.vertexAttribPointer(aZs, 2, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const art = document.createElement("canvas");
    const upload = () => {
      paintTexture(art, { lines: linesKey.split("|"), sub, paper, ink, accent, aspect });
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, art);
    };
    upload();
    // Repaint once the display face has loaded, so the lettering isn't drawn in a fallback font.
    const family = fontFamily("--font-anton", "Anton");
    document.fonts?.load(`80px ${family}`).then(
      () => {
        upload();
        if (still || !running) draw();
      },
      () => {},
    );

    gl.uniform1f(gl.getUniformLocation(program, "uP"), PERSPECTIVE);
    gl.uniform2f(gl.getUniformLocation(program, "uWeave"), NX * 9.0, NY * 9.0);
    const uSize = gl.getUniformLocation(program, "uSize");
    const uHalf = gl.getUniformLocation(program, "uHalf");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Fabric size in CSS px, and the canvas around it.
    let W = 0;
    let H = 0;
    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      const cw = W * (1 + PAD_X * 2);
      const ch = H * (1 + PAD_Y * 2);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uSize, W, H);
      gl.uniform2f(uHalf, cw / 2, ch / 2);
      if (still || !running) draw();
    };

    // Height field: a damped wave equation, pinned along the top edge (the rod).
    const h = new Float32Array(count);
    const v = new Float32Array(count);
    const at = (i: number, j: number) =>
      h[Math.min(NY, Math.max(0, j)) * cols + Math.min(NX, Math.max(0, i))]!;
    let t = Math.random() * 100;
    let scrollKick = 0;
    let lastScroll = window.scrollY;
    const brush = { x: -1, y: -1, power: 0 };

    const step = () => {
      t += 1 / 120;
      const gust = 0.55 + 0.45 * Math.sin(t * 0.37) * Math.sin(t * 0.71 + 1.3);
      for (let j = 1; j < rows; j++) {
        const hang = j / NY;
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const lap = at(i - 1, j) + at(i + 1, j) + at(i, j - 1) + at(i, j + 1) - 4 * h[k]!;
          let force = lap * 0.2;
          force += wind * 0.0016 * gust * hang * Math.sin(t * 1.7 + i * 0.21 + j * 0.13);
          force += scrollKick * hang * 0.0009;
          if (brush.power > 0.001) {
            const dx = (i / NX - brush.x) * aspect;
            const dy = j / NY - brush.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 0.06) force += brush.power * Math.exp(-d2 / 0.012) * 0.02;
          }
          v[k] = (v[k]! + force) * 0.982;
        }
      }
      for (let k = cols; k < count; k++) h[k] = h[k]! + v[k]!;
      brush.power *= 0.9;
      scrollKick *= 0.9;
    };

    const draw = () => {
      const amp = Math.min(W, 900) * 0.07;
      const dx = W / NX;
      const dy = H / NY;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const z = amp * Math.tanh(h[k]! * 1.5);
          const zl = amp * Math.tanh(at(i - 1, j) * 1.5);
          const zr = amp * Math.tanh(at(i + 1, j) * 1.5);
          const zu = amp * Math.tanh(at(i, j - 1) * 1.5);
          const zd = amp * Math.tanh(at(i, j + 1) * 1.5);
          const nx = (zl - zr) / (2 * dx);
          const ny = (zu - zd) / (2 * dy);
          const shade = Math.min(1.25, Math.max(0.55, 1 + nx * 0.9 + ny * 0.6 + z / (amp * 8)));
          zs[k * 2] = z;
          zs[k * 2 + 1] = shade;
        }
      gl.bindBuffer(gl.ARRAY_BUFFER, zsBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, zs);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
    };

    let running = false;
    let frame = 0;
    let last = 0;
    let carry = 0;
    const loop = (now: number) => {
      const elapsed = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const y = window.scrollY;
      scrollKick += Math.max(-40, Math.min(40, y - lastScroll));
      lastScroll = y;
      carry += elapsed;
      while (carry >= 1 / 120) {
        step();
        carry -= 1 / 120;
      }
      draw();
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || still) return;
      running = true;
      last = 0;
      lastScroll = window.scrollY;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    if (still) {
      // A gentle resting drape.
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++)
          h[j * cols + i] = 0.35 * (j / NY) * Math.sin(i * 0.22 + j * 0.1);
    } else {
      // Settle into motion before it is first seen.
      for (let s = 0; s < 240; s++) step();
    }

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const speed = brush.x < 0 ? 0 : Math.hypot(x - brush.x, y - brush.y);
      brush.x = x;
      brush.y = y;
      brush.power = Math.min(1.4, brush.power + speed * 18 + 0.05);
    };
    const onLeave = () => {
      brush.x = -1;
      brush.y = -1;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    const sizer = new ResizeObserver(resize);
    sizer.observe(wrap);
    resize();
    const seen = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()), {
      rootMargin: "100px",
    });
    seen.observe(wrap);

    return () => {
      stop();
      sizer.disconnect();
      seen.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      gl.deleteBuffer(uvBuf);
      gl.deleteBuffer(zsBuf);
      gl.deleteBuffer(idxBuf);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
    };
  }, [linesKey, sub, paper, ink, accent, aspect, wind]);

  return (
    <div
      ref={wrapRef}
      className={`lb-cloth ${className}`}
      data-flat={flat || undefined}
      style={
        {
          aspectRatio: String(aspect),
          "--sx": 1 + PAD_X * 2,
          "--sy": 1 + PAD_Y * 2,
        } as CSSProperties
      }
      role="img"
      aria-label={label}
    >
      <span className="lb-cloth__rod" aria-hidden="true" />
      {flat ? (
        <div
          className="lb-cloth__flat"
          aria-hidden="true"
          style={{ background: paper, color: ink }}
        >
          {lines.map((line, i) => (
            <span key={line} style={i ? { color: accent } : undefined}>
              {line}
            </span>
          ))}
          {sub ? <small>{sub}</small> : null}
        </div>
      ) : (
        <canvas ref={canvasRef} className="lb-cloth__canvas" aria-hidden="true" />
      )}
    </div>
  );
}
