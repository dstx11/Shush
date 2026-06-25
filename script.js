const players = [
  { name: 'Délcio', number: '01', roles: ['Duelista', 'Smoker'], image: 'assets/avatars/delcio.webp', quote: 'Entra primeiro, fuma depois. Às vezes por esta ordem.', detail: 'O caos de entrada da SHUSH. Energia de meme, mas com utilidade real quando o round precisa de espaço.', pos: 'center 45%' },
  { name: 'Tiago', number: '02', roles: ['Sentinela', 'Iniciador'], image: 'assets/avatars/tiago.webp', quote: 'Fecha espaço, abre round e ainda quer o site alinhado.', detail: 'O jogador que segura a estrutura, corrige o setup e provavelmente ainda repara no espaçamento do site.', pos: 'center 42%' },
  { name: 'Tomás', number: '03', roles: ['Iniciador', 'Duelista'], image: 'assets/avatars/tomas.webp', quote: 'Flash para ganhar espaço. Nem sempre só ao inimigo.', detail: 'Serve para abrir caminho, criar contacto e garantir que alguém vai reclamar da flash na call.', pos: 'center 38%' },
  { name: 'Tz', number: '04', roles: ['Duelista', 'Sentinela'], image: 'assets/avatars/tz.webp', quote: 'Presença silenciosa, peek discutível, confiança intacta.', detail: 'Mistura presença calma com decisões que obrigam a equipa a respirar fundo antes de comentar.', pos: 'center 44%' },
  { name: 'Lyel', number: '05', roles: ['Flex'], image: 'assets/avatars/lyel.webp', quote: 'Troll oficial. Não é bug, é feature.', detail: 'Flex no papel, troll no coração. A strat pode não estar aprovada, mas vai acontecer na mesma.', troll: true, pos: 'center 38%' },
  { name: 'Levi', number: '06', roles: ['Duelista'], initials: 'LV', quote: 'Sem foto ainda. Lugar marcado até a imagem oficial cair.', detail: 'Slot reservado. Quando chegar a foto, entra no sistema sem mexer no layout.', placeholder: true },
  { name: 'Craquinho', number: '07', roles: ['Duelista', 'Smoker'], initials: 'CR', quote: 'Sem foto, com presença garantida. O card fica pronto para update.', detail: 'Duelista e smoker, o que significa que tanto pode entrar como pode salvar a call da própria entrada.', placeholder: true },
  { name: 'Catarina', number: '08', roles: ['Smoker', 'Iniciador'], image: 'assets/avatars/catarina.webp', quote: 'Call limpa, round fechado, caos minimizado.', detail: 'A presença que baixa o ruído, organiza a utilidade e impede a call de virar discussão sem fim.', pos: 'center 38%' }
];

