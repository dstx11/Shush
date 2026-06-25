SHUSH Site Ultimate

Como correr localmente:
1. Abrir CMD nesta pasta.
2. Correr: python -m http.server 5173
3. Abrir: http://localhost:5173

Para criar link temporário:
1. Manter o servidor Python aberto.
2. Abrir outro CMD.
3. Correr: cloudflared tunnel --url http://localhost:5173
4. Mandar aos amigos o link trycloudflare.com gerado.

Estrutura:
- index.html: home curta e forte
- roster.html: roster completo, com filtros por role
- drop01.html: página da jersey Drop 01
- callroom.html: clips, memes e quotes
- styles.css: design system global
- script.js: menu mobile, scroll progress, reveal com stagger, roster, filtros e pedido da jersey

Novidades desta passagem:
- Footer global em todas as páginas passou a mencionar o partner Backora.
- Call Room ganhou um 5º slot dedicado a "Inside Joke / Meme", distinto do card do Lyel.
- Roster: filtros por role funcionais (Duelista, Smoker, Sentinela, Iniciador, Flex), com
  animação suave ao trocar de filtro e sem buracos na grelha.
- Roster: hover/focus dos cards reforçado (elevação, glow, zoom na foto); badge "Troll mode"
  do Lyel agora com cor própria, distinta do badge "Foto pendente".
- Foco de teclado visível em links, botões e cards interativos (acessibilidade).
- Stagger automático de entrada (cascata) em todas as grelhas de cards.
- Corrigido bug no logo da Backora: o PNG original tinha o "B" a ocupar menos de 7% da
  imagem, ficando ilegível em tamanhos pequenos. Foi recortado e ampliado.
- Corrigido layout do hero interno (roster/drop01/callroom): a coluna lateral ficava vazia
  quando o título tinha mais linhas. Agora o mini-strip ocupa bem o espaço, com um número
  de frame decorativo no fundo.
- Animações novas: shine no botão primário ao hover, float sutil na jersey (hero e Drop 01),
  hover com profundidade nos cards de Identidade e no Partner card. Tudo respeita
  prefers-reduced-motion.

Nota conhecida (não corrigível em código):
- A imagem da jersey (jersey-hero.webp / jersey-drop-01.webp) tem "Uknown" impresso nos
  pixels do mockup, em vez de "Unknown". Todo o texto do site (HTML/JS) já diz "Unknown 00"
  corretamente — só a arte da camisola precisa de ser reexportada na ferramenta original
  para corrigir isto.

Passagem de auditoria + animações (mais recente):
- Header: muda de fundo/sombra ao fazer scroll (.is-scrolled).
- Nav: links com underline animado (hover e página ativa), substitui o antigo highlight de fundo.
- Ticker: pausa ao passar o cursor (animation-play-state).
- Jersey (home e Drop 01): float contínuo + parallax leve ao mover o rato, só em desktop com
  hover real; combinados num único loop requestAnimationFrame para não conflituarem.
- Roster cards: glow local que segue o cursor dentro do próprio card, e tilt 3D muito subtil
  (~2-3°), ambos só em "(hover: hover) and (pointer: fine)" — zero custo extra em mobile/touch.
- Hero da home: stagger cinematográfico verdadeiro (8 elementos em cascata, jersey por último),
  mais lento que o stagger padrão das grelhas para se notar melhor.
- Placeholders do roster (Levi/Craquinho): scan-line subtil em loop, usando transform em vez
  de top/height para não pesar no layout.
- Botão "Criar pedido": feedback de sucesso visual (verde) e flash discreto na caixa de output
  ao atualizar a mensagem.
- "Detalhes do conceito" (Drop 01): reveal com leve scale e hover com elevação/glow.
- Call Room: waveform decorativo (barras animadas) no card principal "Call da Semana"; hover
  consistente em todos os cards do call-grid; quote-wall com hover de profundidade.
- Corrigido um bug introduzido a meio do trabalho (perda da declaração de `root` no JS ao
  adicionar a deteção de scroll do header) — detectado e corrigido antes da entrega.

Validado nesta passagem (Playwright, não só leitura de código):
- Zero erros JS nas 4 páginas, mesmo com scroll completo.
- Zero overflow horizontal em mobile (375px) nas 4 páginas.
- prefers-reduced-motion confirmado a parar: waveform, scan-line, e o próprio loop JS de
  parallax/float (nem chega a arrancar quando a preferência está ativa).
- Funcionalidades existentes confirmadas intactas: menu mobile, scroll progress, filtros de
  roster por role, botão de copiar pedido.

Recomendações para depois (não implementadas por segurança/âmbito):
- View Transitions API entre páginas: ficou de fora por decisão conjunta (suporte de browser
  inconsistente, ganho percebido baixo para um site de 4 páginas).
- Partículas/noise extra: ficou de fora por decisão conjunta (risco de pesar e de fugir ao
  tom premium pedido).
- Magnetic hover nos botões secundários: só vale a pena se quiseres reforçar ainda mais o
  CTA principal do hero; não implementado para não multiplicar listeners de pointermove.
