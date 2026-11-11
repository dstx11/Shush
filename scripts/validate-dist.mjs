import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');

const routeFiles = [
  ['esports/valorant/premier.html', 'https://shush.pt/esports/valorant/premier', 'VALORANT Premier: partidas e resultados — SHUSH'],
  ['esports/valorant/roster.html', 'https://shush.pt/esports/valorant/roster', 'Jogadores de VALORANT — SHUSH'],
  ['content.html', 'https://shush.pt/content', 'Creators: More e Th0maz — SHUSH'],
  ['products/jersey.html', 'https://shush.pt/products/jersey', 'Camisola SHUSH Drop 01 — Personalização'],
  ['company.html', 'https://shush.pt/company', 'Sobre a SHUSH — A equipa e a nossa história'],
];

const requiredFiles = [
  'index.html',
  '404.html',
  '_headers',
  '_redirects',
  'robots.txt',
  'sitemap.xml',
  'og-shush.png',
  'assets/brand/favicon.png',
  'assets/brand/shush-logo.webp',
  'assets/jersey/frontjersey.webp',
  'assets/jersey/backjersey.webp',
  ...routeFiles.map(([path]) => path),
];

const failures = [];

for (const path of requiredFiles) {
  try {
    await access(join(dist, path), constants.R_OK);
  } catch {
    failures.push(`Missing dist/${path}`);
  }
}

const index = await readText('index.html');
// Lazy route styles must be available to the prerender even without JavaScript.
const manifest = JSON.parse(await readText('.vite/manifest.json'));
const lobbyStyles = manifest['src/pages/HomePage.tsx']?.css ?? [];
if (!lobbyStyles.length) failures.push('Missing Home route stylesheet in manifest');
for (const css of lobbyStyles) {
  expect(index, `href="/${css}"`, 'Home static route stylesheet');
  await access(join(dist, css), constants.R_OK);
  for (const [path] of routeFiles) {
    if ((await readText(path)).includes(`href="/${css}"`)) failures.push(`Home-only CSS linked on ${path}`);
  }
}
const notFound = await readText('404.html');
const redirects = await readText('_redirects');
const headers = await readText('_headers');
const robots = await readText('robots.txt');
const sitemap = await readText('sitemap.xml');

expect(index, '<h1', 'prerendered Home heading');
expect(index, 'Quem está no lobby.', 'prerendered Home content');
expect(index, '<html lang="pt-PT">', 'index.html lang');
expect(index, '<meta name="robots" content="index,follow,max-image-preview:large"', 'index.html robots');
expect(index, 'property="og:image" content="https://shush.pt/og-shush.png"', 'absolute OG image');
expect(index, 'property="og:image:alt" content="SHUSH — Equipa de VALORANT e esports"', 'root OG image alt');
expect(index, 'rel="canonical" href="https://shush.pt"', 'root canonical URL');
// Home chooses three portraits per document. A fixed preload would fetch the
// wrong player on most visits; the selected central image has fetchPriority=high.
if (/rel="preload" as="image" href="\/assets\/avatars\//.test(index)) failures.push('Home must not preload a fixed roster member');

expect(notFound, '<meta name="robots" content="noindex,nofollow"', '404 noindex');
expect(notFound, '<title>404 — SHUSH</title>', '404 title');

for (const [path, canonical, title] of routeFiles) {
  const html = await readText(path);
  expect(html, '<h1', `${path} prerendered heading`);
  expectAbsent(html, 'shush-loading', `${path} unfinished loading shell`);
  expect(html, `<title>${title}</title>`, `${path} title`);
  expect(html, `rel="canonical" href="${canonical}"`, `${path} canonical`);
  expect(html, `property="og:url" content="${canonical}"`, `${path} OG URL`);
  expect(html, `property="og:image:alt" content="${title}"`, `${path} OG image alt`);
  expect(html, `name="twitter:title" content="${title}"`, `${path} Twitter title`);
  expect(html, `name="twitter:image:alt" content="${title}"`, `${path} Twitter image alt`);
  expect(html, '<meta name="robots" content="index,follow,max-image-preview:large"', `${path} robots`);

  // Verify the emitted document's actual entry points, not only public source references.
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
    try {
      await access(join(dist, match[1].slice(1)), constants.R_OK);
    } catch {
      failures.push(`Broken built asset ${match[1]} in ${path}`);
    }
  }
}

