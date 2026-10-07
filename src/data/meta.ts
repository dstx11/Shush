export type RouteMetadata = {
  title: string;
  description: string;
  image?: string;
};

export const siteUrl = 'https://shush.pt';

export const defaultMetadata: RouteMetadata = {
  title: 'SHUSH — Sem barulho. Só rounds.',
  description: 'SHUSH é uma micro-org gaming focada em Valorant Premier, creators e identidade própria.',
  image: '/og-shush.png',
};

export const routeMetadata: Record<string, RouteMetadata> = {
  '/': defaultMetadata,
  '/esports/valorant/premier': {
    title: 'Premier — SHUSH',
    description: 'Match Center da SHUSH com estado da season, score, calendário e resultados publicados.',
  },
  '/esports/valorant/roster': {
    title: 'Roster — SHUSH',
    description: 'Roster Valorant da SHUSH com jogadores públicos, roles e links confirmados.',
  },
  '/content': {
    title: 'Creators — SHUSH',
    description: 'Canais oficiais dos creators ligados à SHUSH.',
  },
  '/products/jersey': {
    title: 'Drop 01 — SHUSH',
    description: 'Drop 01 da SHUSH: jersey em preto e roxo com pré-visualização de personalização.',
    image: '/assets/jersey/frontjersey.webp',
  },
  '/company': {
    title: 'About — SHUSH',
    description: 'A SHUSH: Valorant Premier, creators, Drop 01 e identidade própria.',
  },
};
