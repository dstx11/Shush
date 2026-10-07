import { footerLinks } from '../../data/nav';
import { creators } from '../../data/players';
import { AppLink } from '../ui/AppLink';

export function Footer() {
  return (
    <footer className="audit-footer px-5 pb-10 pt-16">
      <div className="audit-footer-shell">
        <div className="audit-footer-brand">
          <AppLink href="/" aria-label="SHUSH — Home">
            <img src="/assets/brand/shush-logo.webp" width="1167" height="647" alt="" loading="lazy" decoding="async" />
            <span>SHUSH</span>
          </AppLink>
          <p>Sem barulho. Só rounds.</p>
        </div>

        <nav className="audit-footer-nav" aria-label="Navegação de rodapé">
          <span>Site</span>
          {footerLinks.map((item) => (
            <AppLink key={item.href} href={item.href}>{item.label}</AppLink>
          ))}
        </nav>

        <div className="audit-footer-nav">
          <span>Creators</span>
          {creators.map((creator) => (
            <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noreferrer">
              {creator.displayName}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        <div className="audit-footer-partner">
          <span>Parceiro técnico</span>
          <a href="https://backora.org/" target="_blank" rel="noreferrer">
            <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" loading="lazy" decoding="async" />
            Backora
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="audit-footer-bottom">
        <span>SHUSH © {new Date().getFullYear()}</span>
        <span>Gaming · Valorant · Creators</span>
      </div>
    </footer>
  );
}
