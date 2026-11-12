import { ArrowIcon } from '../ui/ArrowIcon';
import '../../styles/winter-lobby.css';
import { useState } from 'react';
import { players } from '../../data/players';
import { AppLink } from '../ui/AppLink';

const ornamentPositions = [
  { x: 50, y: 14 },
  { x: 38, y: 31 },
  { x: 64, y: 35 },
  { x: 27, y: 52 },
  { x: 52, y: 53 },
  { x: 75, y: 60 },
  { x: 45, y: 78 },
] as const;

const destinations = [
  {
    id: 'premier', sequence: '01', label: 'THE COMPETITION',
    title: 'A magia acontece no servidor.',
    body: 'Partidas, mapas e resultados verificados. O nosso percurso, round após round.',
    href: '/esports/valorant/premier', action: 'Explorar Premier',
    theme: 'winter-gift-competition',
  },
  {
    id: 'drop', sequence: '02', label: 'THE JERSEY',
    title: 'Um presente com o teu nome.',
    body: 'A camisola SHUSH Drop 01, com o teu nick e o teu número.',
    href: '/products/jersey', action: 'Descobrir Drop 01',
    theme: 'winter-gift-jersey',
  },
  {
    id: 'creators', sequence: '03', label: 'THE STORIES',
    title: 'Fora do jogo, a mesma equipa.',
    body: 'Os nossos creators e tudo o que acontece do outro lado do ecrã.',
    href: '/content', action: 'Conhecer creators',
    theme: 'winter-gift-creators',
  },
] as const;

export function WinterLobby() {
  const [active, setActive] = useState(0);
  const player = players[active];
  return (
    <>
      <section className="winter-lobby shell" aria-labelledby="winter-lobby-title">
        <div className="winter-lobby-heading">
          <div>
            <span className="section-kicker">SHUSH / THE SEVEN ORNAMENTS</span>
            <h2 id="winter-lobby-title">Sete nomes.<br /><em>Uma só árvore.</em></h2>
          </div>
          <p>Não são as luzes que tornam esta árvore especial. São as pessoas. Escolhe um ornamento e descobre quem está por trás do nick.</p>
        </div>
        <div className="winter-lobby-layout">
          <div className="winter-ornament-scene" aria-label="Escolher um dos sete jogadores da SHUSH">
            <span className="winter-ornament-scene-label">THE SHUSH CHRISTMAS TREE / 07</span>
            <div className="winter-ornament-light" aria-hidden="true" />
            <div className="winter-ornament-tree" aria-hidden="true">
              <div className="winter-ornament-silhouette" />
              <div className="winter-ornament-star">✦</div>
              <div className="winter-ornament-trunk" />
            </div>
            {players.map((member, index) => {
              const position = ornamentPositions[index];
              return (
                <button
                  type="button"
                  key={member.id}
                  className={`winter-player-ornament ${active === index ? 'is-active' : ''}`}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  aria-label={`Ver ornamento de ${member.displayName}`}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                >
                  <span className="winter-ornament-hook" aria-hidden="true" />
                  <span className="winter-ornament-ball"><span>{member.number}</span></span>
                  <span className="winter-ornament-name">{member.displayName}</span>
                </button>
              );
            })}
            <span className="winter-ornament-scene-foot">SELECIONA UM ORNAMENTO ✦</span>
          </div>
          <div className="winter-lobby-profile" aria-live="polite" aria-atomic="true">
            <div className="winter-lobby-profile-meta"><span>ORNAMENT {String(active + 1).padStart(2, '0')} / 07</span><span>SHUSH ROSTER</span></div>
            <div className="winter-lobby-portrait">
              {player.avatar ? <img key={player.id} src={player.avatar} alt={`Retrato de ${player.displayName}`} width="768" height="768" loading="lazy" decoding="async" /> : <span aria-label={`Jogador ${player.displayName}`}>{player.initials}</span>}
              <span className="winter-lobby-number" aria-hidden="true">{player.number}</span>
            </div>
            <div className="winter-lobby-profile-info">
              <div><span className="section-kicker">THE PERSON BEHIND THE NICK</span><h3>{player.displayName}</h3><p>{player.roles.join(' · ')}</p></div>
              <AppLink href={`/esports/valorant/roster?player=${player.id}`} className="winter-lobby-profile-cta" aria-label={`Conhecer ${player.displayName} no roster`}>Conhecer jogador <span aria-hidden="true"><ArrowIcon /></span></AppLink>
            </div>
          </div>
        </div>
      </section>

      <section className="winter-gifts shell" aria-labelledby="winter-gifts-title">
        <div className="winter-gifts-heading">
          <span className="section-kicker">SHUSH / UNDER THE TREE</span>
          <h2 id="winter-gifts-title">Ainda há presentes<br /><em>por descobrir.</em></h2>
          <p>Três portas para o universo SHUSH. Não precisas de esperar pelo dia 25.</p>
        </div>
        <div className="winter-gifts-grid">
          {destinations.map((destination) => (
            <AppLink key={destination.id} href={destination.href} className={`winter-gift-card ${destination.theme}`}>
              <span className="winter-gift-top"><span>{destination.label}</span><span>{destination.sequence} / 03</span></span>
              <span className="winter-gift-illustration" aria-hidden="true"><span className="winter-gift-box"><i /><b /></span><span className="winter-gift-spark one">✦</span><span className="winter-gift-spark two">✧</span></span>
              <strong>{destination.title}</strong>
              <span className="winter-gift-description">{destination.body}</span>
              <span className="winter-gift-action">{destination.action} <span aria-hidden="true"><ArrowIcon /></span></span>
            </AppLink>
          ))}
        </div>
      </section>
    </>
  );
}
