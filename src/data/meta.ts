export type RouteMetadata = {
  title: string;
  description: string;
  image?: string;
};

export const siteUrl = 'https://shush.pt';

export const defaultMetadata: RouteMetadata = {
  title: 'SHUSH — Gaming, Premier e Creators',
  description: 'SHUSH é um grupo gaming, esports e entertainment focado em Valorant Premier, creators e jersey/clothing.',
  image: '/og-shush.png',
};

export const routeMetadata: Record<string, RouteMetadata> = {
  '/': defaultMetadata,
  '/esports': {
    title: 'SHUSH Esports',
    description: 'Mapa competitivo da SHUSH: Valorant Premier, roster, calendário e resultados publicados.',
  },
  '/esports/valorant': {
    title: 'SHUSH Valorant',
    description: 'Valorant é o lobby competitivo da SHUSH, com Premier, roster e resultados públicos.',
  },
  '/esports/valorant/premier': {
    title: 'SHUSH Premier Calendar',
    description: 'Calendário Premier, score, próxima janela e convocados da SHUSH.',
  },
  '/esports/valorant/roster': {
    title: 'SHUSH Valorant Roster',
    description: 'Roster Valorant da SHUSH com jogadores públicos e roles.',
  },
  '/esports/valorant/results': {
    title: 'SHUSH Results',
    description: 'Últimos jogos publicados pela SHUSH.',
  },
  '/esports/valorant/tournaments': {
    title: 'SHUSH Tournament Results',
    description: 'Fechos de seasons e torneios quando houver resultado confirmado.',
  },
  '/content': {
    title: 'SHUSH Content',
    description: 'Creators da SHUSH: More na Twitch e Th0maz7 no YouTube.',
  },
  '/content/more': {
    title: 'More — SHUSH Creator',
    description: 'More, creator SHUSH na Twitch.',
  },
  '/content/th0maz7': {
    title: 'Th0maz7 — SHUSH Creator',
    description: 'Th0maz7, creator SHUSH no YouTube.',
  },
  '/products': {
    title: 'SHUSH Products',
    description: 'Jersey / Clothing da SHUSH e pedido manual.',
  },
  '/products/jersey': {
    title: 'SHUSH Jersey / Clothing',
    description: 'Showcase da jersey SHUSH em preto e roxo.',
  },
  '/products/jersey/custom': {
    title: 'SHUSH Jersey Customização',
    description: 'Pedido manual da jersey SHUSH com nick, número, tamanho e frase opcional.',
  },
  '/company': {
    title: 'SHUSH Company',
    description: 'Sobre a SHUSH: gaming, esports, creators e identidade própria.',
  },
  '/company/partners': {
    title: 'SHUSH Partners',
    description: 'Backora como partner técnico/digital da SHUSH.',
  },
  '/company/contact': {
    title: 'SHUSH Contact',
    description: 'Contacto direto da SHUSH, a atualizar.',
  },
};
