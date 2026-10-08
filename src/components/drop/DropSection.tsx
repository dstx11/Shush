import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JerseyCustomizer } from './JerseyCustomizer';
import { copyText, downloadText, shareUrl } from '../../lib/browser-transfer';
import { buildDropUrl, defaultDropConfig, dropDraftKey, dropSummary, graphemes, readDropConfig, readDropDraft, sanitizeDropText, type DropConfig } from '../../lib/drop-config';

const views = {
  front: { label: 'Frente', src: '/assets/jersey/frontjersey.webp', alt: 'Jersey SHUSH Drop 01 vista de frente' },
  back: { label: 'Verso', src: '/assets/jersey/backjersey.webp', alt: 'Jersey SHUSH Drop 01 vista de costas' },
} as const;
type View = keyof typeof views;

function JerseyPreview({ config, view, compact = false }: { config: DropConfig; view: View; compact?: boolean }) {
  const name = config.nick || 'SHUSH';
  const number = config.number || '00';
  const style = { '--print-name-size': `${Math.min(6, 42 / Math.max(graphemes(name).length, 1))}cqi` } as CSSProperties;
  return <div className={compact ? 'drop-mini-image' : 'audit-drop-image'} style={style}>
    <img src={views[view].src} width="1254" height="1254" alt={compact ? '' : views[view].alt} fetchPriority={compact ? 'auto' : 'high'} decoding="async" />
    {view === 'back' ? <div className="audit-live-print" aria-label={compact ? undefined : `Pré-visualização: ${name} ${number}`}><span>{name}</span><strong>{number}</strong>{config.phrase ? <small>{config.phrase}</small> : null}</div> : null}
  </div>;
}

