import { useEffect, useRef, useState } from 'react';
import type { VerifiedMatch } from '../../data/verified-matches';
import type { CardSubject } from './CanvasStudio';
import '../../styles/card-studio.css';

type Subject = CardSubject | { kind: 'match'; match: VerifiedMatch };
type StudioModule = typeof import('./CanvasStudio');
const labels = {
  match: 'Criar cartaz',
  jersey: 'Criar cartão da camisola',
  player: 'Criar cartão do jogador',
};

export function StudioAction(subject: Subject) {
  const [studio, setStudio] = useState<StudioModule | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const button = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function launch() {
    if (status === 'loading') return;
    button.current?.focus({ preventScroll: true });
    setStatus('loading');
    try {
      const module = await import('./CanvasStudio');
      if (!mounted.current) return;
      // The visitor may have opened a different match or started typing
      // while the optional editor was downloading.
      if (document.activeElement === button.current) setStudio(module);
      setStatus('idle');
    } catch {
      if (mounted.current) setStatus('error');
    }
  }

  const close = () => setStudio(null);
  return <div className="share-card-action">
    <button ref={button} type="button" className="utility-button" aria-haspopup="dialog"
      aria-busy={status === 'loading'} aria-disabled={status === 'loading'} onClick={launch}>
      {status === 'loading' ? 'A abrir estúdio…' : labels[subject.kind]} <span aria-hidden="true">↗</span>
    </button>
    {status === 'error' && <p className="action-feedback" role="alert">Não foi possível abrir o estúdio. Tenta novamente.</p>}
    {studio && (subject.kind === 'match'
      ? <studio.MatchPoster match={subject.match} onClose={close} />
      : <studio.CardStudio {...subject} onClose={close} />)}
  </div>;
}
