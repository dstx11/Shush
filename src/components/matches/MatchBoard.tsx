import { useState } from 'react';
import { verifiedMatches, verifiedMatchHref } from '../../data/verified-matches';
import { formatDate } from '../../lib/premier';
import { AppLink } from '../ui/AppLink';
import './match-board.css';

function Flaps({ score, previous }: { score: number; previous: number }) {
  const digits = String(score).padStart(2, '0');
  const before = String(previous).padStart(2, '0');
  return <span className="flap-pair">{Array.from(digits, (digit, index) =>
    <span className="flap" key={index}>
      {digit}
      {digit !== before[index] && <span key={before[index] + digit} className="flap-leaf">{before[index]}</span>}
    </span>
  )}</span>;
}

export function MatchBoard() {
  const [{ index, previous }, select] = useState({ index: 0, previous: 0 });
  const match = verifiedMatches[index];
  if (!match) return null;
  const before = verifiedMatches[previous];
  function step(direction: number) {
    select(current => ({
      previous: current.index,
      index: (current.index + direction + verifiedMatches.length) % verifiedMatches.length,
    }));
  }
  return <div className="match-board">
    <AppLink className="match-front-page" href={verifiedMatchHref(match)}>
      <span>{index === 0 ? 'Última partida documentada' : 'Partida documentada'} <time dateTime={match.date}>{formatDate(match.date)}</time></span>
      <strong className="flap-score" aria-hidden="true">
        <Flaps score={match.shushScore} previous={before.shushScore} /><i>:</i>
        <Flaps score={match.opponentScore} previous={before.opponentScore} />
      </strong>
      <b>SHUSH <i>vs</i> {match.opponent}</b>
      <span className="sr-only">{match.shushScore} a {match.opponentScore}.</span>
      <span>{match.map} <span aria-hidden="true">↗</span></span>
    </AppLink>
    <div className="board-controls">
      <button type="button" aria-label="Partida anterior no marcador" onClick={() => step(-1)}>‹</button>
      <span>{index + 1} / {verifiedMatches.length}</span>
      <button type="button" aria-label="Partida seguinte no marcador" onClick={() => step(1)}>›</button>
    </div>
    <span className="sr-only" role="status">{`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}, ${match.map}.`}</span>
  </div>;
}
