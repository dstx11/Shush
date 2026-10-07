import { useMemo, useState } from 'react';
import { JerseyCustomizer } from './JerseyCustomizer';

const jerseyViews = {
  front: {
    label: 'Frente',
    src: '/assets/jersey/frontjersey.webp',
    alt: 'Jersey SHUSH Drop 01 vista de frente',
  },
  back: {
    label: 'Verso',
    src: '/assets/jersey/backjersey.webp',
    alt: 'Jersey SHUSH Drop 01 vista de costas',
  },
} as const;

type JerseyView = keyof typeof jerseyViews;
type CopyStatus = 'idle' | 'copied' | 'failed';

async function writeClipboardText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
  await navigator.clipboard.writeText(text);
}

export function DropSection() {
  const [view, setView] = useState<JerseyView>('front');
  const [name, setName] = useState('SHUSH');
  const [number, setNumber] = useState('01');
  const [size, setSize] = useState('M');
  const [phrase, setPhrase] = useState('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const message = useMemo(
    () => [
      'SHUSH — Drop 01',
      `Nick: ${name || 'SHUSH'}`,
      `Número: ${number || '00'}`,
      `Tamanho: ${size}`,
      phrase ? `Frase: ${phrase}` : 'Frase: —',
      'Pedido manual.',
    ].join('\n'),
    [name, number, size, phrase],
  );

  const copyMessage = async () => {
    try {
      await writeClipboardText(message);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }

    window.setTimeout(() => setCopyStatus('idle'), 1800);
  };

  const activeView = jerseyViews[view];

  return (
    <section id="products" className="audit-drop-page px-5 pb-28 pt-36" aria-labelledby="drop-title">
      <div className="audit-page-shell">
        <div className="audit-drop-head">
          <div>
            <span className="section-kicker">Drop 01 / Jersey</span>
            <h1 id="drop-title">A camisola da SHUSH.</h1>
          </div>
          <p>Primeiro drop público da SHUSH. Preto, roxo e personalização de nick, número, tamanho e frase.</p>
        </div>

        <div className="audit-drop-layout">
          <div className="audit-drop-gallery">
            <div className="audit-drop-meta">
              <span>DROP 01</span>
              <small>{activeView.label}</small>
            </div>

            <div className="audit-drop-image">
              <img
                key={view}
                src={activeView.src}
                width="1280"
                height="1280"
                alt={activeView.alt}
                fetchPriority="high"
                decoding="async"
              />

              {view === 'back' ? (
                <div className="audit-live-print" aria-label={`Pré-visualização: ${name || 'SHUSH'} ${number || '00'}`}>
                  <span>{name || 'SHUSH'}</span>
                  <strong>{number || '00'}</strong>
                  {phrase ? <small>{phrase}</small> : null}
                </div>
              ) : null}
            </div>

            <div className="audit-drop-switcher" role="group" aria-label="Vista da jersey">
              {(Object.keys(jerseyViews) as JerseyView[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={view === key}
                  onClick={() => setView(key)}
                >
                  <span>{key === 'front' ? '01' : '02'}</span>
                  {jerseyViews[key].label}
                </button>
              ))}
            </div>

            <div className="audit-drop-facts">
              <span>Frente + verso</span>
              <span>Pedido manual</span>
              <span>Nick + número + tamanho</span>
            </div>
          </div>

          <aside id="customizacao" className="audit-drop-config scroll-mt-28">
            <JerseyCustomizer
              name={name}
              number={number}
              size={size}
              phrase={phrase}
              message={message}
              copyStatus={copyStatus}
              onNameChange={setName}
              onNumberChange={setNumber}
              onSizeChange={setSize}
              onPhraseChange={setPhrase}
              onCopy={copyMessage}
            />

            <p className="audit-order-note">
              A cópia prepara o texto do pedido. O site não cobra nem confirma encomendas automaticamente.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
