import { navItems } from '../../data/nav';

export function Footer() {
  return (
    <footer className="relative px-5 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 pt-8 text-sm text-shush-muted lg:flex-row lg:items-center lg:justify-between">
        <div>
          <strong className="block text-shush-text">SHUSH</strong>
          <span>Uma jersey. Um roster. Sem fingir ser mais.</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition hover:border-shush-purpleGlow/40 hover:text-shush-text">
              {item.label}
            </a>
          ))}
          <a
            href="https://backora.org/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 transition hover:border-shush-purpleGlow/40 hover:text-shush-text"
          >
            <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" className="h-5 w-auto" loading="lazy" />
            <span>Backora</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
