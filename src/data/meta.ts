export type RouteMetadata = {
  title: string;
  description: string;
  image?: string;
};

export const siteUrl = 'https://shush.pt';

export const defaultMetadata: RouteMetadata = {
  title: 'SHUSH — Equipa de VALORANT e esports',
  description: 'SHUSH: equipa de VALORANT, partidas Premier e creators. Conhece os sete jogadores, acompanha os resultados e personaliza a camisola Drop 01.',
  image: '/og-shush.png',
};

export const routeMetadata: Record<string, RouteMetadata> = {
  '/': defaultMetadata,
  '/esports/valorant/premier': {
    title: 'VALORANT Premier: partidas e resultados — SHUSH',
    description: 'Partidas Premier da SHUSH com adversários, mapas e resultados verificados. Fontes e data de verificação em cada registo.',
  },
  '/esports/valorant/roster': {
    title: 'Jogadores de VALORANT — SHUSH',
    description: 'DSTX, More, Th0maz, Lyel, TZ, Levi e Catty: conhece o roster de VALORANT da SHUSH, as funções e os perfis Competitive no Tracker.gg.',
  },
  '/content': {
    title: 'Creators: More e Th0maz — SHUSH',
    description: 'More na Twitch e Th0maz no YouTube. Acompanha os creators da SHUSH e conhece-os no roster.',
  },
  '/products/jersey': {
    title: 'Camisola SHUSH Drop 01 — Personalização',
    description: 'Personaliza a camisola SHUSH Drop 01 com nome e número. Explora a frente e as costas, guarda o rascunho e prepara o resumo do pedido manual.',
    image: '/assets/jersey/frontjersey.webp',
  },
  '/company': {
    title: 'Sobre a SHUSH — A equipa e a nossa história',
    description: 'A história da SHUSH: um grupo de amigos, a vontade de competir e uma identidade construída em conjunto.',
  },
};
