import { ArrowIcon } from '../ui/ArrowIcon';
import { useEffect, useRef, useState } from 'react';

type Edition = 'evergreen' | 'midnight' | 'aurora';

const editions: Record<Edition, { label: string; background: string; secondary: string; highlight: string; green: string; glow: string }> = {
  evergreen: { label: 'Natal clássico', background: '#101f20', secondary: '#285347', highlight: '#efd3a0', green: '#386c53', glow: '#ffda9e' },
  midnight: { label: 'Noite de inverno', background: '#0b1825', secondary: '#24445e', highlight: '#c6e7fb', green: '#457a8e', glow: '#b2dfff' },
  aurora: { label: 'SHUSH glow', background: '#171324', secondary: '#3c2a61', highlight: '#ddc9fb', green: '#547e79', glow: '#e2b9ff' },
};

function drawCard(canvas: HTMLCanvasElement, edition: Edition, greeting: string, signature: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
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

  // Wrap user-supplied text without allowing text to run under the tree.
  ctx.font = '37px Arial, sans-serif';
  const words = (greeting.trim() || 'Que nunca faltem bons rounds.').split(/\s+/u);
  let line = '', yy = 503, printed = 0;
  for (const word of words) {
    const next = line ? line + ' ' + word : word;
    if (ctx.measureText(next).width > 650 && line) {
      ctx.fillText(line, 111, yy); yy += 55; printed++;
      line = word;
      if (printed >= 3) break;
    } else line = next;
  }
  if (line && printed < 4) ctx.fillText(line, 111, yy);

  ctx.fillStyle = highlight;
  ctx.fillRect(110, 725, 115, 3);
  ctx.font = '700 24px Arial, sans-serif';
  const safeSignature = signature.trim().slice(0, 25) || 'SHUSH COMMUNITY';
  ctx.fillText('DE ' + safeSignature.toLocaleUpperCase('pt-PT'), 110, 773);
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('SEM BARULHO. SÓ ROUNDS.', 110, 823);
}

export function WinterCardStudio() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [edition, setEdition] = useState<Edition>('evergreen');
  const [greeting, setGreeting] = useState('Que nunca faltem bons rounds.');
  const [signature, setSignature] = useState('SHUSH COMMUNITY');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (open && previewRef.current) drawCard(previewRef.current, edition, greeting, signature);
  }, [open, edition, greeting, signature]);

  const download = () => {
    const canvas = previewRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        setFeedback('Não foi possível criar a imagem. Experimenta novamente.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'shush-boas-festas-2026.png';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 3000);
      setFeedback('Postal criado. O descarregamento foi iniciado.');
    }, 'image/png');
  };

  return (
    <>
      <button ref={triggerRef} type="button" className="winter-card-trigger" onClick={() => { setFeedback(''); setOpen(true); }}>
        Criar o meu postal de Natal <span aria-hidden="true"><ArrowIcon /></span>
      </button>
      <dialog
        ref={dialogRef}
        className="winter-card-dialog"
        aria-labelledby="winter-card-dialog-title"
        onClose={() => { setOpen(false); triggerRef.current?.focus({ preventScroll: true }); }}
        onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}
      >
        <div className="winter-card-dialog-header">
          <div><span className="section-kicker">SHUSH / CHRISTMAS STUDIO</span><h2 id="winter-card-dialog-title">Um postal à tua maneira.</h2></div>
          <button type="button" className="winter-card-close" aria-label="Fechar editor de postal" onClick={() => dialogRef.current?.close()}>×</button>
        </div>
        <p className="winter-card-dialog-description">Escolhe um ambiente, escreve uma mensagem e descarrega um postal de Natal em alta resolução. Tudo é criado no teu dispositivo.</p>
        <div className="winter-card-layout">
          <div className="winter-card-preview">
            <canvas ref={previewRef} role="img" aria-label="Pré-visualização do postal de Natal personalizado" width="1600" height="900" />
            <span className="mono">1600 × 900 · PNG · SEM REGISTO</span>
          </div>
          <div className="winter-card-controls">
            <fieldset className="winter-card-editions">
              <legend>Ambiente</legend>
              {(Object.keys(editions) as Edition[]).map((key) => (
                <label key={key}>
                  <input type="radio" name="winter-card-edition" checked={edition === key} onChange={() => setEdition(key)} />
                  <span>{editions[key].label}</span>
                </label>
              ))}
            </fieldset>
            <label className="winter-card-field">Mensagem
              <textarea rows={3} maxLength={95} value={greeting} onChange={event => setGreeting(event.target.value)} />
              <small>{greeting.length}/95 caracteres</small>
            </label>
            <label className="winter-card-field">Assinatura
              <input type="text" maxLength={25} value={signature} onChange={event => setSignature(event.target.value)} />
            </label>
            <button className="site-button winter-card-download" type="button" onClick={download}>Descarregar postal PNG <span aria-hidden="true">↓</span></button>
            <p className="winter-card-feedback" role="status" aria-live="polite">{feedback}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
