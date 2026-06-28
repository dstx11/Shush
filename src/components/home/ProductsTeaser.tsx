import { Button } from '../ui/Button';

export function ProductsTeaser() {
  return (
    <section className="product-teaser px-5 py-24" aria-labelledby="products-teaser-title">
      <div className="product-teaser-shell">
        <div>
          <span className="section-kicker">Jersey</span>
          <h2 id="products-teaser-title">Built for the lobby.</h2>
          <p>Preto. Roxo. Silencio no lobby.</p>
          <Button href="/products">Ver produtos</Button>
        </div>
        <img src="/assets/jersey/backjersey.webp" width="1280" height="1280" alt="Jersey SHUSH vista de costas" loading="lazy" decoding="async" />
      </div>
    </section>
  );
}
