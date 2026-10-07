
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
    <div className="audit-customizer">
      <div className="audit-customizer-head">
        <span className="section-kicker">Personalização</span>
        <h2>Faz a tua versão.</h2>
        <p>Preenche apenas o que queres personalizar. O pedido continua manual nesta fase.</p>
      </div>

      <div className="audit-customizer-grid">
        <label>
          <span>Nick</span>
          <input
            value={name}
            maxLength={14}
            autoComplete="off"
            onChange={(event) => onNameChange(event.target.value.slice(0, 14))}
            placeholder="SHUSH"
          />
          <small>{name.length}/14</small>
        </label>

        <label>
          <span>Número</span>
          <input
            value={number}
            inputMode="numeric"
            maxLength={2}
            onChange={(event) => onNumberChange(event.target.value.replace(/D/g, '').slice(0, 2))}
            placeholder="01"
          />
          <small>00–99</small>
        </label>

        <label>
          <span>Tamanho</span>
          <select value={size} onChange={(event) => onSizeChange(event.target.value)}>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <small>Escolha manual</small>
        </label>

        <label className="audit-customizer-wide">
          <span>Frase opcional</span>
          <input
            value={phrase}
            maxLength={44}
            onChange={(event) => onPhraseChange(event.target.value.slice(0, 44))}
            placeholder="Sem barulho. Só rounds."
          />
          <small>{phrase.length}/44</small>
        </label>
      </div>

      <div className="audit-order-preview">
        <span>Resumo do pedido</span>
        <pre>{message}</pre>
      </div>

      <button
        type="button"
        onClick={onCopy}
        className={`audit-copy-button ${copyStatus === 'failed' ? 'is-error' : ''}`}
        aria-live="polite"
      >
        <span aria-hidden="true">{copyStatus === 'copied' ? '✓' : '⧉'}</span>
        {copyStatus === 'copied' ? 'Pedido copiado' : copyStatus === 'failed' ? 'Seleciona o texto manualmente' : 'Copiar pedido'}
      </button>
    </div>
  );
}
