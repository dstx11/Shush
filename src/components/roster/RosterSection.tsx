import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { players } from '../../data/players';
import { getCompetitiveProfile } from '../../data/competitive-profiles';
import { AppLink } from '../ui/AppLink';

function TrackerButton({ href, playerName, compact = false }: { href: string; playerName: string; compact?: boolean }) {
  return (
    <AppLink href={href} target="_blank" rel="noopener noreferrer" className={`tracker-button${compact ? ' tracker-button-compact' : ''}`} aria-label={`Consultar ${playerName} no Tracker.gg (abre numa nova janela)`}>
      <span>{compact ? 'Tracker.gg' : 'Abrir Tracker.gg'}</span>
      <span className="tracker-button-arrow" aria-hidden="true">↗</span>
    </AppLink>
  );
}

export function RosterSection() {
  const [params, setParams] = useSearchParams();
  const selectedIndex = Math.max(0, players.findIndex((player) => player.id === params.get('player')));
  const selectedPlayer = players[selectedIndex] ?? players[0];
  const competitiveProfile = getCompetitiveProfile(selectedPlayer.id);
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
          <p>{players.length} jogadores. Uma identidade.<br />Conhece a equipa e acompanha os seus perfis competitivos.</p>
        </div>

        <div className="character-strip" role="group" aria-label="Selecionar jogador">
          {players.map((player, index) => {
            const profile = getCompetitiveProfile(player.id);
            return (
              <div key={player.id} className={`player-select-card${index === selectedIndex ? ' is-active' : ''}`}>
                <button type="button" className="player-card-select" aria-pressed={index === selectedIndex} aria-controls="selected-player" onClick={() => selectPlayer(index)}>
                  <span className="strip-avatar">
                    <span className="player-card-number" aria-hidden="true">{player.number}</span>
                    {player.avatar ? <img src={player.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span className="strip-initials">{player.initials}</span>}
                  </span>
                  <span className="player-card-name"><strong>{player.displayName}</strong><small>{player.roles[0]}</small></span>
                </button>
                {profile ? (
                  <div className="player-card-account">
                    <span className="player-card-riot-id">{profile.riotId}</span>
                    <TrackerButton href={profile.trackerUrl} playerName={player.displayName} compact />
                  </div>
                ) : <p className="competitive-note">Perfil competitivo ainda não publicado.</p>}
              </div>
            );
          })}
        </div>

        <div className="character-select">
          <p className="sr-only" role="status">Jogador selecionado: {selectedPlayer.displayName}.</p>
          <article id="selected-player" key={selectedPlayer.id} className="character-spotlight character-swap" aria-labelledby="selected-player-name">
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
              <h2 id="selected-player-name">{selectedPlayer.displayName}</h2>
              <p>{selectedPlayer.quote}</p>

              <div className="role-stack">
                {selectedPlayer.roles.map((role) => <span key={role} className="role-badge">{role}</span>)}
              </div>

              {competitiveProfile ? (
                <div className="competitive-profile">
                  <span className="section-kicker">Tracker.gg / Perfil competitivo</span>
                  <dl className="competitive-identity">
                    <div>
                      <dt>Riot ID</dt>
                      <dd>{competitiveProfile.riotId}</dd>
                    </div>
                    <div>
                      <dt>Modo</dt>
                      <dd>{competitiveProfile.playlist === 'premier' ? 'Premier' : 'Competitive'}</dd>
                    </div>
                  </dl>
                  {competitiveProfile.seasonId ? <p className="competitive-period">Ligação à temporada selecionada no perfil, não à temporada atual.</p> : null}
                  <TrackerButton href={competitiveProfile.trackerUrl} playerName={selectedPlayer.displayName} />
                  <p className="competitive-note">Rank, estatísticas e histórico no Tracker.gg. A disponibilidade depende da privacidade da conta.</p>
                </div>
              ) : <p className="competitive-note">Perfil competitivo ainda não publicado.</p>}

              {selectedPlayer.creatorUrl ? (
                <AppLink href={selectedPlayer.creatorUrl} target="_blank" rel="noreferrer" className="editorial-link">
                  {selectedPlayer.creatorType === 'twitch' ? 'Ver na Twitch' : 'Ver no YouTube'} <span aria-hidden="true">↗</span>
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

      </div>
    </section>
  );
}
