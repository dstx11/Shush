export type Player = {
  id: string;
  displayName: string;
  initials: string;
  number: string;
  size: 'M' | 'XXL';
  portraitPosition: string;
  roles: string[];
  status?: string;
  avatar?: string;
  isCreator?: boolean;
  creatorType?: 'twitch' | 'youtube';
  creatorUrl?: string;
  quote: string;
  focus: string;
  agents?: string[];
  sensitivity?: string;
  equipment?: string;
};

export const players: Player[] = [
  {
    id: 'dstx',
    displayName: 'DSTX',
    initials: 'DX',
    number: '11',
    size: 'M',
    portraitPosition: '50% 25%',
    roles: ['Duelista', 'Controlador'],
    quote: 'Entrada direta, controlo quando o round pede.',
    focus: 'Pressão',
    avatar: '/assets/avatars/delcio.webp',
  },
  {
    id: 'more',
    displayName: 'More',
    initials: 'MR',
    avatar: '/assets/avatars/more.webp',
    number: '13',
    size: 'M',
    portraitPosition: '50% 25%',
    roles: ['Sentinela', 'Iniciador'],
    isCreator: true,
    creatorType: 'twitch',
    creatorUrl: 'https://www.twitch.tv/kandimba13',
    quote: 'Leitura calma, espaço bem fechado.',
    focus: 'Controlo',
  },
  {
    id: 'th0maz7',
    displayName: 'Th0maz7',
    initials: 'T7',
    number: '07',
    size: 'M',
    portraitPosition: '50% 25%',
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
    displayName: 'Lyel',
    initials: 'LY',
    number: '14',
    size: 'XXL',
    portraitPosition: '50% 25%',
    roles: ['Iniciador', 'Flex'],
    quote: 'Energia solta, decisão no momento certo.',
    focus: 'Ritmo',
    avatar: '/assets/avatars/lyel.webp',
  },
  {
    id: 'tz',
    displayName: 'TZ',
    initials: 'TZ',
    number: '10',
    size: 'M',
    portraitPosition: '50% 25%',
    roles: ['Flex'],
    quote: 'Adapta o round sem chamar atenção.',
    focus: 'Flex',
    avatar: '/assets/avatars/tz.webp',
  },
  {
    id: 'levi',
    displayName: 'Levi',
    initials: 'LV',
    number: '09',
    size: 'M',
    portraitPosition: '50% 25%',
    roles: ['Duelista'],
    quote: 'Pressão simples, round sem ruído extra.',
    focus: 'Abertura',
    avatar: '/assets/avatars/levi.webp',
  },
  {
    id: 'catty',
    displayName: 'Catty',
    initials: 'CT',
    number: '20',
    size: 'M',
    portraitPosition: '50% 25%',
    roles: ['Controlador'],
    quote: 'Fumo limpo, timing certo, equipa organizada.',
    focus: 'Utilidade',
    avatar: '/assets/avatars/catarina.webp',
  },

];

export const creators = players.filter((player) => player.isCreator && player.creatorUrl);

export const rosterIndex = (id: string) => String(players.findIndex(player => player.id === id) + 1).padStart(2, '0');
export const playerDropUrl = (player: Player) => `/products/jersey?${new URLSearchParams({ drop: '1', nick: player.displayName, number: player.number, size: player.size })}`;
