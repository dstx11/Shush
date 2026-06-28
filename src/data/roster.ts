export type Player = {
  name: string;
  initials: string;
  number: string;
  roles: string[];
  status?: string;
  quote: string;
  focus: string;
  avatar?: string;
};

export const players: Player[] = [
  {
    name: 'Tiago',
    initials: 'TG',
    number: '02',
    roles: ['Sentinela', 'Iniciador'],
    status: 'IGL',
    quote: 'IGL da equipa, responsável por estrutura, leitura e ritmo.',
    focus: 'Organização',
  },
  {
    name: 'Délcio',
    initials: 'DL',
    number: '01',
    roles: ['Flex'],
    quote: 'Flex no roster, adapta-se ao ritmo da equipa e cobre o que o round pede.',
    focus: 'Adaptação',
    avatar: '/assets/avatars/delcio.webp',
  },
  {
    name: 'Tomás',
    initials: 'TM',
    number: '03',
    roles: ['Iniciador', 'Duelista'],
    quote: 'Contacto criado sem perder intenção.',
    focus: 'Abertura',
    avatar: '/assets/avatars/tomas.webp',
  },
  {
    name: 'Lyel',
    initials: 'LY',
    number: '05',
    roles: ['Flex'],
    quote: 'Energia solta, foco quando o round aperta.',
    focus: 'Ritmo',
    avatar: '/assets/avatars/lyel.webp',
  },
  {
    name: 'Tz',
    initials: 'TZ',
    number: '04',
    roles: ['Duelista', 'Sentinela'],
    quote: 'Presença discreta, impacto claro.',
    focus: 'Impacto',
    avatar: '/assets/avatars/tz.webp',
  },
  {
    name: 'Levi',
    initials: 'LV',
    number: '06',
    roles: ['Duelista'],
    quote: 'Pressão frontal sem ruído extra.',
    focus: 'Entrada',
    avatar: '/assets/avatars/levi.webp',
  },
  {
    name: 'Craquinho',
    initials: 'CR',
    number: '07',
    roles: ['Duelista', 'Smoker'],
    quote: 'Entrada e cobertura no mesmo sistema.',
    focus: 'Cobertura',
  },
  {
    name: 'Catarina',
    initials: 'CT',
    number: '08',
    roles: ['Smoker', 'Iniciador'],
    quote: 'Call limpa, utilidade certa, round com direção.',
    focus: 'Utilidade',
    avatar: '/assets/avatars/catarina.webp',
  },
];
