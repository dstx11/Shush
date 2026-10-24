import { routeMetadata, siteUrl } from './meta';

// One source for the build-time document and subsequent client navigation.
export function pageSchema(path: string) {
  const metadata = routeMetadata[path];
  if (!metadata) return [];
  const url = `${siteUrl}${path === '/' ? '' : path}`;
  const name = metadata.title;
  return [{
    '@type': path === '/company' ? 'AboutPage' : 'WebPage',
    '@id': `${url}#page`, url, name, description: metadata.description,
    inLanguage: 'pt-PT', isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    ...(path === '/' ? {} : { breadcrumb: { '@id': `${url}#breadcrumb` } }),
  }, ...(path === '/' ? [] : [{
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SHUSH', item: siteUrl },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  }])];
}
