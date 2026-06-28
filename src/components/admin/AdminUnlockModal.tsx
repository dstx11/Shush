import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const unlockSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

export function AdminUnlockModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [message, setMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setMessage('');
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const expected = unlockSequence[sequenceIndex];
      const nextIndex = event.key === expected ? sequenceIndex + 1 : event.key === unlockSequence[0] ? 1 : 0;

      if (nextIndex === unlockSequence.length) {
        setIsOpen(true);
        setSequenceIndex(0);
        return;
      }

      setSequenceIndex(nextIndex);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, sequenceIndex]);

  useEffect(() => {
    if (!isOpen) return;

    usernameRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !modalRef.current?.contains(event.target)) close();
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Admin real fica para fase futura. Este shell nao autentica nem guarda dados.');
  };

  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="admin-modal-backdrop" aria-hidden={false}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        aria-describedby="admin-modal-description"
        className="admin-modal"
        onKeyDown={trapFocus}
      >
        <button type="button" className="admin-modal-close" aria-label="Fechar admin mock" onClick={close}>
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        <span className="section-kicker">Admin shell</span>
        <h2 id="admin-modal-title">Acesso visual oculto.</h2>
        <p id="admin-modal-description">Sem autenticacao real nesta fase. Sem password guardada. Sem localStorage.</p>

        <form className="admin-form" onSubmit={submit}>
          <label>
            <span>Username</span>
            <input ref={usernameRef} name="username" autoComplete="username" />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" />
          </label>
          <button type="submit">Entrar mock</button>
        </form>
        {message ? <p className="admin-message" aria-live="polite">{message}</p> : null}
      </div>
    </div>
  );
}
