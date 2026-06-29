export type NavSubItem = {
  label: string;
  href: string;
  description: string;
};

export type NavGroup = {
  id: string;
  label: string;
  href: string;
  items?: NavSubItem[];
};

export const navGroups: NavGroup[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'esports',
    label: 'Esports',
    href: '/esports',
    items: [
      { label: 'Overview', href: '/esports', description: 'Mapa competitivo.' },
      { label: 'Valorant', href: '/esports/valorant', description: 'Divisão ativa.' },
      { label: 'Premier', href: '/esports/valorant/premier', description: 'Calendário, score e próxima janela.' },
      { label: 'Roster', href: '/esports/valorant/roster', description: 'Lineup e roles.' },
      { label: 'Results', href: '/esports/valorant/results', description: 'Últimos jogos.' },
      { label: 'Tournament Results', href: '/esports/valorant/tournaments', description: 'Fechos de seasons e torneios.' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    href: '/content',
    items: [
      { label: 'Overview', href: '/content', description: 'Creators da SHUSH.' },
      { label: 'More', href: '/content/more', description: 'Twitch.' },
      { label: 'Th0maz7', href: '/content/th0maz7', description: 'YouTube.' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    items: [
      { label: 'Overview', href: '/products', description: 'Jersey / Clothing.' },
      { label: 'Jersey', href: '/products/jersey', description: 'Showcase da jersey.' },
      { label: 'Customização', href: '/products/jersey/custom', description: 'Pedido manual.' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    href: '/company',
    items: [
      { label: 'About', href: '/company', description: 'SHUSH em poucas linhas.' },
      { label: 'Partners', href: '/company/partners', description: 'Backora e parceiros.' },
      { label: 'Contact', href: '/company/contact', description: 'Contacto direto.' },
    ],
  },
];

export const navItems = navGroups.map(({ label, href }) => ({ label, href }));

export const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Premier', href: '/esports/valorant/premier' },
  { label: 'Roster', href: '/esports/valorant/roster' },
  { label: 'Jersey', href: '/products/jersey' },
  { label: 'Contacto', href: '/company/contact' },
];
