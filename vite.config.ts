import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defaultMetadata, routeMetadata, siteUrl } from './src/data/meta';
import { players } from './src/data/players';
import { activePremierSeason } from './src/data/season';


function validateStaticData() {
  const errors: string[] = [];
  const playerIds = new Set<string>();
  const playerNumbers = new Set<string>();

  for (const player of players) {
    if (playerIds.has(player.id)) errors.push(`duplicate player id: ${player.id}`);
    playerIds.add(player.id);

    if (playerNumbers.has(player.number)) errors.push(`duplicate player number: ${player.number}`);
    playerNumbers.add(player.number);

    if (player.isCreator && (!player.creatorType || !player.creatorUrl)) {
      errors.push(`creator ${player.id} is missing creatorType or creatorUrl`);
    }

    if (player.creatorUrl && !isHttpsUrl(player.creatorUrl)) {
      errors.push(`creator ${player.id} has a non-HTTPS URL`);
    }
  }

  const weekIds = new Set<string>();
  const dayIds = new Set<string>();
  const resultIds = new Set<string>();

  for (const week of activePremierSeason.weeks) {
    if (weekIds.has(week.id)) errors.push(`duplicate Premier week id: ${week.id}`);
    weekIds.add(week.id);

    for (const playerId of week.convocados) {
      if (!playerIds.has(playerId)) errors.push(`week ${week.id} references unknown player: ${playerId}`);
    }

    for (const stream of week.streams) {
      if (!playerIds.has(stream.playerId)) errors.push(`week ${week.id} stream references unknown player: ${stream.playerId}`);
      if (!isHttpsUrl(stream.url)) errors.push(`week ${week.id} has a non-HTTPS stream URL`);
    }

    for (const day of week.selectedDays) {
      if (dayIds.has(day.id)) errors.push(`duplicate Premier day id: ${day.id}`);
      dayIds.add(day.id);

      if (!isDate(day.date)) errors.push(`invalid Premier date: ${day.date}`);
      if (!isTime(day.windowStart) || !isTime(day.windowEnd)) {
        errors.push(`invalid Premier time window in ${day.id}`);
      }
    }
  }

  for (const result of [...activePremierSeason.results, ...activePremierSeason.playoffResults]) {
    if (resultIds.has(result.id)) errors.push(`duplicate result id: ${result.id}`);
    resultIds.add(result.id);
    if (!isDate(result.date)) errors.push(`invalid result date: ${result.date}`);
  }

  if (activePremierSeason.qualificationPoints <= 0) errors.push('qualificationPoints must be positive');
  if (activePremierSeason.winPoints < 0 || activePremierSeason.lossPoints < 0) {
    errors.push('Premier result points cannot be negative');
  }

  if (!isDate(activePremierSeason.playoffsDate)) errors.push('invalid playoffsDate');
  if (!isTime(activePremierSeason.playoffsWindowStart) || !isTime(activePremierSeason.playoffsWindowEnd)) {
    errors.push('invalid playoffs time window');
  }

  try {
    new Intl.DateTimeFormat('en', { timeZone: activePremierSeason.timezone }).format();
  } catch {
    errors.push(`invalid Premier timezone: ${activePremierSeason.timezone}`);
  }

  if (errors.length) {
    throw new Error(`SHUSH static data validation failed:\n- ${errors.join('\n- ')}`);
  }
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

validateStaticData();

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[char] ?? char;
  });
}

function setMeta(html: string, attribute: 'name' | 'property', key: string, value: string) {
  const marker = `<meta ${attribute}="${key}" content="`;
  const start = html.indexOf(marker);
  if (start < 0) return html;

  const valueStart = start + marker.length;
  const valueEnd = html.indexOf('"', valueStart);
  if (valueEnd < 0) return html;

  return html.slice(0, valueStart) + escapeHtml(value) + html.slice(valueEnd);
}

function staticRouteMetadata(): Plugin {
  return {
    name: 'shush-static-route-metadata',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const indexAsset = bundle['index.html'];
      if (!indexAsset || indexAsset.type !== 'asset') return;

      const source =
        typeof indexAsset.source === 'string'
          ? indexAsset.source
          : new TextDecoder().decode(indexAsset.source);

      for (const [route, metadata] of Object.entries(routeMetadata)) {
        if (route === '/') continue;

        const canonical = `${siteUrl}${route}`;
        const imagePath = metadata.image ?? defaultMetadata.image ?? '/og-shush.png';
        const image = imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath}`;

        let html = source
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/>/,
            `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
          );

        html = setMeta(html, 'name', 'description', metadata.description);
        html = setMeta(html, 'name', 'robots', 'index,follow');
        html = setMeta(html, 'property', 'og:title', metadata.title);
        html = setMeta(html, 'property', 'og:description', metadata.description);
        html = setMeta(html, 'property', 'og:url', canonical);
        html = setMeta(html, 'property', 'og:image', image);
        html = setMeta(html, 'property', 'og:image:alt', metadata.title);
        html = setMeta(html, 'name', 'twitter:title', metadata.title);
        html = setMeta(html, 'name', 'twitter:description', metadata.description);
        html = setMeta(html, 'name', 'twitter:image', image);
        html = setMeta(html, 'name', 'twitter:image:alt', metadata.title);

        if (route !== '/products/jersey') {
          html = html.replace(
            /\s*<link rel="preload" as="image" href="\/assets\/jersey\/frontjersey\.webp"[^>]*\/>/,
            '',
          );
        }

        this.emitFile({
          type: 'asset',
          fileName: `${route.slice(1)}.html`,
          source: html,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), staticRouteMetadata()],
});
