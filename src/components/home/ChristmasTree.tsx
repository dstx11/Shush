import { useEffect, useRef, useState } from 'react';

/**
 * Winter scene: perspective-projected fir branches, real branch needles,
 * glossy baubles, spiral fairy lights, aurora, layered snow and wrapped gifts.
 * Deliberately self-contained: no WebGL context contention or external assets.
 */
type Theme = 'christmas' | 'ice' | 'shush';
type Vec = { x: number; y: number; z: number };
type FirBranch = { y: number; angle: number; length: number; drop: number; shade: number; frost: boolean };
type Bauble = { y: number; angle: number; radius: number; size: number; color: number; sway: number };
type Snowflake = { x: number; y: number; depth: number; size: number; speed: number; phase: number };
type Star = { x: number; y: number; size: number; phase: number };

const themes: Record<Theme, {
  label: string; pine: string[]; dimPine: string[];
  baubles: string[]; bulbs: string[]; ribbon: string; sky: string; haze: string;
}> = {
  christmas: {
    label: 'Natal clássico',
    pine: ['#205844', '#327459', '#43876a', '#64a37f', '#8ab89a'],
    dimPine: ['#12372c', '#184534', '#23553d', '#306548', '#447657'],
    baubles: ['#bd354c', '#e9b86d', '#f1e4c7', '#b44054', '#d6a357'],
    bulbs: ['#ffdf83', '#ffeabc', '#f9a6a7', '#f4c562', '#eaffd7'],
    ribbon: '#f5c777', sky: '#0b1418', haze: 'rgba(180,118,63,.15)',
  },
  ice: {
    label: 'Noite gelada',
    pine: ['#205a61', '#2b7381', '#4b909c', '#75b8c0', '#a7d7d8'],
    dimPine: ['#173a43', '#24505b', '#2d6470', '#427781', '#538b95'],
    baubles: ['#d9edff', '#7ab8dc', '#cfdaff', '#a3bdda', '#f2ffff'],
    bulbs: ['#d4faff', '#8edbff', '#ffffff', '#abbfff', '#8ce9ee'],
    ribbon: '#c9eafa', sky: '#08151e', haze: 'rgba(94,157,222,.18)',
  },
  shush: {
    label: 'SHUSH glow',
    pine: ['#2c5963', '#416b76', '#5c8694', '#8597bd', '#a6b6ca'],
    dimPine: ['#1d344c', '#30435e', '#394f64', '#506780', '#687e99'],
    baubles: ['#d8baf6', '#b19dff', '#ffc3da', '#c7e5ff', '#e9cfac'],
    bulbs: ['#dcc5ff', '#b7abff', '#ffd9ef', '#c5f4f2', '#fff0c0'],
    ribbon: '#dbb8fa', sky: '#111120', haze: 'rgba(157,120,217,.2)',
  },
};

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
}

function makeScene() {
  const random = seeded(131224);
  const branches: FirBranch[] = [];
  const baubles: Bauble[] = [];
  const flakes: Snowflake[] = [];
  const stars: Star[] = [];

  for (let tier = 0; tier < 39; tier++) {
    const y = .075 + tier * .023;
    const count = 12 + (tier % 3) * 2;
    for (let arm = 0; arm < count; arm++) {
      branches.push({
        y: y + (random() - .5) * .013,
        angle: arm * (Math.PI * 2 / count) + tier * 1.79 + (random() - .5) * .2,
        length: (.94 - y * .9) * (.78 + random() * .3),
        drop: .014 + random() * .028,
        shade: Math.floor(random() * 5),
        frost: random() > .73,
      });
    }
  }

  for (let index = 0; index < 112; index++) {
    const y = .10 + random() * .78;
    baubles.push({
      y, angle: random() * Math.PI * 2,
      radius: (.98 - y * .92) * (1.01 + random() * .055),
      size: 2.5 + random() * 4,
      color: Math.floor(random() * 5),
      sway: random() * Math.PI * 2,
    });
  }

  for (let i = 0; i < 205; i++) flakes.push({
    x: random(), y: random(), depth: .25 + random() * .75,
    size: .35 + random() * 1.7, speed: .011 + random() * .033, phase: random() * 7,
  });
  for (let i = 0; i < 65; i++) stars.push({ x: random(), y: random() * .83, size: .4 + random(), phase: random() * Math.PI * 2 });
  return { branches, baubles, flakes, stars };
}

