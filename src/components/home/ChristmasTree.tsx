import { useEffect, useRef, useState } from 'react';

type Palette = 'aurora' | 'frost' | 'ember';
type Speck = { angle: number; height: number; radius: number; size: number; phase: number; color: number };
type Flake = { x: number; y: number; size: number; speed: number; phase: number };

const palettes: Record<Palette, { name: string; leaves: string[]; lights: string[]; ribbon: string; halo: string }> = {
  aurora: { name: 'Aurora', leaves: ['#346f65', '#4d9b83', '#9bddc6', '#256054'], lights: ['#fff2c2', '#b9f8e1', '#d5c0ff', '#f0acb4'], ribbon: '#e6c28f', halo: 'rgba(93, 199, 164, .17)' },
  frost: { name: 'Gelo', leaves: ['#367183', '#69a9c4', '#c8eef5', '#45679b'], lights: ['#ffffff', '#a8dfff', '#d7c0ff', '#9ff4fa'], ribbon: '#c8dfff', halo: 'rgba(112, 183, 232, .17)' },
  ember: { name: 'Clássico', leaves: ['#23634a', '#438b5c', '#9fca82', '#2b7554'], lights: ['#fff0a5', '#ffb46c', '#f28d8b', '#ffdbc2'], ribbon: '#f0ba69', halo: 'rgba(239, 173, 94, .14)' },
};

