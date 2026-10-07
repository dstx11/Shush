
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
        <p>O teu nick e número aparecem no verso. Prepara o texto para um pedido manual.</p>
      </div>

      <div className="audit-customizer-grid">
        <label>
          <span id="drop-nick-label">Nick</span>
          <input
            aria-labelledby="drop-nick-label"
            aria-describedby="drop-nick-hint"
            value={name}
            maxLength={14}
            autoComplete="off"
            onChange={(event) => onNameChange(event.target.value.slice(0, 14))}
            placeholder="SHUSH"
          />
          <small id="drop-nick-hint">{name.length}/14</small>
        </label>

        <label>
          <span id="drop-number-label">Número</span>
          <input
            aria-labelledby="drop-number-label"
            aria-describedby="drop-number-hint"
            value={number}
            inputMode="numeric"
            maxLength={2}
            onChange={(event) => onNumberChange(event.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="01"
          />
          <small id="drop-number-hint">00–99</small>
        </label>

        <label>
          <span id="drop-size-label">Tamanho</span>
          <select aria-labelledby="drop-size-label" aria-describedby="drop-size-hint" value={size} onChange={(event) => onSizeChange(event.target.value)}>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((option) => <option key={option}>{option}</option>)}
          </select>
          <small id="drop-size-hint">A confirmar no pedido</small>
        </label>

        <label className="audit-customizer-wide">
          <span id="drop-phrase-label">Frase opcional</span>
          <input
            aria-labelledby="drop-phrase-label"
            aria-describedby="drop-phrase-hint"
            value={phrase}
            maxLength={44}
            onChange={(event) => onPhraseChange(event.target.value.slice(0, 44))}
            placeholder="Sem barulho. Só rounds."
          />
          <small id="drop-phrase-hint">{phrase.length}/44</small>
        </label>
      </div>

      <div className="audit-order-preview">
        <label htmlFor="order-summary">Resumo do pedido</label>
        <textarea id="order-summary" value={message} readOnly rows={7} onFocus={(event) => event.target.select()} />
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
