import { editions, type Edition } from '../data/postcard';
import { graphemes } from './text';

function drawScene(canvas: HTMLCanvasElement, edition: Edition) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível.');
  const { background, secondary, highlight, green, glow } = editions[edition];
  const w = 1600, h = 900;
  canvas.width = w;
  canvas.height = h;
  const backgroundGradient = ctx.createLinearGradient(0, 0, w, h);
  backgroundGradient.addColorStop(0, background);
  backgroundGradient.addColorStop(.67, secondary);
  backgroundGradient.addColorStop(1, background);
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, w, h);

  const halo = ctx.createRadialGradient(1150, 470, 20, 1150, 470, 620);
  halo.addColorStop(0, glow + '48');
  halo.addColorStop(1, glow + '00');
  ctx.fillStyle = halo;
  ctx.fillRect(650, 0, 950, h);

  // Deterministic winter sky. No assets, external fonts or uploads required.
  let seed = 90412;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 250; i++) {
    const x = random() * w, y = random() * h, r = .8 + random() * 2;
    ctx.globalAlpha = .16 + random() * .5;
    ctx.fillStyle = '#fffaf0';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Large, layered evergreen tree with needles and warm spiral lighting.
  const center = 1220, floor = 770, top = 170, halfWidth = 330;
  for (let layer = 35; layer >= 0; layer--) {
    const t = layer / 35;
    const y = top + t * (floor - top);
    const radius = 22 + t * halfWidth;
    const branches = 12 + Math.floor(t * 17);
    for (let branch = 0; branch < branches; branch++) {
      const a = branch * (2 * Math.PI / branches) + layer * 1.93;
      const depth = Math.sin(a);
      const tipX = center + Math.cos(a) * radius;
      const tipY = y + depth * 13;
      ctx.strokeStyle = depth > 0 ? green : '#183b35';
      ctx.lineWidth = 3 + t * 2;
      ctx.beginPath(); ctx.moveTo(center, y - 13); ctx.quadraticCurveTo(center + (tipX - center) * .53, y - 22, tipX, tipY); ctx.stroke();
      for (let k = 2; k < 11; k++) {
        const f = k / 12;
        const x = center + (tipX - center) * f;
        const yy = y + (tipY - y) * f - 11 * (1 - f);
        const needle = 9 + t * 10;
        ctx.strokeStyle = depth > 0 ? (k % 3 ? '#73a58b' : '#94bda0') : '#234b45';
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x - needle / 2, yy - needle); ctx.lineTo(x, yy); ctx.lineTo(x + needle / 2, yy - needle); ctx.stroke();
      }
    }
  }
  for (let i = 0; i < 140; i++) {
    const t = i / 140, y = 220 + t * 510;
    const a = t * Math.PI * 13;
    const radius = (1 - t) * 295;
    const x = center + Math.cos(a) * radius;
    const depth = Math.sin(a);
    if (depth < -.18) continue;
    ctx.shadowColor = glow;
    ctx.shadowBlur = 24;
    ctx.fillStyle = i % 5 === 0 ? '#f7c26f' : highlight;
    ctx.beginPath(); ctx.arc(x, y + depth * 17, 3.7 + 2 * Math.max(0, depth), 0, 2 * Math.PI); ctx.fill();
    ctx.shadowBlur = 0;
  }
  for (let i = 0; i < 55; i++) {
    const t = .1 + random() * .83, y = top + t * (floor - top);
    const a = random() * Math.PI * 2;
    if (Math.sin(a) < -.2) continue;
    const x = center + Math.cos(a) * (35 + t * 310);
    const radius = 4 + random() * 8;
    const fill = ctx.createRadialGradient(x - 2, y - 3, 1, x, y, radius);
    fill.addColorStop(0, '#fff7df');
    fill.addColorStop(.35, i % 3 ? '#c64b61' : '#dfc18b');
    fill.addColorStop(1, '#5d2634');
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.fillStyle = highlight;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 45;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const r = i % 2 ? 15 : 38;
    if (i === 0) ctx.moveTo(center + Math.cos(a) * r, top - 7 + Math.sin(a) * r);
    else ctx.lineTo(center + Math.cos(a) * r, top - 7 + Math.sin(a) * r);
  }
  ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;

  // A restrained editorial layout, suitable for sharing without a watermark.
  ctx.strokeStyle = highlight + '80';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, w - 104, h - 104);
  ctx.fillStyle = highlight;
  ctx.font = '700 25px Arial, sans-serif';
  ctx.fillText('S H U S H    /    S I L E N T   N I G H T', 110, 137);
  ctx.font = '700 105px Arial, sans-serif';
  ctx.fillStyle = '#f9f5ec';
  ctx.fillText('BOAS', 105, 310);
  ctx.fillText('FESTAS.', 105, 414);

  ctx.fillStyle = highlight;
  ctx.fillRect(110, 725, 115, 3);
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('SEM BARULHO. SÓ ROUNDS.', 110, 823);
}

/** One static scene per open editor; changing text never rebuilds the tree. */
export function createCardRenderer() {
  let scene: HTMLCanvasElement | undefined;
  let sceneEdition: Edition | undefined;
  return {
    draw(canvas: HTMLCanvasElement, edition: Edition, greeting: string, signature: string) {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas indisponível.');
      if (!scene || sceneEdition !== edition) {
        scene ??= document.createElement('canvas');
        drawScene(scene, edition);
        sceneEdition = edition;
      }
      if (canvas.width !== 1600) canvas.width = 1600;
      if (canvas.height !== 900) canvas.height = 900;
      ctx.drawImage(scene, 0, 0);
      ctx.fillStyle = '#f9f5ec';
      // Fit complete messages, including long words, inside the editorial column.
      const message = greeting.trim() || 'Que nunca faltem bons rounds.';
      let lines: string[] = [];
      for (let size = 37; size >= 16; size--) {
        ctx.font = `${size}px Arial, sans-serif`;
        lines = wrapCardText(message, value => ctx.measureText(value).width, 650);
        if (lines.length <= 4) break;
      }
      if (lines.length > 4) { const error = new Error('Text exceeds the postcard column'); error.name = 'PostcardTextOverflow'; throw error; }
      lines.forEach((line, index) => ctx.fillText(line, 111, 503 + index * 55));

          ctx.fillStyle = editions[edition].highlight;
      ctx.font = '700 24px Arial, sans-serif';
      const safeSignature = graphemes(signature.trim()).slice(0, 25).join('') || 'SHUSH COMMUNITY';
      ctx.fillText('DE ' + safeSignature.toLocaleUpperCase('pt-PT'), 110, 773, 650);
    },
    dispose() {
      if (scene) { scene.width = 0; scene.height = 0; }
      scene = undefined;
      sceneEdition = undefined;
    },
  };
}
export type CardRenderer = ReturnType<typeof createCardRenderer>;

export function wrapCardText(text: string, measure: (value: string) => number, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.trim().split(/\s+/u)) {
    if (line && measure(`${line} ${word}`) > width) { lines.push(line); line = ''; }
    if (measure(word) <= width) { line = line ? `${line} ${word}` : word; continue; }
    for (const cluster of graphemes(word)) {
      if (line && measure(line + cluster) > width) { lines.push(line); line = ''; }
      line += cluster;
    }
  }
  if (line) lines.push(line);
  return lines;
}

