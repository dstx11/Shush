import { chooseQuietMotion, useQuietMotion } from '../../hooks/useQuietMotion';
import { ArrowIcon } from '../ui/ArrowIcon';
import { useLocation } from 'react-router-dom';
import { footerLinks } from '../../data/nav';
import { creators } from '../../data/players';
import { AppLink } from '../ui/AppLink';

export function Footer({ interactive = false }: { interactive?: boolean }) {
  const quiet = useQuietMotion();
  const { pathname } = useLocation();
  return <footer className="shush-footer">
    <div className="shell"><div className="footer-manifesto"><p>O silêncio é nosso.<br /><em>Até ao próximo round.</em></p><span>SHUSH / PORTUGAL<br />SILENCE BEFORE IMPACT</span></div>
      <div className="footer-signature"><AppLink href="/" className="brand-mark" aria-label="SHUSH — Home"><img src="/assets/brand/shush-logo-small.webp" width="1167" height="647" alt="" loading="lazy" decoding="async" /><span>SHUSH</span></AppLink><a className="footer-top" href="#main-content" aria-label="Voltar ao conteúdo">↑</a></div>
      <div className="footer-navigation"><nav aria-label="Navegação de rodapé"><span className="mono">Explorar</span><div className="footer-site-links">{footerLinks.map((item) => <AppLink key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.label}<span aria-hidden="true"><ArrowIcon /></span></AppLink>)}</div></nav><div className="footer-channels"><span className="mono">Creators</span>{creators.map((creator) => <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noopener noreferrer">{creator.displayName}<span aria-hidden="true"><ArrowIcon /></span></a>)}</div><div className="footer-partner"><span className="mono">Parceiro técnico</span><a href="https://backora.org/" target="_blank" rel="noopener noreferrer"><img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" loading="lazy" decoding="async" /><span>Backora</span><span aria-hidden="true"><ArrowIcon /></span></a></div></div>
      <div className="footer-colophon"><span>SHUSH © {new Date().getFullYear()}</span><span>Sem barulho. Só rounds.</span>{interactive && <button className="shush-motion-toggle" type="button" aria-pressed={quiet} onClick={() => chooseQuietMotion(!quiet)}><span aria-hidden="true" className="motion-toggle-indicator"><span /></span>Movimento suave</button>}<a href="#main-content" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: quiet ? 'instant' : 'smooth' }); document.querySelector<HTMLAnchorElement>('header .lux-brand')?.focus({ preventScroll: true }); }}>Voltar ao início <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
