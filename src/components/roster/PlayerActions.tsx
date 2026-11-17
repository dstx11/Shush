import {useEffect,useRef,useState} from 'react';
import {copyText,shareUrl} from '../../lib/browser-transfer';
import {ArrowIcon} from '../ui/ArrowIcon';
import {CopyIcon} from '../ui/CopyIcon';

export function PlayerActions({ playerId, playerName, riotId }: { playerId: string; playerName: string; riotId: string }) {
  const [feedback, setFeedback] = useState('');
  const [manual, setManual] = useState('');
  const [pending, setPending] = useState(false);
  const operation = useRef(0);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; operation.current++; }; }, []);
  const copy = async () => {
    const id = ++operation.current;
    setPending(true); setManual(''); setFeedback('A copiar o Riot ID…');
    const copied = await copyText(riotId);
    if (!mounted.current || id !== operation.current) return;
    setPending(false);
    setManual(copied ? '' : riotId);
    setFeedback(copied ? 'Riot ID copiado.' : 'Não foi possível copiar. Seleciona o Riot ID abaixo.');
  };
  const share = async () => {
    const id = ++operation.current;
    setPending(true); setManual(''); setFeedback('A preparar a partilha…');
    const url = new URL('/esports/valorant/roster', window.location.origin);
    url.searchParams.set('player', playerId);
    const result = await shareUrl(url.href, `${playerName} — SHUSH`);
    if (!mounted.current || id !== operation.current) return;
    setPending(false);
    setManual(result === 'manual' ? url.href : '');
    setFeedback(result === 'copied' ? 'Ligação do jogador copiada.' : result === 'shared' ? 'Opções de partilha abertas.' : result === 'cancelled' ? 'Partilha cancelada.' : 'Seleciona a ligação abaixo para partilhar.');
  };
  return <div className="player-utilities">
    <div className="action-row" aria-busy={pending}><button type="button" className="utility-button" aria-label="Copiar Riot ID" aria-busy={pending} data-transfer={feedback==='Riot ID copiado.'?'success':manual?'error':undefined} onClick={copy} disabled={pending}>{feedback==='Riot ID copiado.'?'Copiado':pending?'A aguardar…':'Copiar Riot ID'} <CopyIcon done={feedback==='Riot ID copiado.'}/></button><button type="button" className="utility-button" onClick={share} disabled={pending}>Partilhar jogador <span aria-hidden="true"><ArrowIcon /></span></button></div>
    <p className="action-feedback" role="status">{feedback}</p>
    {manual ? <label className="manual-copy"><span>Texto para copiar</span><input readOnly value={manual} onFocus={(event) => event.target.select()} /></label> : null}
  </div>;
}

