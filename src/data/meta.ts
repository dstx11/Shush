export type RouteMetadata = {
  title: string;
  description: string;
  image?: string;
};

export const siteUrl = 'https://shush.pt';

export const defaultMetadata: RouteMetadata = {
  title: 'SHUSH — Sem barulho. Só rounds.',
  description: 'SHUSH reúne Valorant Premier, roster, creators e o Drop 01 numa identidade própria.',
  image: '/og-shush.png',
};

export const routeMetadata: Record<string, RouteMetadata> = {
  '/': defaultMetadata,
  '/esports/valorant/premier': {
    title: 'Premier — SHUSH',
    description: 'Match Center da SHUSH com estado da fase, pontuação, calendário e resultados publicados.',
  },
  '/esports/valorant/roster': {
    title: 'Roster — SHUSH',
    description: 'Roster Valorant da SHUSH com jogadores públicos, funções e links confirmados.',
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
