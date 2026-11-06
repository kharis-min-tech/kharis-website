type EarthView = { lat: number; lng: number; radius: number; x: number; y: number };

const vertexSource = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentSource = `
precision highp float;
uniform sampler2D surface;
uniform sampler2D nightSurface;
uniform float nightReady;
uniform vec2 resolution;
uniform vec3 sphere;
uniform vec2 rotation;
const float PI = 3.14159265359;
void main() {
  vec2 pixel = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
  vec2 p = (pixel - sphere.xy) / sphere.z;
  p.y = -p.y;
  float distance = length(p);
  if (distance > 1.0) {
    float atmosphere = exp(-(distance - 1.0) * 34.0) * 0.8;
    float rim = exp(-(distance - 1.0) * 180.0);
    gl_FragColor = vec4(vec3(0.08, 0.46, 0.86) + vec3(0.3, 0.45, 0.14) * rim, atmosphere);
    return;
  }
  float front = sqrt(max(0.0, 1.0 - dot(p, p)));
  float latitude = rotation.y;
  float longitude = rotation.x;
  float y = p.y * cos(latitude) + front * sin(latitude);
  float depth = front * cos(latitude) - p.y * sin(latitude);
  float x = p.x * cos(longitude) + depth * sin(longitude);
  float z = -p.x * sin(longitude) + depth * cos(longitude);
  vec2 uv = vec2(atan(x, z) / (2.0 * PI) + 0.5, asin(clamp(y, -1.0, 1.0)) / PI + 0.5);
  vec3 color = texture2D(surface, uv).rgb;
  vec3 night = texture2D(nightSurface, uv).rgb * nightReady;
  vec3 normal = vec3(p, front);
  float light = max(0.0, dot(normal, normalize(vec3(-0.35, 0.55, 1.0))));
  color = color * (0.28 + light * 0.66) + vec3(0.0, 0.018, 0.045);
  float cityLights = smoothstep(0.14, 0.7, max(night.r, max(night.g, night.b)));
  color += vec3(1.0, 0.65, 0.22) * cityLights * 1.1;
  color += vec3(0.08, 0.43, 0.88) * pow(1.0 - front, 3.5) * 1.1;
  color += vec3(0.28, 0.67, 1.0) * exp(-(1.0 - distance) * 180.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

/** A single textured sphere, without a scene graph or a third-party 3D runtime. */
export function createEarthRenderer(
  canvas: HTMLCanvasElement,
  url: string,
  nightUrl: string,
  onReady: () => void,
) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
  });
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  const nightTexture = gl.createTexture();
  if (!program || !buffer || !texture || !nightTexture) return null;
  const dispose = () => {
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteTexture(texture);
    gl.deleteTexture(nightTexture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertexSource],
    [gl.FRAGMENT_SHADER, fragmentSource],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) {
      dispose();
      return null;
    }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      dispose();
      return null;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, "resolution");
  const sphere = gl.getUniformLocation(program, "sphere");
  const rotation = gl.getUniformLocation(program, "rotation");
  const nightReady = gl.getUniformLocation(program, "nightReady");
  gl.uniform1i(gl.getUniformLocation(program, "surface"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "nightSurface"), 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, nightTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let ready = false;
  let lightsReady = false;
  let disposed = false;
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    if (disposed || gl.isContextLost()) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    ready = true;
    canvas.dataset.ready = "true";
    onReady();
  };
  const nightImage = new Image();
  nightImage.crossOrigin = "anonymous";
  nightImage.onload = () => {
    if (disposed || gl.isContextLost()) return;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, nightTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, nightImage);
    lightsReady = true;
    canvas.dataset.lights = "true";
    onReady();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const size = window.innerWidth < 760 ? 2048 : 3840;
      image.src = `/_next/image?url=${encodeURIComponent(url)}&w=${size}&q=90`;
      nightImage.src = `/_next/image?url=${encodeURIComponent(nightUrl)}&w=${size}&q=90`;
    },
    { rootMargin: "200px" },
  );
  observer.observe(canvas);
  return {
    draw(view: EarthView, width: number, height: number) {
      if (!ready || gl.isContextLost()) return false;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(width * scale),
        h = Math.round(height * scale);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.useProgram(program);
      gl.uniform2f(resolution, w, h);
      gl.uniform3f(sphere, view.x * scale, view.y * scale, view.radius * scale);
      gl.uniform2f(rotation, (view.lng * Math.PI) / 180, (view.lat * Math.PI) / 180);
      gl.uniform1f(nightReady, lightsReady ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return true;
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      image.onload = image.onerror = null;
      nightImage.onload = nightImage.onerror = null;
      dispose();
    },
  };
}
