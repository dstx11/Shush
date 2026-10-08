import { dropSizes, graphemes, type DropConfig } from '../../lib/drop-config';

type Props = { config: DropConfig; message: string; onChange: (config: DropConfig) => void };

export function JerseyCustomizer({ config, message, onChange }: Props) {
  return <div className="jersey-customizer">
    <div className="customizer-heading"><span className="section-kicker">01 / Personalização</span><h2 id="customizer-title">Faz a tua versão.</h2><p>O nick e número aparecem no verso.</p></div>
    <div className="customizer-fields">
      <label><span id="drop-nick-label">Nick</span><input aria-labelledby="drop-nick-label" aria-describedby="drop-nick-hint" value={config.nick} maxLength={224} autoComplete="off" onChange={(event) => onChange({ ...config, nick: event.target.value })} placeholder="SHUSH" /><small id="drop-nick-hint">{graphemes(config.nick).length}/14 caracteres</small></label>
      <label><span id="drop-number-label">Número</span><input aria-labelledby="drop-number-label" aria-describedby="drop-number-hint" value={config.number} inputMode="numeric" maxLength={2} onChange={(event) => onChange({ ...config, number: event.target.value.replace(/\D/g, '').slice(0, 2) })} placeholder="01" /><small id="drop-number-hint">00–99</small></label>
      <fieldset className="size-options"><legend>Tamanho</legend><div>{dropSizes.map((size) => <label key={size}><input type="radio" name="jersey-size" className="size-input" value={size} checked={config.size === size} onChange={() => onChange({ ...config, size })} /><span>{size}</span></label>)}</div><small>A confirmar no pedido manual.</small></fieldset>
      <label className="customizer-wide"><span id="drop-phrase-label">Frase opcional</span><input aria-labelledby="drop-phrase-label" aria-describedby="drop-phrase-hint" value={config.phrase} maxLength={704} onChange={(event) => onChange({ ...config, phrase: event.target.value })} placeholder="Sem barulho. Só rounds." /><small id="drop-phrase-hint">{graphemes(config.phrase).length}/44 caracteres · posição indicativa</small></label>
    </div>
    <div className="order-summary"><label htmlFor="order-summary">02 / Resumo do pedido</label><textarea id="order-summary" value={message} readOnly rows={7} onFocus={(event) => event.target.select()} aria-label="Resumo do pedido" /></div>
  </div>;
}
