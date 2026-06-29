import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Shirt } from 'lucide-react';
import { motionPresets } from '../../lib/motion';
import { JerseyStitchOverlay, MotionRail, SnakeLine } from '../motion/MotionPrimitives';
import { JerseyCustomizer } from './JerseyCustomizer';

const jerseyViews = {
  front: {
    label: 'Frente',
    src: '/assets/jersey/frontjersey.webp',
    alt: 'Jersey SHUSH vista de frente',
  },
  back: {
    label: 'Verso',
    src: '/assets/jersey/backjersey.webp',
    alt: 'Jersey SHUSH vista de costas',
  },
} as const;

type JerseyView = keyof typeof jerseyViews;
type CopyStatus = 'idle' | 'copied' | 'failed';

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
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const reduceMotion = useReducedMotion();

  const message = useMemo(
    () =>
      [
        'Interesse SHUSH Jersey / Clothing',
        `Nome: ${name || 'SHUSH'}`,
        `Número: ${number || '00'}`,
        `Tamanho: ${size}`,
        phrase ? `Frase: ${phrase}` : 'Frase: sem frase personalizada',
        'Pedido manual.',
      ].join('\n'),
    [name, number, size, phrase],
  );

  const active = jerseyViews[view];

  const copyMessage = async () => {
    try {
      await writeClipboardText(message);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {
      setCopyStatus('failed');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  return (
    <section id="products" className="drop-section scroll-mt-24 px-5 pb-28 pt-36">
      <div id="jersey" className="mx-auto mb-10 max-w-7xl scroll-mt-28">
        <span className="section-kicker">Jersey / Clothing</span>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-normal text-shush-text md:text-5xl">A camisola da SHUSH.</h1>
        <MotionRail className="product-title-rail" />
        <p className="mt-5 max-w-xl text-sm leading-7 text-shush-muted">Produto manual, escuro e direto. Frente, verso, nick, número e tamanho.</p>
      </div>

      <div className="drop-shell">
        <div className="drop-product-stage">
          <SnakeLine className="product-snake" />
          <JerseyStitchOverlay />
          <span className="fabric-light-sweep" aria-hidden="true" />
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
              initial={reduceMotion ? false : motionPresets.jerseySwap.initial}
              animate={reduceMotion ? undefined : motionPresets.jerseySwap.animate}
              exit={reduceMotion ? undefined : motionPresets.jerseySwap.exit}
            />
          </AnimatePresence>
          <div className="drop-nameplate">
            <span>{name || 'SHUSH'}</span>
            <strong>{number || '00'}</strong>
            {phrase ? <small>{phrase}</small> : null}
          </div>
        </div>

        <aside id="customizacao" className="drop-control-panel scroll-mt-28">
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
            copyStatus={copyStatus}
            onNameChange={setName}
            onNumberChange={setNumber}
            onSizeChange={setSize}
            onPhraseChange={setPhrase}
            onCopy={copyMessage}
          />

          <div id="pedido-manual" className="drop-proof scroll-mt-28">
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
