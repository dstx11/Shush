import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

type View = 'front' | 'back';

export function JerseyLightbox({ view, onViewChange, onClose, children }: {
  view: View;
  onViewChange: (view: View) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const element = dialog.current!;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (element) element.scrollTo({ left: Math.max(0, (element.scrollWidth - element.clientWidth) / 2), top: 0, behavior: 'instant' });
  }, [zoomed, view]);

  return <dialog ref={dialog} className="jersey-lightbox" aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}
    onKeyDown={(event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        // The image region keeps the arrow keys for panning when enlarged.
        if (zoomed && event.target === stage.current) return;
        event.preventDefault();
        onViewChange(event.key === 'ArrowLeft' ? 'front' : 'back');
      }
    }}>
    <div className="jersey-lightbox-heading"><div><span className="mono">SHUSH / Drop 01</span><h2 id={titleId}>A camisola, ao detalhe.</h2></div><button type="button" className="utility-button" onClick={onClose} autoFocus aria-label="Fechar ampliação">Fechar <span aria-hidden="true">×</span></button></div>
    <div ref={stage} className={`jersey-lightbox-stage${zoomed ? ' is-zoomed' : ''}`} tabIndex={0} role="region" aria-label={zoomed ? 'Imagem ampliada. Desloca para ver os detalhes.' : 'Imagem completa da camisola'}>
      <div className="jersey-lightbox-art">{children}</div>
    </div>
    <div className="jersey-lightbox-footer">
      <div className="view-control" role="group" aria-label="Vista ampliada da jersey"><button type="button" aria-pressed={view === 'front'} onClick={() => onViewChange('front')}>Frente</button><button type="button" aria-pressed={view === 'back'} onClick={() => onViewChange('back')}>Verso</button></div>
      <button className="utility-button" type="button" aria-pressed={zoomed} onClick={() => setZoomed((value) => !value)}>{zoomed ? 'Ver camisola inteira' : 'Ver detalhes'} <span aria-hidden="true">{zoomed ? '−' : '+'}</span></button>
      <p>{zoomed ? 'Desloca a imagem para explorar os detalhes.' : 'Frente e verso da camisola SHUSH.'}</p>
    </div>
  </dialog>;
}
