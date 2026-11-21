import { ArrowIcon } from '../ui/ArrowIcon';
import { players } from '../../data/players';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';

export function AboutSection() {
  return <section id="about" className="about-page" aria-labelledby="about-title"><div className="shell">
    <div className="story-cover">
      <div className="story-seal"><strong className="masked-word">SHUSH</strong><span>Desde 2022</span></div>
      <div className="story-letter"><span className="section-kicker">A ORIGEM DA SHUSH</span><h1 id="about-title">Um nome.<br /><em>A nossa maneira.</em></h1><p>Entre amigos, chamadas e partidas. A mesma tag, dentro e fora do servidor.</p></div>
    </div>
    <nav className="story-index" aria-label="Nesta história"><a href="#origin-title">01 / A origem <span aria-hidden="true">↓</span></a><a href="#about-perspective-title">02 / A equipa <span aria-hidden="true">↓</span></a><a href="#partners">03 / Quem ajuda <span aria-hidden="true">↓</span></a></nav>
    <section className="story-origin" aria-labelledby="origin-title">
      <div className="story-margin"><span>01 / A ORIGEM</span><b aria-hidden="true">;</b></div>
      <div className="story-origin-copy"><span className="section-kicker">THE OPPOSITE</span><h2 id="origin-title">Eles eram LOUD.<br /><em>Nós fomos SHUSH.</em></h2><p>Em 2022, acompanhámos a conquista do VALORANT Champions pela LOUD. Entre partidas e conversas surgiu o contraponto: SHUSH. O nome começou como uma brincadeira e ficou.</p><p>Os símbolos, os nicks e a camisola vieram depois. Pequenos detalhes que, juntos, passaram a identificar quem estava do nosso lado do servidor.</p><small>A SHUSH é independente e não tem qualquer afiliação oficial à LOUD.</small></div>
    </section>
    <section className="story-team" aria-labelledby="about-perspective-title"><div className="story-margin"><span>02 / A EQUIPA</span><strong>07</strong></div><div><h2 id="about-perspective-title">Sete pessoas.<br /><em>Mais do que uma tag.</em></h2><p>Há quem entre para competir, quem ligue a transmissão e quem fique pela conversa. Partilhamos o nome, cada um à sua maneira.</p><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer a equipa <ArrowIcon /></AppLink></div><div className="story-name-index" aria-label="Os sete jogadores">{players.map(player => <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`}><span>#{player.number}</span><strong>{player.displayName}</strong><ArrowIcon /></AppLink>)}</div></section>
    <section className="story-chapters" aria-label="Capítulos da SHUSH"><article><span>O COMEÇO</span><h2>Mais uma?</h2><p>Primeiro vieram o Discord, as partidas e aquele último jogo que nunca é o último.</p></article><article><span>A IDENTIDADE</span><h2>O nome ganhou forma.</h2><p>Uma camisola, sete números e a mesma assinatura. A identidade acompanha-nos para lá do jogo.</p></article><article><span>AGORA</span><h2>Ainda cá estamos.</h2><p>Jogamos VALORANT. O More faz diretos na Twitch e o Th0maz publica vídeos no YouTube.</p></article></section>
    <div className="story-paths"><AppLink href="/content"><span>OS CREATORS</span><strong>A conversa continua.</strong><ArrowIcon /></AppLink></div>
    <section id="partners" className="story-partner" aria-labelledby="partner-title"><span className="section-kicker">03 / QUEM AJUDA</span><div><img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" loading="lazy" decoding="async" /><div><h2 id="partner-title">Backora.</h2><p>Estrutura web e suporte técnico da SHUSH.</p></div><Button href="https://backora.org/" target="_blank" rel="noopener noreferrer" variant="secondary">Conhecer Backora</Button></div></section>
    <section className="story-download" aria-labelledby="brand-title"><div><span className="section-kicker">A ASSINATURA</span><h2 id="brand-title">Logótipo SHUSH.</h2><p>Para identificar a SHUSH nos teus conteúdos.</p></div><Button href="/assets/brand/shush-logo.webp" download="shush-logo.webp" variant="secondary">Descarregar logótipo (WebP)</Button></section>
  </div></section>;
}
