type PageModule = { default: React.ComponentType };

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
  ['/esports/valorant/premier', loadPremierPage],
  ['/esports/valorant/roster', loadRosterPage],
  ['/content', loadContentPage],
  ['/products/jersey', loadDropPage],
  ['/company', loadAboutPage],
]);

export function preloadRoute(href: string) {
  const pathname = href.split(/[?#]/, 1)[0] || '/';
  const loader = routeLoaders.get(pathname);
  if (loader) void loader();
}
