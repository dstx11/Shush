export const dropSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type DropSize = typeof dropSizes[number];
export type DropConfig = { nick: string; number: string; size: DropSize; phrase: string };
export const defaultDropConfig: Readonly<DropConfig> = Object.freeze({ nick: 'SHUSH', number: '01', size: 'M', phrase: '' });
export const dropDraftKey = 'shush:drop01:draft:v1';
const configKeys = ['nick', 'number', 'size', 'phrase'] as const;

import { sanitizeText as sanitizeDropText } from './text';
export { graphemes, sanitizeText as sanitizeDropText } from './text';

export function sanitizeDropConfig(raw: Partial<Record<keyof DropConfig, unknown>>): { config: DropConfig; corrected: boolean } {
  const config = { ...defaultDropConfig };
  let corrected = false;
  for (const key of configKeys) {
    const value = raw[key];
    if (value === undefined) continue;
    if (typeof value !== 'string') { corrected = true; continue; }
    if (key === 'nick' || key === 'phrase') {
      const safe = sanitizeDropText(value, key === 'nick' ? 14 : 44);
      config[key] = key === 'nick' ? safe.trim() || defaultDropConfig.nick : safe.trim();
      if (config[key] !== value) corrected = true;
    } else if (key === 'number') {
      if (/^\d{1,2}$/.test(value)) config.number = value.padStart(2, '0');
      else corrected = true;
    } else if ((dropSizes as readonly string[]).includes(value)) config.size = value as DropSize;
    else corrected = true;
  }
  return { config, corrected };
}

export function readDropConfig(params: URLSearchParams) {
  const hasConfig = params.has('drop') || configKeys.some((key) => params.has(key));
  if (!hasConfig) return { config: { ...defaultDropConfig }, corrected: false, shared: false };
  if (params.get('drop') !== '1' || params.getAll('drop').length !== 1 || params.toString().length > 8192) {
    return { config: { ...defaultDropConfig }, corrected: true, shared: true };
  }
  const raw: Partial<Record<keyof DropConfig, unknown>> = {};
  let duplicate = false;
  for (const key of configKeys) {
    if (!params.has(key)) continue;
    if (params.getAll(key).length !== 1) { duplicate = true; raw[key] = null; }
    else raw[key] = params.get(key);
  }
  const result = sanitizeDropConfig(raw);
  return { ...result, corrected: result.corrected || duplicate, shared: true };
}

export function buildDropUrl(config: DropConfig, origin: string) {
  const url = new URL('/products/jersey', origin);
  const safe = sanitizeDropConfig({ ...config, nick: config.nick || 'SHUSH', number: config.number || '00' }).config;
  url.searchParams.set('drop', '1');
  for (const key of configKeys) url.searchParams.set(key, safe[key]);
  return url.href;
}

export function dropSummary(config: DropConfig) {
  return ['SHUSH — Drop 01', 'Nick: ' + (config.nick.trim() || 'SHUSH'), 'Número: ' + (config.number || '00').padStart(2, '0'), 'Tamanho: ' + config.size, 'Frase: ' + (config.phrase.trim() || '—'), 'Pedido manual.'].join('\n');
}

export function readDropDraft(serialized: string) {
  if (serialized.length > 8192) return null;
  try {
    const draft: unknown = JSON.parse(serialized);
    if (!draft || typeof draft !== 'object' || !('version' in draft) || draft.version !== 1 || !('config' in draft) || !draft.config || typeof draft.config !== 'object') return null;
    const raw = draft.config as Partial<Record<keyof DropConfig, unknown>>;
    if (!configKeys.every((key) => typeof raw[key] === 'string')) return null;
    const result = sanitizeDropConfig(raw);
    return result.corrected ? null : result.config;
  } catch { return null; }
}
