import { useEffect, useRef } from 'react';
import { useQuietMotion } from '../../hooks/useQuietMotion';

// A photographic background remains visible while the shader starts or if WebGL is unavailable.
export function SceneLight({ material }: { material: 'silk' | 'rays' }) {
  const quiet = useQuietMotion();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || quiet) return;
    const intro = document.querySelector<HTMLDialogElement>('.signature-intro[open]');
    let mounted = true;
    let loading = false;
    let scene: ReturnType<typeof import('./sceneRenderer').createScene>;
    let visible = false;
    let contextLost = false;
    let unavailable = false;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;

    function tick(now: number) {
      if (now - previous >= 1000 / 24) {
        elapsed += Math.min(now - previous, 100) / 1000;
        previous = now;
        scene?.render(elapsed * 0.33);
      }
      frame = requestAnimationFrame(tick);
    }
    function canPlay() {
      return mounted && visible && !document.hidden && !intro?.open;
    }
    function sync() {
      cancelAnimationFrame(frame);
      if (!canvas) return;
      const active = canPlay();
      canvas.dataset.active = String(active);
      if (!active || unavailable || contextLost || loading) return;
      if (!scene) {
        loading = true;
        import('./sceneRenderer').then(({ createScene }) => {
          loading = false;
          if (!canPlay() || contextLost) return;
          scene = createScene(canvas, material);
          if (!scene) throw new Error('WebGL unavailable');
          sync();
        }).catch(() => {
          unavailable = true;
          if (mounted) canvas.dataset.fallback = 'true';
        });
        return;
      }
      previous = performance.now() - 50;
      frame = requestAnimationFrame(tick);
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    intro?.addEventListener('close', sync);
    document.addEventListener('visibilitychange', sync);
    const lost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      canvas.dataset.fallback = 'true';
      sync();
    };
    const restored = () => {
      contextLost = false;
      delete canvas.dataset.fallback;
      scene?.dispose();
      scene = undefined;
      unavailable = false;
      sync();
    };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intro?.removeEventListener('close', sync);
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
      scene?.dispose();
    };
  }, [material, quiet]);
  if (quiet) return null;
  return <canvas ref={ref} className={`scene-light scene-${material}`} aria-hidden="true" />;
}