const nav = document.querySelector('.main-nav');
const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(open));
});
nav?.addEventListener('click', event => {
  if (event.target.matches('a')) {
    nav.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
  }
});

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const jerseyStages = [...document.querySelectorAll('.hero-visual, .drop-stage')];
if (jerseyStages.length && !prefersReducedMotion) {
  const state = jerseyStages.map(stage => ({ stage, img: stage.querySelector('img'), tiltX: 0, tiltY: 0, targetX: 0, targetY: 0 }));

  if (hasHover) {
    state.forEach(s => {
      s.stage.addEventListener('pointermove', event => {
        const box = s.stage.getBoundingClientRect();
        const relX = (event.clientX - box.left) / box.width - 0.5;
        const relY = (event.clientY - box.top) / box.height - 0.5;
        s.targetX = relX * 10;
        s.targetY = relY * 8;
      });
      s.stage.addEventListener('pointerleave', () => { s.targetX = 0; s.targetY = 0; });
    });
  }

  const start = performance.now();
  const tick = now => {
    const t = (now - start) / 1000;
    const floatY = Math.sin(t / 1.1) * 9;
    state.forEach(s => {
      if (!s.img) return;
      s.tiltX += (s.targetX - s.tiltX) * 0.08;
      s.tiltY += (s.targetY - s.tiltY) * 0.08;
      s.img.style.transform = `translateY(${floatY}px) rotateX(${-s.tiltY}deg) rotateY(${s.tiltX}deg)`;
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const header = document.querySelector('.site-header');
const setProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  root.style.setProperty('--scroll', `${value}%`);
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
};
setProgress();
window.addEventListener('scroll', setProgress, { passive: true });
window.addEventListener('pointermove', event => {
  root.style.setProperty('--mx', `${event.clientX}px`);
  root.style.setProperty('--my', `${event.clientY}px`);
}, { passive: true });

const revealItems = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
const applyStagger = scope => {
  const groups = new Map();
  scope.querySelectorAll('[data-reveal]').forEach(item => {
    const parent = item.parentElement;
    if (!groups.has(parent)) groups.set(parent, 0);
    const i = groups.get(parent);
    item.style.setProperty('--stagger', Math.min(i, 8));
    groups.set(parent, i + 1);
  });
};
applyStagger(document);
const heroReveal = document.querySelector('.hero');
if (heroReveal) {
  heroReveal.querySelectorAll('[data-reveal]').forEach((item, i) => {
    item.style.setProperty('--stagger', i);
  });
}
revealItems.forEach(item => observer.observe(item));

const roleMarkup = roles => roles.map((role, i) => `<span style="--i:${i}">${role}</span>`).join('');
const avatarMarkup = player => {
  if (player.placeholder) {
    return `
      <div class="avatar">
        <span class="avatar-badge">Foto pendente</span>
        <div class="placeholder-grid" aria-hidden="true"></div>
        <div class="placeholder-scan" aria-hidden="true"></div>
        <div class="placeholder-core" aria-hidden="true">${player.initials}</div>
        <p class="placeholder-note">Placeholder intencional para manter a grelha limpa até chegar foto real.</p>
      </div>`;
  }
  return `
    <div class="avatar" style="--pos:${player.pos || 'center'}">
      ${player.troll ? '<span class="avatar-badge is-troll">Troll mode</span>' : ''}
      <img src="${player.image}" alt="Foto de ${player.name}" loading="lazy">
    </div>`;
};

const rosterCard = player => `
  <article class="roster-card ${player.troll ? 'troll' : ''} ${player.placeholder ? 'placeholder' : ''}" data-reveal data-roles="${player.roles.join('|')}" tabindex="0">
    ${avatarMarkup(player)}
    <div class="roster-content">
      <div class="roster-top">
        <h3 class="roster-name">${player.name}</h3>
        <span class="roster-number">${player.number}</span>
      </div>
      <div class="role-list">${roleMarkup(player.roles)}</div>
      <p class="roster-quote">${player.quote}</p>
    </div>
  </article>`;

const previewGrid = document.querySelector('#previewRoster');
if (previewGrid) {
  previewGrid.innerHTML = players.slice(0, 4).map(rosterCard).join('');
  applyStagger(previewGrid);
  previewGrid.querySelectorAll('[data-reveal]').forEach(item => observer.observe(item));
}

const rosterGrid = document.querySelector('#rosterGrid');
if (rosterGrid) {
  rosterGrid.innerHTML = players.map(rosterCard).join('');
  applyStagger(rosterGrid);
  rosterGrid.querySelectorAll('[data-reveal]').forEach(item => observer.observe(item));
}

const roleFilters = document.querySelector('#roleFilters');
if (roleFilters && rosterGrid) {
  const allRoles = [...new Set(players.flatMap(p => p.roles))];
  const filterButton = (label, role, active) => `<button type="button" class="filter-pill${active ? ' is-active' : ''}" data-role="${role}">${label}</button>`;
  roleFilters.innerHTML = filterButton('Todos', 'all', true) + allRoles.map(role => filterButton(role, role, false)).join('');

  roleFilters.addEventListener('click', event => {
    const pill = event.target.closest('.filter-pill');
    if (!pill) return;
    roleFilters.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('is-active'));
    pill.classList.add('is-active');
    const role = pill.dataset.role;
    const cards = [...rosterGrid.querySelectorAll('.roster-card')];
    const toHide = [];
    const toShow = [];
    cards.forEach(card => {
      const roles = card.dataset.roles.split('|');
      const show = role === 'all' || roles.includes(role);
      (show ? toShow : toHide).push(card);
    });
    toHide.forEach(card => { card.style.opacity = '0'; card.style.transform = 'scale(.92)'; });
    setTimeout(() => {
      toHide.forEach(card => { card.classList.add('is-hidden'); card.style.opacity = ''; card.style.transform = ''; });
      toShow.forEach((card, i) => {
        card.classList.remove('is-hidden');
        card.style.transition = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(.92)';
        requestAnimationFrame(() => {
          card.style.transition = `opacity .38s ease ${i * 45}ms, transform .38s cubic-bezier(.2,.8,.2,1) ${i * 45}ms`;
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          setTimeout(() => { card.style.transition = ''; card.style.opacity = ''; card.style.transform = ''; }, 450 + i * 45);
        });
      });
    }, toHide.length ? 180 : 0);
  });
}

const detailGrid = document.querySelector('#rosterDetails');
if (detailGrid) {
  detailGrid.innerHTML = players.map(player => `
    <article class="detail-card card" data-reveal>
      ${avatarMarkup(player)}
      <div>
        <span class="badge">${player.number} / ${player.roles.join(' + ')}</span>
        <h3>${player.name}</h3>
        <p>${player.detail}</p>
      </div>
    </article>`).join('');
  applyStagger(detailGrid);
  detailGrid.querySelectorAll('[data-reveal]').forEach(item => observer.observe(item));
}

if (hasHover && !prefersReducedMotion) {
  document.addEventListener('pointermove', event => {
    const card = event.target.closest('.roster-card');
    if (!card) return;
    const box = card.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * 100;
    const py = ((event.clientY - box.top) / box.height) * 100;
    card.style.setProperty('--cx', `${px}%`);
    card.style.setProperty('--cy', `${py}%`);
    card.style.setProperty('--tilt-x', `${(px / 100 - 0.5) * 6}deg`);
    card.style.setProperty('--tilt-y', `${(py / 100 - 0.5) * 6}deg`);
  }, { passive: true });
}

const orderButton = document.querySelector('#copyOrder');
const orderOutput = document.querySelector('#orderOutput');
orderButton?.addEventListener('click', async () => {
  const name = document.querySelector('#kitName')?.value.trim() || 'Unknown';
  const number = document.querySelector('#kitNumber')?.value.trim() || '00';
  const size = document.querySelector('#kitSize')?.value || 'L';
  const message = [
    'Pedido SHUSH Drop 01',
    `Nome: ${name}`,
    `Número: ${number}`,
    `Tamanho: ${size}`,
    'Modelo: Unknown 00',
    'Nota: pedido manual / pré-reserva'
  ].join('\n');

  orderOutput.textContent = message;
  orderOutput.classList.remove('is-updated');
  requestAnimationFrame(() => orderOutput.classList.add('is-updated'));

  try {
    await navigator.clipboard.writeText(message);
    orderButton.classList.add('is-success');
    orderButton.textContent = 'Pedido copiado';
    setTimeout(() => {
      orderButton.classList.remove('is-success');
      orderButton.textContent = 'Criar pedido';
    }, 1800);
  } catch {
    orderButton.textContent = 'Copiar manualmente';
  }
});
