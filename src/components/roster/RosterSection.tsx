import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { players } from '../../data/players';
import { AppLink } from '../ui/AppLink';

export function RosterSection() {
  const [params, setParams] = useSearchParams();
  const selectedIndex = Math.max(0, players.findIndex((player) => player.id === params.get('player')));
  const selectedPlayer = players[selectedIndex] ?? players[0];
  const selectPlayer = useCallback((index: number) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set('player', players[index].id);
      return next;
    }, { replace: true, preventScrollReset: true });
  }, [setParams]);
  const selectNext = () => selectPlayer((selectedIndex + 1) % players.length);
  const selectPrevious = () => selectPlayer((selectedIndex - 1 + players.length) % players.length);

  return (
    <section id="roster" className="roster-section roster-select audit-roster relative scroll-mt-24 overflow-hidden px-5 pb-24 pt-36" aria-labelledby="roster-title">
      <div className="mx-auto grid max-w-7xl gap-8">
        <div className="roster-select-head css-reveal">
          <div>
            <span className="section-kicker">Valorant / Roster</span>
            <h1 id="roster-title">Quem entra no lobby.</h1>
          </div>
          <p>{players.length} jogadores. Uma identidade.<br />Seleciona um nome para conhecer as suas funções.</p>
        </div>

        <div className="character-select">
          <article key={selectedPlayer.id} className="character-spotlight character-swap" aria-live="polite">
            <div className="character-media">
              <span className="character-index">{selectedPlayer.number}</span>
              {selectedPlayer.avatar ? (
                <img src={selectedPlayer.avatar} alt={`Avatar de ${selectedPlayer.displayName}`} width="768" height="768" loading="eager" fetchPriority={selectedIndex === 0 ? 'high' : 'auto'} decoding="async" />
              ) : (
                <div className="avatar-fallback character-fallback">
                  <span className="avatar-ring" aria-hidden="true" />
                  <span>{selectedPlayer.initials}</span>
                </div>
              )}
            </div>

            <div className="character-copy">
              <span className="section-kicker">Valorant / {selectedPlayer.focus}</span>
              <h2>{selectedPlayer.displayName}</h2>
              <p>{selectedPlayer.quote}</p>

              <div className="role-stack">
                {selectedPlayer.roles.map((role) => <span key={role} className="role-badge">{role}</span>)}
              </div>

              {selectedPlayer.creatorUrl ? (
                <AppLink href={selectedPlayer.creatorUrl} target="_blank" rel="noreferrer" className="editorial-link">
                  {selectedPlayer.creatorType === 'twitch' ? 'Ver na Twitch' : 'Ver no YouTube'} <span aria-hidden="true">↗</span>
                </AppLink>
              ) : null}

              {selectedPlayer.trackerUrl ? (
                <AppLink href={selectedPlayer.trackerUrl} target="_blank" rel="noreferrer" className="footer-link mt-5 inline-flex">
                  Tracker profile <span aria-hidden="true">↗</span>
                </AppLink>
              ) : null}
            </div>
          </article>

          <div className="character-controls">
            <button type="button" onClick={selectPrevious} aria-label="Jogador anterior">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={selectNext} aria-label="Jogador seguinte">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="character-strip" aria-label="Selecionar jogador">
          {players.map((player, index) => (
            <button key={player.id} type="button" className={index === selectedIndex ? 'is-active' : ''} aria-pressed={index === selectedIndex} onClick={() => selectPlayer(index)}>
              <span className="strip-avatar">
                {player.avatar ? <img src={player.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span>{player.initials}</span>}
              </span>
              <strong>{player.displayName}</strong>
              <small>{player.roles[0]}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
