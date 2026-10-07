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

export const navItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'roster', label: 'Roster', href: '/roster' },
  { id: 'drop', label: 'Drop 01', href: '/drop-01' },
  { id: 'about', label: 'About', href: '/about' },
] satisfies NavGroup[];

/**
 * Kept as an alias while older, unlinked route components remain in the
 * repository. Public navigation is intentionally limited to four areas.
 */
export const navGroups: NavGroup[] = navItems;

export const footerLinks = navItems.map(({ label, href }) => ({ label, href }));
