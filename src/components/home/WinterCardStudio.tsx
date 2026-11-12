import { ArrowIcon } from '../ui/ArrowIcon';
import { useEffect, useRef, useState } from 'react';
import { graphemes, sanitizeText } from '../../lib/text';
import { editions, type Edition } from '../../data/postcard';
import type { CardRenderer } from '../../lib/postcard-renderer';
import { within } from '../../lib/resource';
import { downloadBlob } from '../../lib/browser-transfer';
import { useModalDialog } from '../../hooks/useModalDialog';

export function WinterCardStudio() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [edition, setEdition] = useState<Edition>('evergreen');
  const [greeting, setGreeting] = useState('Que nunca faltem bons rounds.');
  const [signature, setSignature] = useState('SHUSH COMMUNITY');
  const [feedback, setFeedback] = useState('');
  const [previewMessage, setPreviewMessage] = useState('Não foi possível desenhar o postal.');
  const [previewState, setPreviewState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [rendererVersion, setRendererVersion] = useState(0);
  const renderer = useRef<CardRenderer | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [exporting, setExporting] = useState(false);
  const generation = useRef(0);
  const exportingRef = useRef(false);

  useModalDialog(dialogRef, open);
  useEffect(() => {
    if (!open) return;
    let active = true;
    setPreviewState('loading');
    within(import('../../lib/postcard-renderer'), 8000).then(module => {
      if (!active) return;
      renderer.current = module.createCardRenderer();
      setRendererVersion(value => value + 1);
    }).catch(() => { if (active) { setPreviewMessage('Não foi possível desenhar o postal.'); setPreviewState('error'); } });
    return () => {
      active = false;
      generation.current++;
      renderer.current?.dispose();
      renderer.current = null;
      if (previewRef.current) { previewRef.current.width = 0; previewRef.current.height = 0; }
    };
  }, [open, attempt]);

  useEffect(() => {
    if (!open || !previewRef.current || !renderer.current) return;
    generation.current++;
    exportingRef.current = false;
    setExporting(false);
    setFeedback('');
    setPreviewState('loading');
    const frame = requestAnimationFrame(() => {
      try {
        renderer.current?.draw(previewRef.current!, edition, greeting, signature);
        setPreviewState('ready');
      } catch (error) {
        setPreviewMessage(error instanceof Error && error.name === 'PostcardTextOverflow' ? 'A mensagem é demasiado extensa para o postal. Encurta-a para continuar.' : 'Não foi possível desenhar o postal.');
        setPreviewState('error');
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [open, edition, greeting, signature, rendererVersion]);

  const invalidatePreview = () => { generation.current++; };

  const download = () => {
    const canvas = previewRef.current;
    if (!canvas || exportingRef.current || previewState !== 'ready') return;
    const id = generation.current;
    exportingRef.current = true;
    setExporting(true);
    setFeedback('A preparar o teu postal…');
    const fail = () => {
      if (id !== generation.current || !dialogRef.current?.open) return;
      exportingRef.current = false;
      setExporting(false);
      setFeedback('Não foi possível criar a imagem. Experimenta novamente.');
    };
    try {
      canvas.toBlob((blob) => {
        if (id !== generation.current || !dialogRef.current?.open) return;
        if (!blob) { fail(); return; }
        try { downloadBlob(blob, 'shush-boas-festas-2026.png'); }
        catch { fail(); return; }
        exportingRef.current = false;
        setExporting(false);
        setFeedback('Postal criado. O descarregamento foi iniciado.');
      }, 'image/png');
    } catch { fail(); }
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
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
        }}
      >
        <div className="winter-card-dialog-header">
          <div><span className="section-kicker">SHUSH / CHRISTMAS STUDIO</span><h2 id="winter-card-dialog-title">Um postal à tua maneira.</h2></div>
          <button type="button" className="winter-card-close" aria-label="Fechar editor de postal" onClick={() => dialogRef.current?.close()}>×</button>
        </div>
        <p className="winter-card-dialog-description">Escolhe um ambiente, escreve uma mensagem e descarrega um postal de Natal em alta resolução. Tudo é criado no teu dispositivo.</p>
        <div className="winter-card-layout">
          <div className="winter-card-preview" aria-busy={exporting || previewState === 'loading'}>
            <canvas ref={previewRef} role="img" aria-label={`Pré-visualização do postal de Natal: ${greeting.trim() || 'Que nunca faltem bons rounds.'} De ${signature.trim() || 'SHUSH COMMUNITY'}.`} width="1600" height="900" />
            {previewState === 'loading' && <p className="winter-card-loading" role="status">A preparar a pré-visualização…</p>}
            {previewState === 'error' && <div className="winter-card-recovery"><p role="alert">{previewMessage}</p><button type="button" className="utility-button" onClick={() => setAttempt(value => value + 1)}>Tentar novamente</button></div>}
            <span className="mono">1600 × 900 · PNG · SEM REGISTO</span>
          </div>
          <div className="winter-card-controls">
            <fieldset className="winter-card-editions">
              <legend>Ambiente</legend>
              {(Object.keys(editions) as Edition[]).map((key) => (
                <label key={key}>
                  <input type="radio" name="winter-card-edition" checked={edition === key} onChange={() => { invalidatePreview(); setEdition(key); }} />
                  <span>{editions[key].label}</span>
                </label>
              ))}
            </fieldset>
            <div className="winter-card-field">
              <label htmlFor="winter-card-greeting">Mensagem</label>
              <textarea id="winter-card-greeting" aria-describedby="winter-card-count" rows={3} maxLength={1520} value={greeting} onChange={event => { invalidatePreview(); setGreeting(sanitizeText(event.target.value, 95)); }} />
              <small id="winter-card-count">{graphemes(greeting).length}/95 caracteres</small>
            </div>
            <label className="winter-card-field">Assinatura
              <input type="text" maxLength={400} value={signature} onChange={event => { invalidatePreview(); setSignature(sanitizeText(event.target.value, 25)); }} />
            </label>
            <button className="site-button winter-card-download" type="button" disabled={exporting || previewState !== 'ready'} onClick={download}>{exporting ? 'A preparar PNG…' : 'Descarregar postal PNG'} <span aria-hidden="true">↓</span></button>
            <p className="winter-card-feedback" role="status" aria-live="polite">{feedback}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
