/** Only explicit web/contact schemes or local paths may become navigation links. */
export function safeNavigationHref(href: string): string | undefined {
  if (!href || /[\u0000-\u0020\u007f\\]/u.test(href)) return undefined;
  if (href.startsWith('//')) return undefined;
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) return href;
  try {
    const url = new URL(href);
    if (!['https:', 'mailto:', 'tel:'].includes(url.protocol) || url.username || url.password) return undefined;
    return href;
  } catch { return undefined; }
}
