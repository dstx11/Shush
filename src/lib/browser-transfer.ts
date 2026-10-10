/** User-initiated transfers only; unsupported/blocked APIs have visible fallbacks. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch { return false; }
}

export async function shareUrl(url: string, title: string): Promise<'shared' | 'copied' | 'cancelled' | 'manual'> {
  if (navigator.share) {
    try { await navigator.share({ url, title }); return 'shared'; }
    catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'; }
  }
  return await copyText(url) ? 'copied' : 'manual';
}

export function downloadText(content: string, filename: string, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
