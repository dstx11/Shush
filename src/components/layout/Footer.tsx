import { footerLinks } from '../../data/nav';
import { creators } from '../../data/players';
import { AppLink } from '../ui/AppLink';

export function Footer() {
  return <footer className="shush-footer">
    <div className="shell">
      <div className="footer-signature"><AppLink href="/" className="brand-mark" aria-label="SHUSH — Home"><img src="/assets/brand/shush-logo.webp" width="1167" height="647" alt="" loading="lazy" decoding="async" /><span>SHUSH</span></AppLink><p>Sem barulho.<br /><span>Só rounds.</span></p></div>
      <div className="footer-navigation"><nav aria-label="Navegação de rodapé"><span className="mono">Explorar</span><div className="footer-site-links">{footerLinks.map((item) => <AppLink key={item.href} href={item.href}>{item.label}<span aria-hidden="true">↗</span></AppLink>)}</div></nav><div className="footer-channels"><span className="mono">Creators</span>{creators.map((creator) => <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noopener noreferrer">{creator.displayName}<span aria-hidden="true">↗</span></a>)}</div><div className="footer-partner"><span className="mono">Parceiro técnico</span><a href="https://backora.org/" target="_blank" rel="noopener noreferrer"><img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" loading="lazy" decoding="async" /><span>Backora</span><span aria-hidden="true">↗</span></a></div></div>
      <div className="footer-colophon"><span>SHUSH © {new Date().getFullYear()}</span><span>Gaming / Valorant / Creators</span><a href="#main-content" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.querySelector<HTMLAnchorElement>('header .brand-mark')?.focus({ preventScroll: true }); }}>Voltar ao início <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
