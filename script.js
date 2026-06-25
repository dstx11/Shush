const players = [
  { name: 'Délcio', initials: 'DL', number: '01', roles: ['Flex'], image: 'assets/avatars/delcio.png', quote: 'Flexível no round, consistente na presença.', detail: 'Flex no roster, adapta-se ao ritmo da equipa e cobre o que o round pede com presença estável.' },
  { name: 'Tiago', initials: 'TG', number: '02', roles: ['Sentinela', 'Iniciador'], status: 'IGL', quote: 'Estrutura, leitura e ritmo para a equipa.', detail: 'IGL da equipa, responsável por estrutura, leitura e ritmo sem tirar clareza ao round.' },
  { name: 'Tomás', initials: 'TM', number: '03', roles: ['Iniciador', 'Duelista'], image: 'assets/avatars/tomas.png', quote: 'Contacto criado sem perder intenção.', detail: 'Iniciador com ritmo ofensivo. Cria janelas para a equipa avançar e mantém pressão quando o mapa pede presença.' },
  { name: 'Tz', initials: 'TZ', number: '04', roles: ['Duelista', 'Sentinela'], image: 'assets/avatars/tz.png', quote: 'Presença discreta, impacto claro.', detail: 'Mistura calma com decisões rápidas. Dá flexibilidade ao round sem puxar o foco para fora da equipa.' },
  { name: 'Lyel', initials: 'LY', number: '05', roles: ['Flex'], image: 'assets/avatars/lyel.png', quote: 'Flexível por função, consistente por presença.', detail: 'Adapta-se ao que o mapa pede e ajuda a manter o ritmo da equipa sem perder a identidade SHUSH.' },
  { name: 'Levi', initials: 'LV', number: '06', roles: ['Duelista'], quote: 'Pressão frontal com espaço para crescer.', detail: 'Duelista preparado para ocupar espaço e acelerar rounds quando a equipa precisa de iniciativa.' },
  { name: 'Craquinho', initials: 'CR', number: '07', roles: ['Duelista', 'Smoker'], quote: 'Entrada e cobertura no mesmo sistema.', detail: 'Duelista e smoker, combina presença ofensiva com utilidade para manter o round controlado.' },
  { name: 'Catarina', initials: 'CT', number: '08', roles: ['Smoker', 'Iniciador'], image: 'assets/avatars/catarina.png', quote: 'Call limpa, utilidade certa, round com direção.', detail: 'Baixa o ruído, organiza utilidade e ajuda a transformar intenção em execução dentro do servidor.' }
];

const nav = document.querySelector('.main-nav');
const menu = document.querySelector('.menu-toggle');
const setMenu = open => {
  nav?.classList.toggle('is-open', open);
  menu?.setAttribute('aria-expanded', String(open));
  menu?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
menu?.addEventListener('click', () => {
  setMenu(!nav?.classList.contains('is-open'));
});
nav?.addEventListener('click', event => {
  if (event.target.matches('a')) {
    setMenu(false);
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
    setMenu(false);
    menu?.focus();
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

const roleMarkup = roles => roles.map((role, i) => `<span data-role="${role}" style="--i:${i}">${role}</span>`).join('');
const statusMarkup = player => player.status ? `<span class="player-tag" aria-label="${player.status} da equipa">${player.status}</span>` : '';
const cardLabel = player => [player.name, player.status, player.roles.join(' e ')].filter(Boolean).join(', ');
const detailBadge = player => [player.status, `${player.number} / ${player.roles.join(' + ')}`].filter(Boolean).join(' · ');
const fallbackAvatar = player => `
  <span class="avatar-badge">Foto pendente</span>
  <div class="placeholder-grid" aria-hidden="true"></div>
  <div class="placeholder-scan" aria-hidden="true"></div>
  <div class="placeholder-core" aria-hidden="true">${player.initials}</div>
  <p class="placeholder-note">Slot preparado para foto real.</p>`;
const avatarMarkup = player => {
  if (player.image) {
    return `
      <div class="avatar has-image" style="--pos:${player.pos || 'center'}">
        <img src="${player.image}" alt="Foto de ${player.name}" width="768" height="768" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
        <div class="avatar-fallback" hidden>
          ${fallbackAvatar(player)}
        </div>
      </div>`;
  }
  return `
    <div class="avatar avatar-fallback-only">
      ${fallbackAvatar(player)}
    </div>`;
};

const rosterCard = player => `
  <article class="roster-card ${player.image ? 'has-photo' : 'placeholder'}" data-reveal data-roles="${player.roles.join('|')}" tabindex="0" aria-label="${cardLabel(player)}">
    ${avatarMarkup(player)}
    <div class="roster-content">
      <div class="roster-top">
        <div class="roster-title">
          <h3 class="roster-name">${player.name}</h3>
          ${statusMarkup(player)}
        </div>
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
  const discoveredRoles = [...new Set(players.flatMap(p => p.roles))];
  const roleOrder = ['Duelista', 'Smoker', 'Sentinela', 'Iniciador', 'Flex'];
  const allRoles = [
    ...roleOrder.filter(role => discoveredRoles.includes(role)),
    ...discoveredRoles.filter(role => !roleOrder.includes(role))
  ];
  const filterButton = (label, role, active) => `<button type="button" class="filter-pill${active ? ' is-active' : ''}" data-role="${role}" aria-pressed="${active ? 'true' : 'false'}">${label}</button>`;
  roleFilters.innerHTML = filterButton('Todos', 'all', true) + allRoles.map(role => filterButton(role, role, false)).join('');

  roleFilters.addEventListener('click', event => {
    const pill = event.target.closest('.filter-pill');
    if (!pill) return;
    roleFilters.querySelectorAll('.filter-pill').forEach(btn => {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    });
    pill.classList.add('is-active');
    pill.setAttribute('aria-pressed', 'true');
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
        <span class="badge">${detailBadge(player)}</span>
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
const orderForm = document.querySelector('#dropInterestForm');
orderForm?.addEventListener('submit', event => {
  event.preventDefault();
  orderButton?.click();
});
orderButton?.addEventListener('click', async () => {
  const name = document.querySelector('#kitName')?.value.trim() || 'Unknown';
  const number = document.querySelector('#kitNumber')?.value.trim() || '00';
  const size = document.querySelector('#kitSize')?.value || 'L';
  const message = [
    'Interesse SHUSH Drop 01',
    `Nome: ${name}`,
    `Número: ${number}`,
    `Tamanho: ${size}`,
    'Peça: Drop 01 / Unknown 00',
    'Nota: mensagem manual de interesse'
  ].join('\n');

  orderOutput.textContent = message;
  orderOutput.classList.remove('is-updated');
  requestAnimationFrame(() => orderOutput.classList.add('is-updated'));

  try {
    await navigator.clipboard.writeText(message);
    orderButton.classList.add('is-success');
    orderButton.textContent = 'Mensagem copiada';
    setTimeout(() => {
      orderButton.classList.remove('is-success');
      orderButton.textContent = 'Gerar mensagem';
    }, 1800);
  } catch {
    orderButton.textContent = 'Mensagem pronta';
    setTimeout(() => {
      orderButton.textContent = 'Gerar mensagem';
    }, 1800);
  }
});
