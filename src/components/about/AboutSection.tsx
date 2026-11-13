import {ArrowIcon} from '../ui/ArrowIcon';
import {creators,players} from '../../data/players';
import {AppLink} from '../ui/AppLink';
import {Button} from '../ui/Button';

export function AboutSection(){
 return <section id="about" className="about-page" aria-labelledby="about-title"><div className="shell">
  <div className="about-opening"><div><span className="section-kicker">A nossa história / 2022</span><h1 id="about-title">Um nome.<br/><span>A nossa<br/> maneira.</span></h1></div>
   <div className="about-brand-panel"><div className="about-brand-image"><img src="/assets/brand/shush-logo.webp" width="1167" height="647" alt="Logótipo SHUSH" decoding="async"/></div>
    <p>Desde 2022, entre amigos, chamadas e partidas. A mesma tag, dentro e fora do servidor.</p>
    <div className="about-counts"><span><strong>{players.length}</strong> jogadores</span><span><strong>{creators.length}</strong> creators</span></div>
   </div>
  </div>
  <section className="about-origin" aria-labelledby="origin-title">
   <div className="about-origin-index"><span className="section-kicker">A ORIGEM / THE OPPOSITE</span><span className="about-origin-semicolon" aria-hidden="true">;</span></div>
   <div className="about-origin-story"><h2 id="origin-title">Eles eram LOUD.<br/><em>Nós fomos SHUSH.</em></h2>
    <p>Em 2022, acompanhámos a conquista do VALORANT Champions pela LOUD. Entre partidas e conversas surgiu o contraponto: SHUSH. O nome começou como uma brincadeira e ficou.</p>
    <p>Os símbolos, os nicks e a camisola vieram depois. Pequenos detalhes que, juntos, passaram a identificar quem estava do nosso lado do servidor.</p>
    <small>A SHUSH é independente e não tem qualquer afiliação oficial à LOUD.</small>
   </div>
  </section>
  <section className="about-perspective motion-section" aria-labelledby="about-perspective-title"><div className="about-perspective-art" aria-hidden="true"><span>2022</span><svg viewBox="0 0 320 210" fill="none"><path d="M0 50H320 M0 105H320 M0 160H320 M55 0V210 M160 0V210 M265 0V210"/><circle cx="160" cy="105" r="90"/><circle cx="160" cy="105" r="56"/><path d="M160 10V60 M160 150V200 M65 105H115 M205 105H255"/></svg></div><div><span className="section-kicker">A EQUIPA / AGORA</span><h2 id="about-perspective-title">Sete pessoas.<br/><em>Mais do que uma tag.</em></h2><p>O roster é o centro da SHUSH. Há quem entre para competir, quem ligue a transmissão e quem fique pela conversa. Partilhamos o nome, cada um à sua maneira.</p><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer a equipa <ArrowIcon/></AppLink></div></section>
  <section className="about-chapters" aria-label="Capítulos da SHUSH">
   <article><span className="section-kicker">01 / O COMEÇO</span><h2>Mais uma?</h2><p>Primeiro vieram o Discord, as partidas e aquele último jogo que nunca é o último.</p></article>
   <article><span className="section-kicker">02 / A IDENTIDADE</span><h2>O nome ganhou forma.</h2><p>Uma camisola, sete números e a mesma assinatura. A identidade acompanha-nos para lá do jogo.</p></article>
   <article><span className="section-kicker">03 / AGORA</span><h2>Ainda cá estamos.</h2><p>Jogamos VALORANT. O More faz diretos na Twitch e o Th0maz publica vídeos no YouTube.</p></article>
  </section>
  <div className="about-paths">
   <AppLink href="/esports/valorant/roster"><span className="mono">O roster</span><strong>Estes são os culpados.</strong><span>Conhecer os jogadores</span><span aria-hidden="true"><ArrowIcon/></span></AppLink>
   <AppLink href="/content"><span className="mono">Os creators</span><strong>Nem tudo fica no Discord.</strong><span>More + Th0maz</span><span aria-hidden="true"><ArrowIcon/></span></AppLink>
   <AppLink href="/products/jersey"><span className="mono">A jersey</span><strong>O teu nome nas costas.</strong><span>Explorar Drop 01</span><span aria-hidden="true"><ArrowIcon/></span></AppLink>
  </div>
  <section id="partners" className="about-partner" aria-labelledby="partner-title"><span className="section-kicker">Parceiro técnico + digital</span><div className="partner-content"><img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" loading="lazy" decoding="async"/><div><h2 id="partner-title">Backora.</h2><p>Estrutura web e suporte técnico da SHUSH.</p></div><Button href="https://backora.org/" target="_blank" rel="noopener noreferrer" variant="secondary">Conhecer Backora</Button></div></section>
  <section className="about-brand-download" aria-labelledby="brand-title"><div><span className="section-kicker">Marca</span><h2 id="brand-title">Logótipo SHUSH.</h2><p>Para identificar a SHUSH nos teus conteúdos.</p></div><Button href="/assets/brand/shush-logo.webp" download="shush-logo.webp" variant="secondary">Descarregar logótipo (WebP)</Button></section>
 </div></section>;
}
