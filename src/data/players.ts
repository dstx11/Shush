export type Player = {
  id: string;
  displayName: string;
  initials: string;
  number: string;
  roles: string[];
  status?: string;
  avatar?: string;
  trackerUrl?: string;
  trackerScore?: number;
  isCreator?: boolean;
  creatorType?: 'twitch' | 'youtube';
  creatorUrl?: string;
  quote: string;
  focus: string;
};

export const players: Player[] = [
  {
    id: 'dstx',
    displayName: 'dstx',
    initials: 'DX',
    number: '01',
    roles: ['Duelista', 'Controlador'],
    quote: 'Entrada direta, controlo quando o round pede.',
    focus: 'Pressao',
    avatar: '/assets/avatars/delcio.webp',
  },
  {
    id: 'more',
    displayName: 'More',
    initials: 'MR',
    number: '02',
    roles: ['Sentinela', 'Iniciador'],
    isCreator: true,
    creatorType: 'twitch',
    creatorUrl: 'https://www.twitch.tv/kadimba13',
    quote: 'Leitura calma, espaco bem fechado.',
    focus: 'Controlo',
  },
  {
    id: 'th0maz7',
    displayName: 'Th0maz7',
    initials: 'T7',
    number: '03',
    roles: ['Iniciador', 'Controlador'],
    isCreator: true,
    creatorType: 'youtube',
    creatorUrl: 'https://www.youtube.com/@Th0maaz_7',
    quote: 'Utilidade certa antes do contacto.',
    focus: 'Setup',
    avatar: '/assets/avatars/tomas.webp',
  },
  {
    id: 'lyel',
    displayName: 'lyel',
    initials: 'LY',
    number: '04',
    roles: ['Iniciador', 'Flex'],
    quote: 'Energia solta, decisao no momento certo.',
    focus: 'Ritmo',
    avatar: '/assets/avatars/lyel.webp',
  },
  {
    id: 'tz',
    displayName: 'tz',
    initials: 'TZ',
    number: '05',
    roles: ['Flex'],
    quote: 'Adapta o round sem chamar atencao.',
    focus: 'Flex',
    avatar: '/assets/avatars/tz.webp',
  },
  {
    id: 'catty',
    displayName: 'Catty',
    initials: 'CT',
    number: '06',
    roles: ['Controlador'],
    quote: 'Fumo limpo, timing certo, equipa organizada.',
    focus: 'Utilidade',
    avatar: '/assets/avatars/catarina.webp',
  },
  {
    id: 'craquinho',
    displayName: 'Craquinho',
    initials: 'CR',
    number: '07',
    roles: ['Duelista', 'Flex'],
    quote: 'Contacto frontal com cobertura para mudar.',
    focus: 'Entrada',
  },
  {
    id: 'levi',
    displayName: 'Levi',
    initials: 'LV',
    number: '08',
    roles: ['Duelista'],
    quote: 'Pressao simples, round sem ruidao extra.',
    focus: 'Abertura',
    avatar: '/assets/avatars/levi.webp',
  },
];

export const creators = players.filter((player) => player.isCreator && player.creatorUrl);
