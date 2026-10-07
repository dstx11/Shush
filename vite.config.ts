import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defaultMetadata, routeMetadata, siteUrl } from './src/data/meta';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[char] ?? char;
  });
}

function setMeta(html: string, attribute: 'name' | 'property', key: string, value: string) {
  const marker = `<meta ${attribute}="${key}" content="`;
  const start = html.indexOf(marker);
  if (start < 0) return html;

  const valueStart = start + marker.length;
  const valueEnd = html.indexOf('"', valueStart);
  if (valueEnd < 0) return html;

  return html.slice(0, valueStart) + escapeHtml(value) + html.slice(valueEnd);
}

function staticRouteMetadata(): Plugin {
  return {
    name: 'shush-static-route-metadata',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const indexAsset = bundle['index.html'];
      if (!indexAsset || indexAsset.type !== 'asset') return;

      const source =
        typeof indexAsset.source === 'string'
          ? indexAsset.source
          : new TextDecoder().decode(indexAsset.source);

      for (const [route, metadata] of Object.entries(routeMetadata)) {
        if (route === '/') continue;

        const canonical = `${siteUrl}${route}`;
        const imagePath = metadata.image ?? defaultMetadata.image ?? '/og-shush.png';
        const image = imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath}`;

        let html = source
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/>/,
            `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
          );

        html = setMeta(html, 'name', 'description', metadata.description);
        html = setMeta(html, 'name', 'robots', 'index,follow');
        html = setMeta(html, 'property', 'og:title', metadata.title);
        html = setMeta(html, 'property', 'og:description', metadata.description);
        html = setMeta(html, 'property', 'og:url', canonical);
        html = setMeta(html, 'property', 'og:image', image);
        html = setMeta(html, 'name', 'twitter:title', metadata.title);
        html = setMeta(html, 'name', 'twitter:description', metadata.description);
        html = setMeta(html, 'name', 'twitter:image', image);

        if (route !== '/products/jersey') {
          html = html.replace(
            /\s*<link rel="preload" as="image" href="\/assets\/jersey\/frontjersey\.webp"[^>]*\/>/,
            '',
          );
        }

        this.emitFile({
          type: 'asset',
          fileName: `${route.slice(1)}.html`,
          source: html,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), staticRouteMetadata()],
});
