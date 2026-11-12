import { useEffect, useRef, useState } from 'react';
import { useModalDialog } from '../../hooks/useModalDialog';
import { downloadBlob } from '../../lib/browser-transfer';
import type { VerifiedMatch } from '../../data/verified-matches';
import { drawMatchPoster } from '../../lib/match-poster';

export function MatchPoster({ match, onClose }: { match: VerifiedMatch; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [height, setHeight] = useState<1080 | 1350>(1080);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [exporting, setExporting] = useState(false);
  const exportingRef = useRef(false);
  const generation = useRef(0);
  useModalDialog(dialog);

  useEffect(() => {
    const id = ++generation.current;
    setReady(false); setError(''); setExporting(false); exportingRef.current = false;
    // Draw off-screen: rapid format changes cannot overwrite a newer preview.
    const stage = document.createElement('canvas');
    drawMatchPoster(stage, match, height).then(() => {
      if (id !== generation.current || !canvas.current) return;
      canvas.current.width = stage.width; canvas.current.height = stage.height;
      canvas.current.getContext('2d')!.drawImage(stage, 0, 0); setReady(true);
    }).catch(() => { if (id === generation.current) setError('Não foi possível preparar o cartaz. Tenta novamente.'); });
    return () => { generation.current++; };
  }, [match, height, attempt]);
  const download = () => {
    if (!ready || exportingRef.current) return;
    const id = generation.current;
    exportingRef.current = true; setExporting(true); setError('');
    const fail = () => {
      if (id !== generation.current) return;
      exportingRef.current = false; setExporting(false); setError('Não foi possível exportar o PNG. Tenta novamente.');
    };
    try {
      canvas.current?.toBlob(blob => {
        if (id !== generation.current) return;
        if (!blob) { fail(); return; }
        try { downloadBlob(blob, `shush-${match.id}-1080x${height}.png`); }
        catch { fail(); return; }
        exportingRef.current = false; setExporting(false);
      }, 'image/png');
    } catch { fail(); }
  };
  return <dialog ref={dialog} className="match-poster-dialog" aria-labelledby="poster-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="poster-heading"><h2 id="poster-title">Cartaz da partida</h2><button type="button" className="utility-button" autoFocus onClick={onClose}>Fechar ×</button></div>
    <div className="poster-layout"><div className="poster-preview" aria-busy={!ready && !error}><canvas ref={canvas} aria-label={`SHUSH ${match.shushScore} – ${match.opponentScore} ${match.opponent}, ${match.map}, ${match.date}`} hidden={!ready} />{!ready && !error && <p role="status">A preparar cartaz…</p>}{error && <p role="alert">{error}</p>}</div>
    <div className="poster-options"><p>{match.opponent} / {match.map}</p><div className="view-control" role="group" aria-label="Formato do cartaz"><button type="button" aria-pressed={height === 1080} onClick={() => { if (height !== 1080) { setReady(false); setHeight(1080); } }}>Quadrado</button><button type="button" aria-pressed={height === 1350} onClick={() => { if (height !== 1350) { setReady(false); setHeight(1350); } }}>Vertical</button></div><span className="mono">1080 × {height} px · PNG</span><button type="button" className="site-button" disabled={!ready || exporting} aria-busy={exporting} onClick={download}>{exporting ? 'A preparar PNG…' : 'Descarregar PNG ↓'}</button>{error && <button type="button" className="utility-button" onClick={() => setAttempt(value => value + 1)}>Tentar novamente</button>}</div></div>
  </dialog>;
}
