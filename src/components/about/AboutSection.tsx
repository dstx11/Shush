import { creators, players } from '../../data/players';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';

export function AboutSection() {
  return (
    <section id="about" className="about-page" aria-labelledby="about-title">
      <div className="shell">
        <div className="about-opening"><div><span className="section-kicker">Company / SHUSH</span><h1 id="about-title">Antes da SHUSH,<br /><span>já éramos nós.</span></h1></div><div className="about-brand-panel"><div className="about-brand-image"><img src="/assets/brand/shush-logo.webp" width="1167" height="647" alt="Logótipo SHUSH" decoding="async" /></div><p>Um grupo de amigos, vontade de jogar e a conversa que continuava depois da última partida. Foi aí que a SHUSH começou a ganhar forma.</p><div className="about-counts"><span><strong>{players.length}</strong> jogadores</span><span><strong>{creators.length}</strong> creators</span></div></div></div>
        <section className="about-chapters" aria-label="A história da SHUSH"><article><span className="section-kicker">01 / O lobby</span><h2>Mais uma?</h2><p>Ficávamos para outra partida, trocávamos ideias e ríamos do round anterior. A SHUSH começou nessa vontade de voltar.</p></article><article><span className="section-kicker">02 / O nome</span><h2>Uma equipa, um nome.</h2><p>Decidimos dar um nome ao grupo e começar a competir juntos. Assim nasceu a SHUSH.</p></article><article><span className="section-kicker">03 / O que fica</span><h2>Continuar juntos.</h2><p>Hoje continuamos a jogar juntos. Alguns de nós também fazem vídeos e transmitem as partidas.</p></article></section>

        <section className="about-manifesto" aria-labelledby="identity-title"><span className="section-kicker">04 / O que importa</span><div><h2 id="identity-title">Competir a sério.<br /><span>Entre amigos.</span></h2><p>Queremos melhorar como equipa, sem perder a vontade de voltar a jogar juntos no dia seguinte.</p></div></section>
        <div className="about-paths"><AppLink href="/esports/valorant/roster"><span className="mono">A equipa</span><strong>Quem joga.</strong><span>Conhecer o roster</span><span aria-hidden="true">↗</span></AppLink><AppLink href="/content"><span className="mono">Os creators</span><strong>Quem cria.</strong><span>More + Th0maz</span><span aria-hidden="true">↗</span></AppLink><AppLink href="/products/jersey"><span className="mono">A camisola</span><strong>Drop 01.</strong><span>Explorar Drop 01</span><span aria-hidden="true">↗</span></AppLink></div>
        <section id="partners" className="about-partner" aria-labelledby="partner-title"><span className="section-kicker">05 / Parceiro técnico + digital</span><div className="partner-content"><img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" loading="lazy" decoding="async" /><div><h2 id="partner-title">Backora.</h2><p>Estrutura web e suporte técnico da SHUSH.</p></div><Button href="https://backora.org/" target="_blank" rel="noopener noreferrer" variant="secondary">Conhecer Backora</Button></div></section>
        <section className="about-brand-download" aria-labelledby="brand-title"><div><span className="section-kicker">06 / Marca</span><h2 id="brand-title">Logótipo SHUSH.</h2><p>Logótipo SHUSH · WebP · 1167 × 647</p></div><Button href="/assets/brand/shush-logo.webp" download="shush-logo.webp" variant="secondary">Descarregar logótipo (WebP)</Button></section>
      </div>
    </section>
  );
}
