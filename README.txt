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

Estrutura atual:
- index.html: home curta e forte
- roster.html: roster completo, com filtros por role
- drop01.html: página da jersey Drop 01
- about.html: página sobre a SHUSH, identidade, Drop 01 e Backora
- callroom.html: fallback simples que redireciona para about.html
- styles.css: design system global
- script.js: menu mobile, scroll progress, reveal com stagger, roster, filtros e pedido da jersey

Notas importantes:
- assets/avatars/ está intencionalmente vazio. Fotos reais serão adicionadas depois.
- Não criar fotos falsas, imagens remotas ou placeholders externos para jogadores.
- O roster deve evoluir para placeholders/initials sem ícones de imagem quebrados.
- Backora deve continuar como parceiro técnico/digital, sem grelha de sponsors falsos.
- Drop 01 continua com pedido manual. Não existe checkout real nesta fase.

Estado de Stage 1:
- A navegação principal usa About.
- about.html é a página real.
- callroom.html foi mantido apenas como fallback/redirecionamento.
- O visual principal foi mantido quase intacto.
- Roster, Drop 01, hero e animações não foram redesenhados nesta etapa.

Estado de Stage 2:
- O roster usa dados sem caminhos para imagens inexistentes.
- Todos os jogadores renderizam com initials/placeholders enquanto assets/avatars/ estiver vazio.
- A cópia do roster foi profissionalizada sem inventar estatísticas, rankings ou histórico.
- O modo antigo e os badges/campos específicos foram removidos do roster.
- Os filtros do roster continuam preservados.

Estado de Stage 3:
- Header/nav redesenhado como componente dark glass.
- Desktop usa logo à esquerda, nav centrada e CTA Drop 01 à direita.
- Mobile usa painel compacto com estados acessíveis.
- Escape fecha o menu e o clique em links também fecha.
- About continua na navegação; a página antiga continua apenas como fallback.

Estado de Stage 4:
- Home hero reconstruído à volta da jersey/Drop 01.
- A imagem local assets/jersey-hero.webp é usada como objeto principal do hero.
- O hero tem CTA principal para Drop 01 e CTA secundário para Roster.
- A composição usa showcase escuro, spotlight, glass e contexto curto sobre SHUSH/Backora.
- Roster, Drop 01, About e o fallback callroom.html não foram redesenhados nesta etapa.

Estado de Stage 5:
- Roster page refinada visualmente para a direção premium SHUSH.
- Cards, filtros, badges de role/status e detalhes receberam tratamento glass mais escuro.
- Placeholders de avatar continuam sem imagens falsas e prontos para fotos reais.
- Délcio continua Flex e Tiago mantém badge IGL subtil.
- Home, Drop 01, About, header/nav e callroom.html não foram redesenhados nesta etapa.

Validação:
- Correr: python scripts/validate_shush_static.py
- Correr o servidor local e abrir todas as páginas principais.
- Confirmar que a navegação aponta para About.
- Confirmar que Drop 01 e filtros do roster continuam funcionais.

Nota conhecida:
- A imagem da jersey (jersey-hero.webp / jersey-drop-01.webp) tem "Uknown" impresso nos
  pixels do mockup, em vez de "Unknown". Todo o texto do site já diz "Unknown 00"
  corretamente; só a arte da camisola precisa de ser reexportada na ferramenta original.
