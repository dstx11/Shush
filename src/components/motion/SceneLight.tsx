import { useEffect, useRef } from 'react';
import { rays, silk } from './sceneShaders';

const vertex = 'attribute vec2 point; void main(){gl_Position=vec4(point,0.0,1.0);}';

// A photographic background remains visible while the shader starts or if WebGL is unavailable.
export function SceneLight({ material }: { material: 'silk' | 'rays' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let dispose: (() => void) | undefined;
    let visible = false;
    let contextLost = false;
    let unavailable = false;
    let frame = 0;
    let render: ((time: number) => void) | undefined;
    let previous = 0;
    let elapsed = 0;

    function tick(now: number) {
      if (now - previous >= 1000 / 24) {
        elapsed += Math.min(now - previous, 100) / 1000;
        previous = now;
        render?.(elapsed * 0.33);
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      if (!canvas) return;
      const active = visible && !document.hidden;
      canvas.dataset.active = String(active);
      if (!active || contextLost || unavailable) return;
      if (!dispose) {
        const scene = createScene(canvas, material === 'silk' ? silk : rays);
        if (!scene) {
          unavailable = true;
          canvas.dataset.fallback = 'true';
          return;
        }
        ({ render, dispose } = scene);
      }
      previous = performance.now() - 50;
      frame = requestAnimationFrame(tick);
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    const lost = (event: Event) => { event.preventDefault(); contextLost = true; canvas.dataset.fallback = 'true'; cancelAnimationFrame(frame); };
    const restored = () => {
      contextLost = false;
      delete canvas.dataset.fallback;
      dispose?.();
      dispose = undefined;
      sync();
    };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
      dispose?.();
    };
  }, [material]);
  return <canvas ref={ref} className={`scene-light scene-${material}`} aria-hidden="true" />;
}

function createScene(canvas: HTMLCanvasElement, fragment: string) {
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
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
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
