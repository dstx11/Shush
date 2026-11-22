import { rays, silk } from './sceneShaders';

const vertex = 'attribute vec2 point; void main(){gl_Position=vec4(point,0.0,1.0);}';

export function createScene(canvas: HTMLCanvasElement, material: 'silk' | 'rays') {
  const fragment = material === 'silk' ? silk : rays;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) return;
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const shaders: WebGLShader[] = [];
  function dispose() {
    shaders.forEach(shader => gl!.deleteShader(shader));
    gl!.deleteBuffer(buffer);
    gl!.deleteProgram(program);
  }
  if (!program || !buffer) { dispose(); return; }
  for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
    const shader = gl.createShader(type);
    if (!shader) { dispose(); return; }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return; }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'point');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'resolution');
  const clock = gl.getUniformLocation(program, 'time');
  function resize() {
    const scale = Math.min(0.7, 900 / Math.max(1, canvas.clientWidth));
    const width = Math.max(1, Math.round(canvas.clientWidth * scale));
    const height = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(resolution, canvas.width, canvas.height);
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  return {
    render(time: number) { gl.uniform1f(clock, time); gl.drawArrays(gl.TRIANGLES, 0, 3); },
    dispose() { observer.disconnect(); dispose(); },
  };
}
