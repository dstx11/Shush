import type { ComponentType } from 'react';

type PageModule = { default: ComponentType };

function once<T>(loader: () => Promise<T>) {
  let promise: Promise<T> | undefined;
  return () => {
    promise ??= loader();
    return promise;
  };
}

export const loadHomePage = once<PageModule>(() =>
  import('../pages/HomePage').then((module) => ({ default: module.HomePage })),
);

export const loadPremierPage = once<PageModule>(() =>
  import('../pages/PremierPage').then((module) => ({ default: module.PremierPage })),
);

export const loadRosterPage = once<PageModule>(() =>
  import('../pages/RosterPage').then((module) => ({ default: module.RosterPage })),
);

export const loadContentPage = once<PageModule>(() =>
  import('../pages/ContentPage').then((module) => ({ default: module.ContentPage })),
);

export const loadDropPage = once<PageModule>(() =>
  import('../pages/DropPage').then((module) => ({ default: module.DropPage })),
);

export const loadAboutPage = once<PageModule>(() =>
  import('../pages/AboutPage').then((module) => ({ default: module.AboutPage })),
);

export const loadNotFoundPage = once<PageModule>(() =>
  import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

const routeLoaders = new Map<string, () => Promise<PageModule>>([
  ['/', loadHomePage],
  ['/esports', loadPremierPage],
  ['/esports/valorant', loadPremierPage],
  ['/esports/valorant/premier', loadPremierPage],
  ['/esports/valorant/results', loadPremierPage],
  ['/esports/valorant/tournaments', loadPremierPage],
  ['/esports/valorant/roster', loadRosterPage],
  ['/content', loadContentPage],
  ['/content/more', loadContentPage],
  ['/content/th0maz7', loadContentPage],
  ['/products', loadDropPage],
  ['/products/jersey', loadDropPage],
  ['/products/jersey/custom', loadDropPage],
  ['/company', loadAboutPage],
  ['/company/partners', loadAboutPage],
  ['/company/contact', loadAboutPage],
]);

export function preloadRoute(href: string) {
  const pathname = href.split(/[?#]/, 1)[0] || '/';
  const loader = routeLoaders.get(pathname) ?? loadNotFoundPage;
  void loader();
}