const scene = makeScene();

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, inner = .46) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const s = i % 2 ? r * inner : r;
    if (i === 0) ctx.moveTo(x + Math.cos(a) * s, y + Math.sin(a) * s);
    else ctx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s);
  }
  ctx.closePath();
}

function gift(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, bow: string, tilt: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  const h = size * .83;
  ctx.fillStyle = '#020a0e7a';
  ctx.beginPath(); ctx.ellipse(size * .09, size * .02, size * .75, size * .23, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  roundRect(ctx, -size / 2, -h, size, h, size * .075); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.beginPath(); ctx.moveTo(size / 2, -h); ctx.lineTo(size * .64, -h - size * .12); ctx.lineTo(size * .64, -size * .16); ctx.lineTo(size / 2, 0); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.13)';
  ctx.beginPath(); ctx.moveTo(-size / 2, -h); ctx.lineTo(-size * .37, -h - size * .13); ctx.lineTo(size * .64, -h - size * .12); ctx.lineTo(size / 2, -h); ctx.fill();
  ctx.fillStyle = bow;
  ctx.fillRect(-size * .085, -h, size * .17, h);
  ctx.fillRect(-size / 2, -h * .69, size, size * .13);
  ctx.strokeStyle = bow; ctx.lineWidth = Math.max(1, size * .055);
  ctx.beginPath(); ctx.ellipse(-size * .14, -h - size * .1, size * .14, size * .085, -.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(size * .14, -h - size * .1, size * .14, size * .085, .5, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function glossyBauble(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, gleam: number) {
  const gradient = ctx.createRadialGradient(x - radius * .38, y - radius * .45, radius * .1, x + radius * .15, y + radius * .18, radius * 1.45);
  gradient.addColorStop(0, '#fff6e9');
  gradient.addColorStop(.18, color);
  gradient.addColorStop(.67, color);
  gradient.addColorStop(1, '#1a1b24');
  ctx.fillStyle = gradient;
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#f4eddb7d'; ctx.lineWidth = .65;
  ctx.stroke();
  ctx.fillStyle = '#f5dda5';
  ctx.fillRect(x - radius * .22, y - radius - radius * .21, radius * .44, Math.max(.7, radius * .2));
  ctx.globalAlpha = .6 + .25 * gleam;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(x - radius * .3, y - radius * .33, Math.max(1, radius * .19), Math.max(.8, radius * .1), -.6, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

export function ChristmasTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ targetX: 0, targetY: 0, x: 0, y: 0 });
  const snowfall = useRef(0);
  const rotation = useRef({ dragging: false, lastX: 0, offset: 0 });
  const redraw = useRef<() => void>(() => {});
  const [theme, setTheme] = useState<Theme>('christmas');
  const [paused, setPaused] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !frame || !ctx) return;

    const palette = themes[theme];
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let motionReduced = media.matches;
    let visible = false;
    let width = 0;
    let height = 0;
    let frameId = 0;
    let time = 0;
    let previous = 0;

    const draw = (clock: number) => {
      if (!ctx || width < 1 || height < 1) return;
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width / 550, height / 635);
      const center = width * .5;
      const base = height * .84;
      const treeHeight = Math.min(height * .69, 442 * scale);
      const treeWidth = Math.min(width * .365, 194 * scale);
      const rot = .56 + clock * .115 + pointer.current.x * .42 + rotation.current.offset;
      const lean = pointer.current.y * 5 * scale;
      const sin = Math.sin, cos = Math.cos;
      const project = (radius: number, y: number, angle: number): Vec => {
        const c = cos(angle + rot), s = sin(angle + rot);
        const depth = s * radius;
        const perspective = 1 + depth * .16;
        return { x: center + c * radius * treeWidth * perspective, y: base - y * treeHeight + depth * 14 * scale + lean, z: depth };
      };

      // Deep sky with a restrained aurora and scattered distant stars.
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, palette.sky);
      sky.addColorStop(.66, '#17252a');
      sky.addColorStop(1, '#0b1720');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);
      const aura = ctx.createRadialGradient(center, height * .4, 0, center, height * .4, width * .7);
      aura.addColorStop(0, palette.haze);
      aura.addColorStop(1, '#00000000');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1 * scale;
      for (const s of scene.stars) {
        const twinkle = .35 + .24 * sin(clock * 1.4 + s.phase);
        ctx.fillStyle = 'rgba(238,247,240,' + twinkle.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(s.x * width, s.y * height, s.size * scale, 0, Math.PI * 2); ctx.fill();
      }

      const drawFlakes = (front: boolean) => {
        for (const flake of scene.flakes) {
          if ((flake.depth > .62) !== front) continue;
          const drift = sin(clock * .65 + flake.phase) * 13 * flake.depth * scale;
          const fall = ((flake.y + clock * flake.speed * (1 + snowfall.current * 2.6)) % 1) * height;
          const x = flake.x * width + drift;
          const size = flake.size * scale * (front ? 1.35 : .7);
          ctx.fillStyle = front ? '#f3fbffad' : '#d8eee68a';
          ctx.beginPath(); ctx.arc(x, fall, size, 0, Math.PI * 2); ctx.fill();
        }
      };
      drawFlakes(false);

      // Snow banks, ground haze and a luminous platform anchor the sculpture.
      ctx.fillStyle = '#c6e2d71b';
      ctx.beginPath(); ctx.ellipse(center, base + 20 * scale, 195 * scale, 39 * scale, 0, 0, Math.PI * 2); ctx.fill();
      for (let ring = 3; ring >= 0; ring--) {
        ctx.strokeStyle = ring % 2 ? '#dcbf8152' : '#b4d9cc47';
        ctx.lineWidth = (ring === 0 ? 2.4 : .85) * scale;
        ctx.beginPath(); ctx.ellipse(center, base + 10 * scale, (112 + ring * 29) * scale, (18 + ring * 5) * scale, 0, 0, Math.PI * 2); ctx.stroke();
      }
      // Tree trunk and tapered silhouette sit behind the full volume of needles.
      ctx.fillStyle = '#563b2c';
      roundRect(ctx, center - 12 * scale, base - 42 * scale, 24 * scale, 47 * scale, 4 * scale); ctx.fill();
      const silhouette = ctx.createLinearGradient(center - treeWidth, 0, center + treeWidth, 0);
      silhouette.addColorStop(0, palette.dimPine[0]);
      silhouette.addColorStop(.5, palette.dimPine[2]);
      silhouette.addColorStop(1, palette.dimPine[0]);
      ctx.fillStyle = silhouette;
      ctx.beginPath();
      ctx.moveTo(center, base - treeHeight * .99);
      ctx.bezierCurveTo(center - treeWidth * .12, base - treeHeight * .84, center - treeWidth * .69, base - treeHeight * .37, center - treeWidth * .89, base - treeHeight * .06);
      ctx.quadraticCurveTo(center, base + 2 * scale, center + treeWidth * .89, base - treeHeight * .06);
      ctx.bezierCurveTo(center + treeWidth * .7, base - treeHeight * .37, center + treeWidth * .12, base - treeHeight * .84, center, base - treeHeight * .99);
      ctx.fill();

      const prepared = scene.branches.map(branch => ({ branch, depth: sin(branch.angle + rot) * branch.length }));
      prepared.sort((a, b) => a.depth - b.depth);
      for (const { branch, depth } of prepared) {
        const angle = branch.angle;
        const start = project(.04, branch.y, angle);
        const tip = project(branch.length, branch.y - branch.drop, angle);
        const facing = depth > 0;
        const shade = branch.shade;
        const material = facing ? palette.pine : palette.dimPine;
        ctx.strokeStyle = material[shade];
        ctx.lineCap = 'round';
        ctx.lineWidth = (facing ? 2.3 : 1.7) * scale;
        ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.quadraticCurveTo(
          (start.x + tip.x) / 2, (start.y + tip.y) / 2 - 7 * scale, tip.x, tip.y
        ); ctx.stroke();

        // Fir fronds: each stem has real needle pairs and a soft frost edge.
        for (let k = 1; k < 17; k++) {
          const t = k / 18;
          const mid = project(branch.length * t, branch.y - branch.drop * t + .012 * sin(t * Math.PI), angle);
          const needleLength = branch.length * (.12 + .12 * (1 - t)) * (1 - t * .24);
          const lift = .014 + .018 * (1 - t);
          const l = project(branch.length * t + needleLength * .08, branch.y - branch.drop * t + lift, angle - .24 - .44 * (1 - t));
          const r = project(branch.length * t + needleLength * .08, branch.y - branch.drop * t + lift, angle + .24 + .44 * (1 - t));
          ctx.strokeStyle = material[(shade + k % 3) % 5];
          ctx.lineWidth = (facing ? 1.5 : 1.05) * scale;
          ctx.beginPath(); ctx.moveTo(mid.x, mid.y); ctx.lineTo(l.x, l.y);
          ctx.moveTo(mid.x, mid.y); ctx.lineTo(r.x, r.y); ctx.stroke();
        }
        if (branch.frost && facing && branch.y > .19) {
          ctx.strokeStyle = '#def5e6b8';
          ctx.lineWidth = .65 * scale;
          ctx.beginPath(); ctx.moveTo(start.x * .25 + tip.x * .75, start.y * .25 + tip.y * .75 - 1.8 * scale);
          ctx.lineTo(tip.x, tip.y - 1.7 * scale); ctx.stroke();
        }
      }

      // Two spiralling strands of fine wire with light points.
      for (let strand = 0; strand < 2; strand++) {
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          let started = false;
          for (let k = 0; k < 360; k++) {
            const t = k / 359;
            const y = .085 + t * .85;
            const angle = t * Math.PI * (strand === 0 ? 13.5 : 10.5) + strand * 2.3 + .5;
            const pos = project((.98 - y * .9) * 1.02, y, angle);
            const isFront = pos.z > (pass === 0 ? -.2 : .08);
            if (!isFront) { started = false; continue; }
            if (started) ctx.lineTo(pos.x, pos.y); else ctx.moveTo(pos.x, pos.y);
            started = true;
          }
          ctx.strokeStyle = strand === 0 ? palette.ribbon : '#e7ded0';
          ctx.lineWidth = (pass ? 1.7 : .8) * scale;
          ctx.globalAlpha = pass ? .94 : .35;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      if (lightsOn) {
        for (let strand = 0; strand < 2; strand++) {
          for (let k = 0; k < 76; k++) {
            const t = k / 76;
            const y = .085 + t * .85;
            const angle = t * Math.PI * (strand === 0 ? 13.5 : 10.5) + strand * 2.3 + .5;
            const pos = project((.98 - y * .9) * 1.04, y, angle);
            if (pos.z < -.15) continue;
            const col = palette.bulbs[(k * 7 + strand * 2) % palette.bulbs.length];
            const pulse = .77 + .23 * sin(clock * 2.2 + k * 2.1);
            const bulb = (1.5 + Math.max(0, pos.z) * 1.2) * scale;
            ctx.save();
            ctx.globalAlpha = pulse;
            ctx.fillStyle = col;
            ctx.shadowColor = col;
            ctx.shadowBlur = 13 * scale;
            ctx.beginPath(); ctx.arc(pos.x, pos.y, bulb, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          }
        }
      }

      // Polished ornaments with dimensional shading, not flat dots.
      const baubles = scene.baubles.map(bauble => ({
        bauble, point: project(bauble.radius, bauble.y, bauble.angle),
      })).sort((a, b) => a.point.z - b.point.z);
      for (const { bauble, point } of baubles) {
        if (point.z < -.2) continue;
        const radius = bauble.size * scale * (1 + point.z * .23);
        const colour = palette.baubles[bauble.color];
        ctx.strokeStyle = '#e7dfbf6b'; ctx.lineWidth = .7 * scale;
        ctx.beginPath(); ctx.moveTo(point.x, point.y - radius * 2.15); ctx.lineTo(point.x, point.y - radius); ctx.stroke();
        glossyBauble(ctx, point.x, point.y, radius, colour, sin(clock * 1.5 + bauble.sway));
      }

      const starY = base - treeHeight - 10 * scale + lean;
      if (lightsOn) {
        const radiance = ctx.createRadialGradient(center, starY, 2, center, starY, 65 * scale);
        radiance.addColorStop(0, '#fff3baad');
        radiance.addColorStop(.22, '#f8dfa043');
        radiance.addColorStop(1, '#ffe5ac00');
        ctx.fillStyle = radiance;
        ctx.beginPath(); ctx.arc(center, starY, 65 * scale, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = lightsOn ? '#fff3c1' : '#a6b8ae';
      ctx.shadowColor = '#f5d58f';
      ctx.shadowBlur = lightsOn ? 22 * scale : 0;
      drawStar(ctx, center, starY, 20 * scale, .43); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fffdf6'; ctx.lineWidth = .9 * scale; ctx.stroke();
      if (lightsOn) {
        ctx.strokeStyle = '#fff1bf9c';
        ctx.lineWidth = .9 * scale;
        ctx.beginPath();
        ctx.moveTo(center - 39 * scale, starY); ctx.lineTo(center + 39 * scale, starY);
        ctx.moveTo(center, starY - 38 * scale); ctx.lineTo(center, starY + 38 * scale); ctx.stroke();
      }

      // A tiny custom SHUSH pedestal and carefully staged presents.
      gift(ctx, center - 111 * scale, base + 12 * scale, 44 * scale, '#ad394a', '#e9c782', -.08);
      gift(ctx, center + 105 * scale, base + 14 * scale, 56 * scale, '#306d62', '#e7d39d', .055);
      gift(ctx, center + 42 * scale, base + 24 * scale, 34 * scale, '#705884', '#f4d9be', -.12);
      gift(ctx, center - 32 * scale, base + 26 * scale, 31 * scale, '#c29c64', '#f2d7d7', .1);
      ctx.fillStyle = '#102123f2';
      roundRect(ctx, center - 48 * scale, base + 21 * scale, 96 * scale, 25 * scale, 5 * scale); ctx.fill();
      ctx.strokeStyle = '#d8bd7f'; ctx.lineWidth = 1.1 * scale; ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8e5b7';
      ctx.font = '700 ' + Math.round(12 * scale) + 'px Manrope, sans-serif';
      ctx.fillText('S H U S H', center, base + 34 * scale);

      drawFlakes(true);
      // A few individual sparks dance close to the star.
      if (lightsOn) {
        for (let i = 0; i < 10; i++) {
          const angle = clock * (.25 + (i % 3) * .17) + i * 2.399;
          const radius = (21 + i * 7) * scale;
          const x = center + cos(angle) * radius;
          const y = starY + sin(angle * .73) * radius * .65;
          ctx.globalAlpha = .24 + .36 * Math.abs(sin(clock * 1.8 + i));
          ctx.fillStyle = i % 3 ? '#f5edcf' : palette.ribbon;
          ctx.fillRect(x, y, 1.6 * scale, 1.6 * scale);
        }
        ctx.globalAlpha = 1;
      }
    };

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width < 1 || height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(time);
    };
    const animate = (now: number) => {
      frameId = 0;
      if (!canAnimate()) return;
      frameId = requestAnimationFrame(animate);
      if (now - previous < 32) return;
      const dt = previous ? Math.min((now - previous) / 1000, .075) : 0;
      previous = now;
      time += dt;
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * .06;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * .06;
      snowfall.current *= .985;
      draw(time);
    };

    const canAnimate = () => !motionReduced && !paused && !document.hidden && visible;
    const syncAnimation = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
      previous = 0;
      if (canAnimate()) frameId = requestAnimationFrame(animate);
    };

    redraw.current = () => draw(time);
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .02;
      if (visible) draw(time);
      syncAnimation();
    }, { threshold: .02 });
    const onMotion = (event: MediaQueryListEvent) => {
      motionReduced = event.matches;
      draw(time);
      syncAnimation();
    };
    const onVisibility = () => {
      if (!document.hidden && visible) draw(time);
      syncAnimation();
    };
    ro.observe(frame); io.observe(frame);
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    syncAnimation();

    return () => {
      cancelAnimationFrame(frameId);
      redraw.current = () => {};
      ro.disconnect(); io.disconnect();
      media.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [theme, paused, lightsOn]);

  return (
    <div
      ref={frameRef}
      className="winter-tree-stage winter-tree-premium"
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current.targetX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
        pointer.current.targetY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
      }}
      onPointerLeave={() => { pointer.current.targetX = 0; pointer.current.targetY = 0; }}
    >
      <div className="winter-stage-top" aria-hidden="true">
        <span className="winter-stage-serial">NO. 01 / NORTH POLE EDITION</span>
        <span className="winter-status"><i /> SHUSH CHRISTMAS 2026</span>
      </div>
      <canvas
        ref={canvasRef}
        className="winter-tree-canvas"
        role="img"
        aria-label="Árvore de Natal tridimensional com ramos de pinheiro, bolas brilhantes, luzes, estrela e neve. Arrasta para a rodar ou usa as setas esquerda e direita."
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          rotation.current.dragging = true;
          rotation.current.lastX = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!rotation.current.dragging) return;
          rotation.current.offset += (event.clientX - rotation.current.lastX) * .007;
          rotation.current.lastX = event.clientX;
          redraw.current();
        }}
        onPointerUp={() => { rotation.current.dragging = false; }}
        onPointerCancel={() => { rotation.current.dragging = false; }}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          rotation.current.offset += event.key === 'ArrowRight' ? .23 : -.23;
          redraw.current();
        }}
      />
      <div className="winter-tree-title" aria-hidden="true">
        <span>WINTER WONDERLAND</span>
        <strong>Make a little magic.</strong>
      </div>
      <div className="winter-stage-bottom">
        <div className="winter-palette" role="group" aria-label="Cor das luzes da árvore">
          {(Object.keys(themes) as Theme[]).map((key) => (
            <button key={key} type="button" aria-pressed={theme === key} onClick={() => setTheme(key)}>
              {themes[key].label}
            </button>
          ))}
        </div>
        <div className="winter-tree-utilities">
          <button className="winter-motion-toggle" type="button" aria-pressed={!lightsOn} onClick={() => setLightsOn(value => !value)}>
            {lightsOn ? 'Luzes on' : 'Luzes off'} <span aria-hidden="true">✦</span>
          </button>
          <button className="winter-motion-toggle" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
            {paused ? 'Reproduzir' : 'Pausar'} <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          </button>
        </div>
      </div>
      <span className="winter-stage-caption" aria-hidden="true">✧ A LITTLE HOLIDAY MAGIC ✧</span>
    </div>
  );
}
