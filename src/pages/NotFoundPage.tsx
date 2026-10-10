import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return <section className="not-found-page" aria-labelledby="not-found-title"><div className="shell not-found-grid"><div><span className="section-kicker">404 / SHUSH</span><h1 id="not-found-title">Fora do<br /><span>mapa.</span></h1><p>Esta página não existe no site público da SHUSH.</p><div className="action-row"><Button href="/">Voltar à Home</Button><Button href="/esports/valorant/roster" variant="secondary">Conhecer o roster</Button></div></div><span className="not-found-number" aria-hidden="true">404</span></div></section>;
}
