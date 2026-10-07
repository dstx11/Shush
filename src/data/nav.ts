export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'premier', label: 'Premier', href: '/esports/valorant/premier' },
  { id: 'roster', label: 'Roster', href: '/esports/valorant/roster' },
  { id: 'creators', label: 'Creators', href: '/content' },
  { id: 'drop', label: 'Drop 01', href: '/products/jersey' },
  { id: 'about', label: 'About', href: '/company' },
];

export const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Premier', href: '/esports/valorant/premier' },
  { label: 'Roster', href: '/esports/valorant/roster' },
  { label: 'Creators', href: '/content' },
  { label: 'Drop 01', href: '/products/jersey' },
  { label: 'About', href: '/company' },
];
