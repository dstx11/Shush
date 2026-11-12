type SegmenterConstructor = new (locale: string, options: { granularity: 'grapheme' }) => { segment(text: string): Iterable<{ segment: string }> };
const NativeSegmenter = (Intl as unknown as { Segmenter?: SegmenterConstructor }).Segmenter;
const segmenter = NativeSegmenter ? new NativeSegmenter('pt-PT', { granularity: 'grapheme' }) : null;

/** Native graphemes where available; fallback preserves common marks and emoji joins. */
export function graphemes(text: string): string[] {
  if (segmenter) return Array.from(segmenter.segment(text), (part) => part.segment);
  const result: string[] = [];
  for (const point of Array.from(text)) {
    const previous = result[result.length - 1];
    const joins = /\p{Mark}|\uFE0F|\u200D|[\u{1F3FB}-\u{1F3FF}]/u.test(point) || previous?.endsWith('\u200D');
    const flagPair = /[\u{1F1E6}-\u{1F1FF}]/u.test(point) && previous && Array.from(previous).length === 1 && /[\u{1F1E6}-\u{1F1FF}]/u.test(previous);
    if (previous && (joins || flagPair)) result[result.length - 1] += point;
    else result.push(point);
  }
  return result;
}

/** Bound graphemes and code units; strip controls, bidi overrides and lone surrogates. */
export function sanitizeText(text: string, limit: number) {
  const clean = Array.from(text.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069\uFFFD]/g, '')).filter((point) => !(point.length === 1 && /[\uD800-\uDFFF]/.test(point))).join('').normalize('NFC');
  let result = '';
  for (const cluster of graphemes(clean).slice(0, limit)) {
    if (result.length + cluster.length > limit * 16) break;
    result += cluster;
  }
  return result;
}

