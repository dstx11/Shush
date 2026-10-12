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
  },
  {
    id: 'th0maz7',
    displayName: 'Th0maz',
    initials: 'TH',
    number: '07',
    size: 'M',
    portraitPosition: '50% 25%',
    roles: ['Iniciador', 'Controlador'],
    isCreator: true,
    creatorType: 'youtube',
    creatorUrl: 'https://www.youtube.com/@Th0maaz_7',
    avatar: '/assets/avatars/tomas.webp',
  },
  {
    id: 'lyel',
    displayName: 'Lyel',
    initials: 'LY',
    number: '16',
    size: 'XXL',
    portraitPosition: '50% 25%',
    roles: ['Iniciador', 'Flex'],
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
    avatar: '/assets/avatars/catarina.webp',
  },

];

export const creators = players.filter((player) => player.isCreator && player.creatorUrl);

export const rosterIndex = (id: string) => String(players.findIndex(player => player.id === id) + 1).padStart(2, '0');
export const playerDropUrl = (player: Player) => `/products/jersey?${new URLSearchParams({ drop: '1', nick: player.displayName, number: player.number, size: player.size })}`;