for (const route of [
  '/esports /esports/valorant/premier 301',
  '/products /products/jersey 301',
  '/company/partners /company#partners 301',
]) {
  expect(redirects, route, `canonical redirect ${route.split(' ')[0]}`);
}

expectAbsent(redirects, '/index.html 200', 'root SPA rewrite that would bypass route metadata');

expect(headers, 'Content-Security-Policy:', 'CSP header');
expect(headers, "frame-ancestors 'none'", 'CSP frame protection');
for (const policy of [
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy:',
  'Cross-Origin-Opener-Policy: same-origin',
]) expect(headers, policy, policy);
expect(robots, 'Sitemap: https://shush.pt/sitemap.xml', 'robots sitemap');


for (const url of [
  'https://shush.pt/',
  'https://shush.pt/esports/valorant/premier',
  'https://shush.pt/esports/valorant/roster',
  'https://shush.pt/content',
  'https://shush.pt/products/jersey',
  'https://shush.pt/company',
]) {
  expect(sitemap, `<loc>${url}</loc>`, `sitemap route ${url}`);
}

// Audit the built HTML, so crawler metadata cannot silently diverge from React.
const seenTitles = new Set();
const seenDescriptions = new Set();
for (const file of ['index.html', ...routeFiles.map(([path]) => path)]) {
  const html = await readText(file);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (!title || seenTitles.has(title)) failures.push(`${file}: missing/duplicate title`);
  if (!description || seenDescriptions.has(description)) failures.push(`${file}: missing/duplicate description`);
  seenTitles.add(title); seenDescriptions.add(description);
  if ([...html.matchAll(/<h1[\s>]/g)].length !== 1) failures.push(`${file}: expected one H1`);
  const scripts = [...html.matchAll(/<script id="shush-schema" type="application\/ld\+json">(.*?)<\/script>/g)];
  try {
    if (scripts.length !== 1) throw new Error('Expected one schema graph');
    const schema = JSON.parse(scripts[0][1]);
    if (schema['@context']…2797 tokens truncated…beginPath(); ctx.arc(s.x * width, s.y * height, s.size * scale, 0, Math.PI * 2); ctx.fill();
      }

      const drawFlakes = (front: boolean) => {
        for (const flake of scene.flakes) {
          if ((flake.depth > .62) !== front) continue;
          const drift = sin(clock * .65 + flake.phase) * 13 * flake.depth * scale;
          const fall = ((flake.y + clock * flake.speed * (1 + snowfall.current * 2.6)) % 1) * height;
          const x = flake.x * width + drift;
          const size = flake.size * scale * (front ? 1.35 : .7);
          ctx.fillStyle = front ? '#f3fbffad' : '#d8eee68a';
          ctx.beginPath(); ctx.arc(x, fall, size, 0, Math.PI * 2); ctx.fill();
        }
      };
      drawFlakes(false);

      // Snow banks, ground haze and a luminous platform anchor the sculpture.
      ctx.fillStyle = '#c6e2d71b';
      ctx.beginPath(); ctx.ellipse(center, base + 20 * scale, 195 * scale, 39 * scale, 0, 0, Math.PI * 2); ctx.fill();
      for (let ring = 3; ring >= 0; ring--) {
        ctx.strokeStyle = ring % 2 ? '#dcbf8152' : '#b4d9cc47';
        ctx.lineWidth = (ring === 0 ? 2.4 : .85) * scale;
        ctx.beginPath(); ctx.ellipse(center, base + 10 * scale, (112 + ring * 29) * scale, (18 + ring * 5) * scale, 0, 0, Math.PI * 2); ctx.stroke();
      }
      // Tree trunk and tapered silhouette sit behind the full volume of needles.
      ctx.fillStyle = '#563b2c';
      roundRect(ctx, center - 12 * scale, base - 42 * scale, 24 * scale, 47 * scale, 4 * scale); ctx.fill();
      const silhouette = ctx.createLinearGradient(center - treeWidth, 0, center + treeWidth, 0);
      silhouette.addColorStop(0, palette.dimPine[0]);
      silhouette.addColorStop(.5, palette.dimPine[2]);
      silhouette.addColorStop(1, palette.dimPine[0]);
      ctx.fillStyle = silhouette;
      ctx.beginPath();
      ctx.moveTo(center, base - treeHeight * .99);
      ctx.bezierCurveTo(center - treeWidth * .12, base - treeHeight * .84, center - treeWidth * .69, base - treeHeight * .37, center - treeWidth * .89, base - treeHeight * .06);
      ctx.quadraticCurveTo(center, base + 2 * scale, center + treeWidth * .89, base - treeHeight * .06);
      ctx.bezierCurveTo(center + treeWidth * .7, base - treeHeight * .37, center + treeWidth * .12, base - treeHeight * .84, center, base - treeHeight * .99);
      ctx.fill();

      const prepared = scene.branches.map(branch => ({ branch, depth: sin(branch.angle + rot) * branch.length }));
      prepared.sort((a, b) => a.depth - b.depth);
      for (const { branch, depth } of prepared) {
        const angle = branch.angle;
        const start = project(.04, branch.y, angle);
        const tip = project(branch.length, branch.y - branch.drop, angle);
        const facing = depth > 0;
        const shade = branch.shade;
        const material = facing ? palette.pine : palette.dimPine;
        ctx.strokeStyle = material[shade];
        ctx.lineCap = 'round';
        ctx.lineWidth = (facing ? 2.3 : 1.7) * scale;
        ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.quadraticCurveTo(
          (start.x + tip.x) / 2, (start.y + tip.y) / 2 - 7 * scale, tip.x, tip.y
        ); ctx.stroke();

        // Fir fronds: each stem has real needle pairs and a soft frost edge.
        for (let k = 1; k < 17; k++) {
          const t = k / 18;
          const mid = project(branch.length * t, branch.y - branch.drop * t + .012 * sin(t * Math.PI), angle);
          const needleLength = branch.length * (.12 + .12 * (1 - t)) * (1 - t * .24);
          const lift = .014 + .018 * (1 - t);
          const l = project(branch.length * t + needleLength * .08, branch.y - branch.drop * t + lift, angle - .24 - .44 * (1 - t));
          const r = project(branch.length * t + needleLength * .08, branch.y - branch.drop * t + lift, angle + .24 + .44 * (1 - t));
          ctx.strokeStyle = material[(shade + k % 3) % 5];
          ctx.lineWidth = (facing ? 1.5 : 1.05) * scale;
          ctx.beginPath(); ctx.moveTo(mid.x, mid.y); ctx.lineTo(l.x, l.y);
          ctx.moveTo(mid.x, mid.y); ctx.lineTo(r.x, r.y); ctx.stroke();
        }
        if (branch.frost && facing && branch.y > .19) {
          ctx.strokeStyle = '#def5e6b8';
          ctx.lineWidth = .65 * scale;
          ctx.beginPath(); ctx.moveTo(start.x * .25 + tip.x * .75, start.y * .25 + tip.y * .75 - 1.8 * scale);
          ctx.lineTo(tip.x, tip.y - 1.7 * scale); ctx.stroke();
        }
      }

      // Two spiralling strands of fine wire with light points.
      for (let strand = 0; strand < 2; strand++) {
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          let started = false;
          for (let k = 0; k < 360; k++) {
            const t = k / 359;
            const y = .085 + t * .85;
            const angle = t * Math.PI * (strand === 0 ? 13.5 : 10.5) + strand * 2.3 + .5;
            const pos = project((.98 - y * .9) * 1.02, y, angle);
            const isFront = pos.z > (pass === 0 ? -.2 : .08);
            if (!isFront) { started = false; continue; }
            if (started) ctx.lineTo(pos.x, pos.y); else ctx.moveTo(pos.x, pos.y);
            started = true;
          }
          ctx.strokeStyle = strand === 0 ? palette.ribbon : '#e7ded0';
          ctx.lineWidth = (pass ? 1.7 : .8) * scale;
          ctx.globalAlpha = pass ? .94 : .35;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      if (lightsOn) {
        for (let strand = 0; strand < 2; strand++) {
          for (let k = 0; k < 76; k++) {
            const t = k / 76;
            const y = .085 + t * .85;
            const angle = t * Math.PI * (strand === 0 ? 13.5 : 10.5) + strand * 2.3 + .5;
            const pos = project((.98 - y * .9) * 1.04, y, angle);
            if (pos.z < -.15) continue;
            const col = palette.bulbs[(k * 7 + strand * 2) % palette.bulbs.length];
            const pulse = .77 + .23 * sin(clock * 2.2 + k * 2.1);
            const bulb = (1.5 + Math.max(0, pos.z) * 1.2) * scale;
            ctx.save();
            ctx.globalAlpha = pulse;
            ctx.fillStyle = col;
            ctx.shadowColor = col;
            ctx.shadowBlur = 13 * scale;
            ctx.beginPath(); ctx.arc(pos.x, pos.y, bulb, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          }
        }
      }

      // Polished ornaments with dimensional shading, not flat dots.
      const baubles = scene.baubles.map(bauble => ({
        bauble, point: project(bauble.radius, bauble.y, bauble.angle),
      })).sort((a, b) => a.point.z - b.point.z);
      for (const { bauble, point } of baubles) {
        if (point.z < -.2) continue;
        const radius = bauble.size * scale * (1 + point.z * .23);
        const colour = palette.baubles[bauble.color];
        ctx.strokeStyle = '#e7dfbf6b'; ctx.lineWidth = .7 * scale;
        ctx.beginPath(); ctx.moveTo(point.x, point.y - radius * 2.15); ctx.lineTo(point.x, point.y - radius); ctx.stroke();
        glossyBauble(ctx, point.x, point.y, radius, colour, sin(clock * 1.5 + bauble.sway));
      }

      const starY = base - treeHeight - 10 * scale + lean;
      if (lightsOn) {
        const radiance = ctx.createRadialGradient(center, starY, 2, center, starY, 65 * scale);
        radiance.addColorStop(0, '#fff3baad');
        radiance.addColorStop(.22, '#f8dfa043');
        radiance.addColorStop(1, '#ffe5ac00');
        ctx.fillStyle = radiance;
        ctx.beginPath(); ctx.arc(center, starY, 65 * scale, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = lightsOn ? '#fff3c1' : '#a6b8ae';
      ctx.shadowColor = '#f5d58f';
      ctx.shadowBlur = lightsOn ? 22 * scale : 0;
      drawStar(ctx, center, starY, 20 * scale, .43); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fffdf6'; ctx.lineWidth = .9 * scale; ctx.stroke();
      if (lightsOn) {
        ctx.strokeStyle = '#fff1bf9c';
        ctx.lineWidth = .9 * scale;
        ctx.beginPath();
        ctx.moveTo(center - 39 * scale, starY); ctx.lineTo(center + 39 * scale, starY);
        ctx.moveTo(center, starY - 38 * scale); ctx.lineTo(center, starY + 38 * scale); ctx.stroke();
      }

      // A tiny custom SHUSH pedestal and carefully staged presents.
      gift(ctx, center - 111 * scale, base + 12 * scale, 44 * scale, '#ad394a', '#e9c782', -.08);
      gift(ctx, center + 105 * scale, base + 14 * scale, 56 * scale, '#306d62', '#e7d39d', .055);
      gift(ctx, center + 42 * scale, base + 24 * scale, 34 * scale, '#705884', '#f4d9be', -.12);
      gift(ctx, center - 32 * scale, base + 26 * scale, 31 * scale, '#c29c64', '#f2d7d7', .1);
      ctx.fillStyle = '#102123f2';
      roundRect(ctx, center - 48 * scale, base + 21 * scale, 96 * scale, 25 * scale, 5 * scale); ctx.fill();
      ctx.strokeStyle = '#d8bd7f'; ctx.lineWidth = 1.1 * scale; ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8e5b7';
      ctx.font = '700 ' + Math.round(12 * scale) + 'px Manrope, sans-serif';
      ctx.fillText('S H U S H', center, base + 34 * scale);

      drawFlakes(true);
      // A few individual sparks dance close to the star.
      if (lightsOn) {
        for (let i = 0; i < 10; i++) {
          const angle = clock * (.25 + (i % 3) * .17) + i * 2.399;
          const radius = (21 + i * 7) * scale;
          const x = center + cos(angle) * radius;
          const y = starY + sin(angle * .73) * radius * .65;
          ctx.globalAlpha = .24 + .36 * Math.abs(sin(clock * 1.8 + i));
          ctx.fillStyle = i % 3 ? '#f5edcf' : palette.ribbon;
          ctx.fillRect(x, y, 1.6 * scale, 1.6 * scale);
        }
        ctx.globalAlpha = 1;
      }
    };

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width < 1 || height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(time);
    };
    const animate = (now: number) => {
      frameId = 0;
      if (!canAnimate()) return;
      frameId = requestAnimationFrame(animate);
      if (now - previous < 32) return;
      const dt = previous ? Math.min((now - previous) / 1000, .075) : 0;
      previous = now;
      time += dt;
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * .06;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * .06;
      snowfall.current *= .985;
      draw(time);
    };

    const canAnimate = () => !motionReduced && !paused && !document.hidden && visible;
    const syncAnimation = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
      previous = 0;
      if (canAnimate()) frameId = requestAnimationFrame(animate);
    };

    redraw.current = () => draw(time);
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .02;
      if (visible) draw(time);
      syncAnimation();
    }, { threshold: .02 });
    const onMotion = (event: MediaQueryListEvent) => {
      motionReduced = event.matches;
      draw(time);
      syncAnimation();
    };
    const onVisibility = () => {
      if (!document.hidden && visible) draw(time);
      syncAnimation();
    };
    ro.observe(frame); io.observe(frame);
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    syncAnimation();

    return () => {
      cancelAnimationFrame(frameId);
      redraw.current = () => {};
      ro.disconnect(); io.disconnect();
      media.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [theme, paused, lightsOn]);

  return (
    <div
      ref={frameRef}
      className="winter-tree-stage winter-tree-premium"
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current.targetX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
        pointer.current.targetY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
      }}
      onPointerLeave={() => { pointer.current.targetX = 0; pointer.current.targetY = 0; }}
    >
      <div className="winter-stage-top" aria-hidden="true">
        <span className="winter-stage-serial">NO. 01 / NORTH POLE EDITION</span>
        <span className="winter-status"><i /> SHUSH CHRISTMAS 2026</span>
      </div>
      <canvas
        ref={canvasRef}
        className="winter-tree-canvas"
        role="img"
        aria-label="Árvore de Natal tridimensional com ramos de pinheiro, bolas brilhantes, luzes, estrela e neve. Arrasta para a rodar ou usa as setas esquerda e direita."
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          rotation.current.dragging = true;
          rotation.current.lastX = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!rotation.current.dragging) return;
          rotation.current.offset += (event.clientX - rotation.current.lastX) * .007;
          rotation.current.lastX = event.clientX;
          redraw.current();
        }}
        onPointerUp={() => { rotation.current.dragging = false; }}
        onPointerCancel={() => { rotation.current.dragging = false; }}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          rotation.current.offset += event.key === 'ArrowRight' ? .23 : -.23;
          redraw.current();
        }}
      />
      <div className="winter-tree-title" aria-hidden="true">
        <span>WINTER WONDERLAND</span>
        <strong>Make a little magic.</strong>
      </div>
      <div className="winter-stage-bottom">
        <div className="winter-palette" role="group" aria-label="Cor das luzes da árvore">
          {(Object.keys(themes) as Theme[]).map((key) => (
            <button key={key} type="button" aria-pressed={theme === key} onClick={() => setTheme(key)}>
              {themes[key].label}
            </button>
          ))}
        </div>
        <div className="winter-tree-utilities">
          <button className="winter-motion-toggle" type="button" aria-pressed={!lightsOn} onClick={() => setLightsOn(value => !value)}>
            {lightsOn ? 'Luzes on' : 'Luzes off'} <span aria-hidden="true">✦</span>
          </button>
          <button className="winter-motion-toggle" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
            {paused ? 'Reproduzir' : 'Pausar'} <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          </button>
        </div>
      </div>
      <span className="winter-stage-caption" aria-hidden="true">✧ A LITTLE HOLIDAY MAGIC ✧</span>
    </div>
  );
}
