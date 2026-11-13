import '../../styles/signal-v3.css';
import { AppLink } from '../ui/AppLink';
import { ArrowIcon } from '../ui/ArrowIcon';

export function SignalSection() {
  return <section className="shell shush-signals motion-section" aria-labelledby="shush-signals-title">
    <div className="shush-signals-heading">
      <div><span className="section-kicker">SHUSH / ENTRE ROUNDS</span><h2 id="shush-signals-title">O servidor fecha.<br /><em>O grupo fica.</em></h2></div>
      <div className="shush-signals-story"><p>Uma chamada no Discord. Uma equipa para entrar no servidor. A conversa que continua depois da última partida.</p><AppLink href="/company" className="editorial-link">De onde viemos <ArrowIcon /></AppLink></div>
    </div>
    <div className="shush-signals-line" aria-hidden="true"><span>2022</span><i /><span>SEM BARULHO. SÓ ROUNDS.</span><i /><span>SHUSH</span></div>
  </section>;
}
