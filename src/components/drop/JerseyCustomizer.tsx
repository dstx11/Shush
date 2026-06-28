import { Check, Copy } from 'lucide-react';

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
  return (
    <div className="customizer">
      <span className="section-kicker">Personalização</span>
      <h3>Nome. Número. Tamanho.</h3>

      <div className="customizer-grid">
        <label>
          <span>Nome</span>
          <input value={name} onChange={(event) => onNameChange(event.target.value.slice(0, 14))} />
        </label>
        <label>
          <span>Número</span>
          <input value={number} onChange={(event) => onNumberChange(event.target.value.replace(/\D/g, '').slice(0, 2))} />
        </label>
        <label>
          <span>Tamanho</span>
          <select value={size} onChange={(event) => onSizeChange(event.target.value)}>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="customizer-wide">
        <span>Frase opcional</span>
        <input value={phrase} onChange={(event) => onPhraseChange(event.target.value.slice(0, 44))} placeholder="Ex: Sem barulho" />
      </label>

      <pre aria-live="polite">{message}</pre>
      <button type="button" onClick={onCopy} className="copy-button" aria-live="polite">
        {copyStatus === 'copied' ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
        {copyStatus === 'copied' ? 'Copiado' : copyStatus === 'failed' ? 'Copiar falhou' : 'Copiar pedido'}
      </button>
    </div>
  );
}
