export type RouteMetadata = {
  title: string;
  description: string;
  image?: string;
};

export const siteUrl = 'https://shush.pt';

export const defaultMetadata: RouteMetadata = {
  title: 'SHUSH — Sem barulho. Só rounds.',
  description: 'SHUSH é um grupo gaming focado em Valorant, creators e identidade própria.',
  image: '/og-shush.png',
};

export const routeMetadata: Record<string, RouteMetadata> = {
  '/': defaultMetadata,
  '/roster': {
    title: 'Roster — SHUSH',
    description: 'Roster público da SHUSH com jogadores, funções e presença de equipa.',
  },
  '/drop-01': {
    title: 'Drop 01 — SHUSH',
    description: 'Drop 01 da SHUSH: jersey, frente e verso, com personalização de nick, número e tamanho.',
    image: '/assets/jersey/frontjersey.webp',
  },
  '/about': {
    title: 'About — SHUSH',
    description: 'A SHUSH em poucas linhas: gaming, Valorant, creators, identidade e partner técnico.',
  },
};
