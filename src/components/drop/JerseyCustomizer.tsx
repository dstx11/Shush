import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { motionPresets } from '../../lib/motion';

type JerseyCustomizerProps = {
  name: string;
  number: string;
  size: string;
  phrase: string;
  message: string;
  copyStatus: 'idle' | 'copied' | 'failed';
  onNameChange: (value: string) => void;
  onNumberChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onPhraseChange: (value: string) => void;
  onCopy: () => void;
};

export function JerseyCustomizer({
  name,
  number,
  size,
  phrase,
  message,
  copyStatus,
  onNameChange,
  onNumberChange,
  onSizeChange,
  onPhraseChange,
  onCopy,
}: JerseyCustomizerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="customizer">
      <span className="section-kicker">Personalização</span>
      <h3>Nome. Número. Tamanho.</h3>

      <motion.div className="customizer-grid" variants={reduceMotion ? undefined : motionPresets.staggerParent} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true }}>
        <motion.label variants={reduceMotion ? undefined : motionPresets.formField}>
          <span>Nome</span>
          <input value={name} onChange={(event) => onNameChange(event.target.value.slice(0, 14))} />
        </motion.label>
        <motion.label variants={reduceMotion ? undefined : motionPresets.formField}>
          <span>Número</span>
          <input value={number} onChange={(event) => onNumberChange(event.target.value.replace(/\D/g, '').slice(0, 2))} />
        </motion.label>
        <motion.label variants={reduceMotion ? undefined : motionPresets.formField}>
          <span>Tamanho</span>
          <select value={size} onChange={(event) => onSizeChange(event.target.value)}>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </motion.label>
      </motion.div>

      <motion.label className="customizer-wide" variants={reduceMotion ? undefined : motionPresets.formField} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true }}>
        <span>Frase opcional</span>
        <input value={phrase} onChange={(event) => onPhraseChange(event.target.value.slice(0, 44))} placeholder="Ex: Sem barulho" />
      </motion.label>

      <motion.pre key={message} aria-live="polite" variants={reduceMotion ? undefined : motionPresets.panelLayer} initial={reduceMotion ? false : 'hidden'} animate={reduceMotion ? undefined : 'visible'}>
        {message}
      </motion.pre>
      <motion.button
        type="button"
        onClick={onCopy}
        className={`copy-button ${copyStatus === 'failed' ? 'is-error' : ''}`}
        aria-live="polite"
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        animate={!reduceMotion && copyStatus === 'failed' ? motionPresets.errorShake.animate : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={copyStatus} variants={reduceMotion ? undefined : motionPresets.success} initial={reduceMotion ? false : 'initial'} animate={reduceMotion ? undefined : 'animate'} exit={reduceMotion ? undefined : 'exit'}>
            {copyStatus === 'copied' ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
            {copyStatus === 'copied' ? 'Copiado' : copyStatus === 'failed' ? 'Copia manualmente' : 'Copiar pedido'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