export function DropSection() {
  const [params, setParams] = useSearchParams();
  const initial = readDropConfig(params);
  const [config, setConfig] = useState<DropConfig>(() => initial.config);
  const [view, setView] = useState<View>(() => initial.shared ? 'back' : 'front');
  const [feedback, setFeedback] = useState(() => initial.corrected ? 'A ligação tinha valores inválidos. Foram usados valores seguros.' : initial.shared ? 'Personalização carregada da ligação.' : '');
  const [manualLink, setManualLink] = useState('');
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [pending, setPending] = useState(false);
  const operation = useRef(0);
  const appliedQuery = useRef(params.toString());
  const mounted = useRef(true);
  const message = dropSummary(config);

  useEffect(() => {
    mounted.current = true;
    try { setDraftAvailable(Boolean(localStorage.getItem(dropDraftKey))); } catch { /* Optional storage. */ }
    return () => { mounted.current = false; operation.current += 1; };
  }, []);

  const query = params.toString();
  useEffect(() => {
    if (appliedQuery.current === query) return;
    appliedQuery.current = query;
    const next = readDropConfig(new URLSearchParams(query));
    operation.current += 1;
    setConfig(next.config);
    setView(next.shared ? 'back' : 'front');
    setManualLink('');
    setFeedback(next.corrected ? 'A ligação tinha valores inválidos. Foram usados valores seguros.' : next.shared ? 'Personalização carregada da ligação.' : '');
  }, [query]);

  const edit = (next: DropConfig) => {
    operation.current += 1;
    setConfig(next);
    setFeedback('');
    setManualLink('');
  };
  const clearSharedQuery = () => {
    const next = new URLSearchParams(params);
    for (const key of ['drop', 'nick', 'number', 'size', 'phrase']) next.delete(key);
    appliedQuery.current = next.toString();
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const copy = async () => {
    const id = ++operation.current;
    setPending(true);
    const success = await copyText(message);
    if (mounted.current) {
      if (id === operation.current) setFeedback(success ? 'Resumo copiado.' : 'Não foi possível copiar. Seleciona o resumo abaixo.');
      setPending(false);
    }
  };
  const share = async () => {
    const id = ++operation.current;
    const url = buildDropUrl(config, window.location.origin);
    setPending(true);
    const result = await shareUrl(url, 'A minha jersey — SHUSH Drop 01');
    if (mounted.current) {
      if (id === operation.current) {
        setManualLink(result === 'manual' ? url : '');
        setFeedback(result === 'copied' ? 'Ligação da personalização copiada.' : result === 'shared' ? 'Opções de partilha abertas.' : result === 'cancelled' ? 'Partilha cancelada.' : 'Seleciona a ligação abaixo para partilhar.');
      }
      setPending(false);
    }
  };
  const download = () => {
    try { downloadText(message + '\n', 'shush-drop01.txt'); setFeedback('Resumo preparado para descarregar.'); }
    catch { setFeedback('Não foi possível descarregar. Seleciona o resumo abaixo.'); }
  };
  const reset = () => {
    edit({ ...defaultDropConfig });
    clearSharedQuery();
    setView('front');
    setFeedback('Personalização reposta.');
  };
  const saveDraft = () => {
    try {
      const safe = readDropConfig(new URL(buildDropUrl(config, window.location.origin)).searchParams).config;
      localStorage.setItem(dropDraftKey, JSON.stringify({ version: 1, config: safe }));
      setDraftAvailable(true);
      setFeedback('Rascunho guardado neste dispositivo.');
    } catch { setFeedback('O dispositivo não permitiu guardar. Podes descarregar o resumo.'); }
  };
  const restoreDraft = () => {
    try {
      const draft = readDropDraft(localStorage.getItem(dropDraftKey) ?? '');
      if (!draft) { setFeedback('O rascunho está indisponível ou é inválido. A tua versão foi mantida.'); return; }
      edit(draft);
      clearSharedQuery();
      setView('back');
      setFeedback('Rascunho recuperado.');
    } catch { setFeedback('Não foi possível recuperar o rascunho. A tua versão foi mantida.'); }
  };
  const deleteDraft = () => {
    try { localStorage.removeItem(dropDraftKey); setDraftAvailable(false); setFeedback('Rascunho removido deste dispositivo.'); }
    catch { setFeedback('O dispositivo não permitiu remover o rascunho.'); }
  };

  return (
    <section id="products" className="drop-page" aria-labelledby="drop-title">
      <div className="shell">
        <div className="page-heading drop-heading"><div><span className="section-kicker">SHUSH / Jersey / Drop 01</span><h1 id="drop-title">A tua<br /><span>versão.</span></h1></div><p>Preto. Roxo. O teu nick.<br />Uma camisola com a identidade da SHUSH e a tua personalização.</p></div>
        <div className="drop-layout">
          <div id="product-preview" className="audit-drop-gallery">
            <div className="drop-gallery-label"><span className="mono">SHS / Drop 01</span><span className="mono">{views[view].label}</span></div>
            <JerseyPreview config={config} view={view} />
            <div className="view-control drop-view-control" role="group" aria-label="Vista da jersey">{(Object.keys(views) as View[]).map((key) => <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}><span aria-hidden="true">{key === 'front' ? '01' : '02'}</span> {views[key].label}</button>)}</div>
            <p className="drop-preview-note">Pré-visualização indicativa. A posição, a frase e a impressão são confirmadas no pedido manual.</p>
          </div>
          <aside id="customizacao" className="drop-editor" aria-labelledby="customizer-title">
            <div className="drop-mobile-preview"><div aria-hidden="true"><JerseyPreview config={config} view="back" compact /></div><div><span className="mono">A tua versão</span><strong>{config.nick || 'SHUSH'} / {config.number || '00'}</strong><small>Tamanho {config.size}</small></div><a className="editorial-link" href="#product-preview" onClick={() => setView('back')} aria-label="Ver pré-visualização completa"><span aria-hidden="true">↗</span></a></div>
            <JerseyCustomizer config={config} message={message} onChange={(next) => edit({ ...next, nick: sanitizeDropText(next.nick, 14), phrase: sanitizeDropText(next.phrase, 44) })} />
            <div className="drop-transfer-actions" aria-busy={pending}><button className="site-button button-primary" type="button" onClick={copy} disabled={pending}>Copiar resumo <span aria-hidden="true">⧉</span></button><button className="utility-button" type="button" onClick={download}>Descarregar TXT <span aria-hidden="true">↓</span></button><button className="utility-button" type="button" onClick={share} disabled={pending}>Partilhar personalização <span aria-hidden="true">↗</span></button><button className="utility-button" type="button" onClick={reset}>Repor <span aria-hidden="true">↺</span></button></div>
            <p className="action-feedback" role="status">{feedback}</p>
            {manualLink ? <label className="manual-copy"><span>Ligação para copiar</span><input value={manualLink} readOnly onFocus={(event) => event.target.select()} /></label> : null}
            <details className="drop-draft"><summary>Rascunho neste dispositivo</summary><p>Guarda apenas quando escolheres. O rascunho fica neste browser e pode ser recuperado ou removido aqui.</p><div className="action-row"><button className="utility-button" type="button" onClick={saveDraft}>Guardar rascunho</button><button className="utility-button" type="button" onClick={restoreDraft} disabled={!draftAvailable}>Recuperar rascunho</button><button className="utility-button" type="button" onClick={deleteDraft} disabled={!draftAvailable}>Remover rascunho</button></div></details>
          </aside>
        </div>
        <section className="drop-process" aria-labelledby="drop-process-title"><div><span className="section-kicker">Depois da personalização</span><h2 id="drop-process-title">Prepara. Partilha.<br />Confirma com a equipa.</h2></div><ol><li><span className="mono">01 / Personaliza</span><p>Escolhe o nick, número, tamanho e uma frase opcional.</p></li><li><span className="mono">02 / Guarda o resumo</span><p>Copia o texto, descarrega o TXT ou partilha a tua versão.</p></li><li><span className="mono">03 / Pedido manual</span><p>Os detalhes, tamanho e disponibilidade são acordados com a equipa. A pré-visualização não reserva uma jersey.</p></li></ol></section>
      </div>
    </section>
  );
}
