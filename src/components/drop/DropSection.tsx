import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Shirt } from 'lucide-react';
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

async function writeClipboardText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Copy command failed');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

export function DropSection() {
  const [view, setView] = useState<JerseyView>('front');
  const [name, setName] = useState('SHUSH');
  const [number, setNumber] = useState('01');
  const [size, setSize] = useState('M');
  const [phrase, setPhrase] = useState('');
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const message = useMemo(
    () =>
      [
        'Interesse SHUSH Drop 01',
        `Nome: ${name || 'SHUSH'}`,
        `Número: ${number || '00'}`,
        `Tamanho: ${size}`,
        phrase ? `Frase: ${phrase}` : 'Frase: sem frase personalizada',
        'Pedido manual. Sem checkout automático por agora.',
      ].join('\n'),
    [name, number, size, phrase],
  );

  const active = jerseyViews[view];

  const copyMessage = async () => {
    try {
      await writeClipboardText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="drop" className="drop-section scroll-mt-24 px-5 py-28">
      <div className="mx-auto mb-10 max-w-7xl">
        <span className="section-kicker">Drop 01</span>
        <h2 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-none tracking-normal text-shush-text md:text-7xl">
          A camisola da SHUSH.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-shush-muted">Escolhe nome, número e tamanho. O pedido é manual.</p>
      </div>

      <div className="drop-shell">
        <div className="drop-product-stage">
          <AnimatePresence mode="wait" initial={!reduceMotion}>
            <motion.img
              key={view}
              src={active.src}
              width="1280"
              height="1280"
              alt={active.alt}
              loading="lazy"
              decoding="async"
              className="drop-jersey-image"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, rotateY: view === 'front' ? -14 : 14 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotateY: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, rotateY: view === 'front' ? 12 : -12 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
          <div className="drop-nameplate">
            <span>{name || 'SHUSH'}</span>
            <strong>{number || '00'}</strong>
          </div>
        </div>

        <aside className="drop-control-panel">
          <div className="drop-toggle" role="group" aria-label="Alternar vista da camisola">
            {(Object.keys(jerseyViews) as JerseyView[]).map((key) => (
              <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)} className={view === key ? 'is-active' : ''}>
                {jerseyViews[key].label}
              </button>
            ))}
          </div>

          <JerseyCustomizer
            name={name}
            number={number}
            size={size}
            phrase={phrase}
            message={message}
            copied={copied}
            onNameChange={setName}
            onNumberChange={setNumber}
            onSizeChange={setSize}
            onPhraseChange={setPhrase}
            onCopy={copyMessage}
          />

          <div className="drop-proof">
            <div>
              <Shirt aria-hidden="true" className="h-5 w-5 text-shush-purpleGlow" />
              <span>Frente / verso</span>
            </div>
            <div>
              <ShieldCheck aria-hidden="true" className="h-5 w-5 text-shush-purpleGlow" />
              <span>Pedido manual</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