function scene(compact: boolean) {
  let seed = 4217;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
  const branches: Speck[] = [];
  const ornaments: Speck[] = [];
  const snow: Flake[] = [];
  for (let i = 0; i < (compact ? 730 : 1430); i++) {
    const height = Math.pow(random(), .89) * .96 + .025;
    branches.push({ angle: random() * Math.PI * 2, height, radius: (.94 - height * .87) * (.68 + random() * .32), size: .6 + random() * 1.9, phase: random() * 7, color: Math.floor(random() * 4) });
  }
  for (let i = 0; i < (compact ? 40 : 78); i++) {
    const height = .08 + random() * .84;
    ornaments.push({ angle: random() * Math.PI * 2, height, radius: (.96 - height * .89) * 1.02, size: 1.7 + random() * 2.6, phase: random() * 7, color: Math.floor(random() * 4) });
  }
  for (let i = 0; i < (compact ? 45 : 100); i++) {
    snow.push({ x: random(), y: random(), size: .5 + random() * 1.55, speed: .013 + random() * .038, phase: random() * 10 });
  }
  return { branches, ornaments, snow };
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, outer: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : outer * .38;
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function present(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, box: string, bow: string) {
  const h = size * .76;
  ctx.fillStyle = 'rgba(0,0,0,.24)';
  ctx.beginPath(); ctx.ellipse(x + 3, y + 3, size * .7, size * .16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = box;
  ctx.fillRect(x - size / 2, y - h, size, h);
  ctx.fillStyle = 'rgba(255,255,255,.13)';
  ctx.fillRect(x - size / 2, y - h, size, Math.max(3, size * .17));
  ctx.fillStyle = bow;
  ctx.fillRect(x - size * .09, y - h, size * .18, h);
  ctx.fillRect(x - size / 2, y - h * .58, size, size * .13);
  ctx.strokeStyle = bow; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.ellipse(x - size * .14, y - h - 2, size * .15, size * .08, -.45, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x + size * .14, y - h - 2, size * .15, size * .08, .45, 0, Math.PI * 2); ctx.stroke();
}

export function ChristmasTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [palette, setPalette] = useState<Palette>('aurora');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !stage || !ctx) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motion.matches;
    let visible = true;
    let width = 0;
    let height = 0;
    let raf = 0;
    let previous = 0;
    let elapsed = 0;
    let particles = scene(false);
    const colors = palettes[palette];

    function draw(seconds: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width / 540, height / 590);
      const centerX = width * .5 + pointer.current.x * 11 * scale;
      const baseY = height * .85 + pointer.current.y * 5 * scale;
      const treeHeight = Math.min(height * .69, 412 * scale);
      const treeWidth = Math.min(width * .38, 200 * scale);
      const rotation = seconds * .24 + .45 + pointer.current.x * .34;

      const halo = ctx.createRadialGradient(centerX, baseY - treeHeight * .42, 8, centerX, baseY - treeHeight * .42, treeWidth * 1.8);
      halo.addColorStop(0, colors.halo);
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      for (const flake of particles.snow) {
        const x = flake.x * width + Math.sin(seconds * .5 + flake.phase) * 10 * scale;
        const y = ((flake.y + seconds * flake.speed) % 1) * height;
        ctx.globalAlpha = .22 + .18 * (Math.sin(flake.phase + seconds) + 1);
        ctx.fillStyle = '#d9eff8';
        ctx.beginPath(); ctx.arc(x, y, flake.size * scale, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = 'rgba(182,222,211,.2)';
      ctx.lineWidth = scale;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.ellipse(centerX, baseY + 9 * scale, (125 + i * 28) * scale, (19 + i * 6) * scale, 0, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.fillStyle = '#3b292e';
      ctx.fillRect(centerX - 9 * scale, baseY - 21 * scale, 18 * scale, 30 * scale);
      const project = (speck: Speck) => {
        const angle = speck.angle + rotation;
        const depth = Math.sin(angle) * speck.radius;
        const perspective = 1 + depth * .15;
        return { x: centerX + Math.cos(angle) * speck.radius * treeWidth * perspective, y: baseY - speck.height * treeHeight + depth * 12 * scale, depth, perspective, speck };
      };

      const projected = particles.branches.map(project).sort((a, b) => a.depth - b.depth);
      for (const point of projected) {
        const flicker = .88 + Math.sin(seconds * 1.5 + point.speck.phase) * .12;
        ctx.globalAlpha = (.52 + (point.depth + 1) * .19) * flicker;
        ctx.fillStyle = colors.leaves[point.speck.color];
        ctx.beginPath(); ctx.arc(point.x, point.y, point.speck.size * scale * point.perspective, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Five helixes create a continuous ribbon, disappearing naturally behind the tree.
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        let open = false;
        for (let i = 0; i <= 380; i++) {
          const progress = i / 380;
          const h = .09 + progress * .82;
          const angle = progress * Math.PI * 11 + rotation + .9;
          const depth = Math.sin(angle);
          const radius = (1 - h) * treeWidth * 1.01;
          const x = centerX + Math.cos(angle) * radius;
          const y = baseY - h * treeHeight + depth * 12 * scale;
          const front = depth > (pass === 0 ? -.58 : .06);
          if (!front) { open = false; continue; }
          if (!open) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          open = true;
        }
        ctx.strokeStyle = colors.ribbon;
        ctx.lineWidth = (pass === 0 ? 1.2 : 2.15) * scale;
        ctx.globalAlpha = pass === 0 ? .26 : .8;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      for (const point of particles.ornaments.map(project).sort((a, b) => a.depth - b.depth)) {
        const radius = point.speck.size * scale * (1.15 + point.depth * .13);
        const pulse = .82 + .18 * Math.sin(seconds * 2.8 + point.speck.phase);
        ctx.globalAlpha = .6 + (point.depth + 1) * .2;
        if (point.depth > .2) { ctx.shadowBlur = 11 * scale * pulse; ctx.shadowColor = colors.lights[point.speck.color]; }
        ctx.fillStyle = colors.lights[point.speck.color];
        ctx.beginPath(); ctx.arc(point.x, point.y, radius, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(255,255,255,.7)';
        ctx.beginPath(); ctx.arc(point.x - radius * .3, point.y - radius * .3, Math.max(.5, radius * .22), 0, Math.PI * 2); ctx.fill();
      }

      const topY = baseY - treeHeight - 9 * scale;
      ctx.save();
      ctx.fillStyle = '#fff4cb';
      ctx.shadowColor = '#ffe9a3';
      ctx.shadowBlur = 27 * scale;
      star(ctx, centerX, topY, 18 * scale);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = .55;
      ctx.strokeStyle = '#fff5d3';
      ctx.lineWidth = .8 * scale;
      ctx.beginPath(); ctx.moveTo(centerX - 32 * scale, topY); ctx.lineTo(centerX + 32 * scale, topY);
      ctx.moveTo(centerX, topY - 32 * scale); ctx.lineTo(centerX, topY + 32 * scale); ctx.stroke();
      ctx.restore();

      present(ctx, centerX - 84 * scale, baseY + 9 * scale, 40 * scale, '#886479', '#f3cb90');
      present(ctx, centerX + 79 * scale, baseY + 13 * scale, 47 * scale, '#517e78', '#f9d6ac');
      present(ctx, centerX + 27 * scale, baseY + 15 * scale, 30 * scale, '#6a6597', '#d6e5ee');
    }

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = scene(width < 500);
      draw(elapsed);
    };

    const tick = (now: number) => {
      raf = window.requestAnimationFrame(tick);
      if (!visible || document.hidden || reduceMotion || paused || now - previous < 33) return;
      const delta = previous ? Math.min((now - previous) / 1000, .08) : 0;
      previous = now;
      elapsed += delta;
      draw(elapsed);
    };
    const onVisibility = () => { previous = 0; if (!document.hidden) draw(elapsed); };
    const onMotionChange = (event: MediaQueryListEvent) => { reduceMotion = event.matches; previous = 0; draw(elapsed); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      previous = 0;
      if (visible) draw(elapsed);
    }, { threshold: .02 });
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    observer.observe(stage);
    motion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    if (!paused && !reduceMotion) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      motion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [palette, paused]);

  return (
    <div ref={stageRef} className="winter-tree-stage" onPointerMove={(event) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = event.currentTarget.getBoundingClientRect();
      pointer.current = { x: (event.clientX - bounds.left) / bounds.width * 2 - 1, y: (event.clientY - bounds.top) / bounds.height * 2 - 1 };
    }} onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}>
      <div className="winter-stage-top" aria-hidden="true"><span>SHUSH // WINTER_26</span><span className="winter-status"><i /> INTERACTIVE SCENE</span></div>
      <canvas ref={canvasRef} className="winter-tree-canvas" role="img" aria-label="Árvore de Natal tridimensional formada por partículas luminosas verdes e enfeites, a rodar suavemente, com neve, estrela e presentes." />
      <div className="winter-stage-bottom">
        <div className="winter-palette" role="group" aria-label="Cor das luzes da árvore">
          {(Object.keys(palettes) as Palette[]).map((key) => <button key={key} type="button" aria-pressed={palette === key} onClick={() => setPalette(key)}>{palettes[key].name}</button>)}
        </div>
        <button className="winter-motion-toggle" type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? 'Reproduzir' : 'Pausar'} <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span></button>
      </div>
      <span className="winter-stage-caption" aria-hidden="true">MOVE O CURSOR · MUDA AS LUZES</span>
    </div>
  );
}
