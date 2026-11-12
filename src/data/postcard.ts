export type Edition = 'evergreen' | 'midnight' | 'aurora';

export const editions: Record<Edition, { label: string; background: string; secondary: string; highlight: string; green: string; glow: string }> = {
  evergreen: { label: 'Natal clássico', background: '#101f20', secondary: '#285347', highlight: '#efd3a0', green: '#386c53', glow: '#ffda9e' },
  midnight: { label: 'Noite de inverno', background: '#0b1825', secondary: '#24445e', highlight: '#c6e7fb', green: '#457a8e', glow: '#b2dfff' },
  aurora: { label: 'SHUSH glow', background: '#171324', secondary: '#3c2a61', highlight: '#ddc9fb', green: '#547e79', glow: '#e2b9ff' },
};

