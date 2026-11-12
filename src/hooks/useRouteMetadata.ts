import { useEffect } from 'react';
import { identitySchema, pageSchema } from '../data/seo';
import { defaultMetadata, routeMetadata, siteUrl } from '../data/meta';

const legacyRoutes = new Set([
  '/esports',
  '/esports/valorant',
  '/esports/valorant/results',
  '/esports/valorant/tournaments',
  '/content/more',
  '/content/th0maz7',
  '/products',
  '/products/jersey/custom',
  '/company/partners',
  '/company/contact',
]);

export function useRouteMetadata(pathname: string) {
  useEffect(() => {
    const isKnownRoute = Boolean(routeMetadata[pathname]) || legacyRoutes.has(pathname);
    const metadata = isKnownRoute
      ? routeMetadata[pathname] ?? defaultMetadata
      : {
          title: '404 — SHUSH',
          description: 'Esta página não existe no site público da SHUSH.',
          image: defaultMetadata.image,
        };
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '' : pathname}`;
    const image = metadata.image ?? defaultMetadata.image ?? '/assets/jersey/frontjersey.webp';
    const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    document.title = metadata.title;
    setMeta('meta[name="description"]', metadata.description);
    setMeta('meta[property="og:title"]', metadata.title);
    setMeta('meta[property="og:description"]', metadata.description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', absoluteImage);
    setMeta('meta[property="og:image:alt"]', metadata.title);
    setMeta('meta[name="twitter:title"]', metadata.title);
    setMeta('meta[name="twitter:description"]', metadata.description);
    setMeta('meta[name="twitter:image"]', absoluteImage);
    setMeta('meta[name="twitter:image:alt"]', metadata.title);
    setMeta('meta[name="robots"]', isKnownRoute ? 'index,follow,max-image-preview:large' : 'noindex,nofollow');
    setCanonical(canonicalUrl);
    const schema = document.getElementById('shush-schema');
    if (schema) {
      schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [...identitySchema(), ...pageSchema(pathname)] });
    }
  }, [pathname]);
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function setCanonical(href: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (link) link.href = href;
}
