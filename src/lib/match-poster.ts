import type { VerifiedMatch } from '../data/verified-matches';
import { formatDate } from './premier';

export async function drawMatchPoster(canvas: HTMLCanvasElement, match: VerifiedMatch, height: 1080 | 1350) {
  // Font load failures use the same system fallback in the preview and PNG.
  await Promise.allSettled([document.fonts.load('800 160px Manrope'), document.fonts.load('600 32px "IBM Plex Mono"')]);
  const logo = new Image();
  logo.src = '/assets/brand/shush-logo.webp';
  await logo.decode();
  canvas.width = 1080; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível.');
  ctx.fillStyle = '#15131a'; ctx.fillRect(0, 0, 1080, height);
  ctx.fillStyle = '#302639';
  ctx.beginPath(); ctx.moveTo(690, 0); ctx.lineTo(1080, 0); ctx.lineTo(1080, height); ctx.lineTo(240, height); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#6c587f'; ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(780 + i * 55, 0); ctx.lineTo(330 + i * 55, height); ctx.stroke(); }
  ctx.drawImage(logo, 72, 65, 176, 98);
  const text = (value: string, x: number, y: number, size: number, color = '#f3eef4', width = 936, mono = false) => {
    ctx.fillStyle = color;
    do { ctx.font = `${mono ? 600 : 800} ${size}px ${mono ? '"IBM Plex Mono"' : 'Manrope'}, sans-serif`; size--; } while (ctx.measureText(value).width > width && size > 12);
    ctx.fillText(value, x, y);
  };
  text('PREMIER / MATCH RECORD', 72, 218, 24, '#c4afe9', 936, true);
  const shift = (height - 1080) / 2;
  text('SHUSH', 64, 405 + shift, 162);
  text(`VS  ${match.opponent}`, 72, 490 + shift, 56, '#c4afe9');
  text(`${match.shushScore} : ${match.opponentScore}`, 60, 740 + shift, 210);
  text(match.shushScore > match.opponentScore ? 'VITÓRIA' : 'DERROTA', 76, 806 + shift, 25, '#c4afe9', 936, true);
  ctx.fillStyle = '#c4afe9'; ctx.fillRect(72, height - 175, 936, 2);
  text(match.map.toUpperCase(), 72, height - 114, 32);
  text(formatDate(match.date), 72, height - 65, 24, '#c4afe9', 936, true);
  text('SHUSH.PT', 790, height - 65, 24, '#c4afe9', 220, true);
}
