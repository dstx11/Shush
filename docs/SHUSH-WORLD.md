# SHUSH WORLD — direção artística e sistema de experiência

Atualização de 13 de novembro de 2026. A versão canónica parte do `master` validado de 13/11, preservando as páginas públicas, os recursos reais, o produto e o calendário de edições.

## Referências estudadas

- [Daylight Computer](https://daylightcomputer.com/): fotografias com presença, títulos editoriais, cenas com calma e narrativa ligada a um propósito concreto. Aplicação SHUSH: a identidade começa com pessoas e com a história, não com partículas.
- [Piccalio](https://piccalio.com/): alternância entre grandes destaques, coleções e informação de produto sem impor sempre a mesma grelha. Aplicação SHUSH: ritmos diferentes entre a Home, os jogadores, a competição e o Drop.
- [Vacation](https://vacation.inc/): um universo da marca sustentado por voz, imagens, capítulos e pequenos detalhes. Aplicação SHUSH: símbolos, linguagem visual e temporadas que partilham regras.

Os sites são inspiração conceptual; nenhuma interface, imagem ou copy foi copiada.

## Princípios

- **Presence:** ambientação gráfica contextual; nada de partículas contínuas por defeito.
- **Flow:** identidade persistente e coordenada entre rotas, intro, modais e edições.
- **Depth:** camada de câmara no hero, um palco com vetor e retratos reais, materiais que alternam entre opaco e luz.
- **Character:** voz informal, referências a rounds/queue/Discord, sem slogans vazios.
- **Discovery:** laboratórios locais e pré-visualização de seasons; caminhos reais para descobrir o roster, histórico e camisola.

## Sistema cinematográfico

A secção `SignalSection` substitui uma lista genérica por uma narrativa em três capítulos, usando rostos e factos existentes. CSS view timelines são opcionais, com fallback estático e `prefers-reduced-motion`. O hook `useCinematicPointer` altera apenas variáveis CSS num `requestAnimationFrame`, sem provocar renders React, e pára quando a janela está oculta. A intro mantém o carregamento baseado em recursos e um botão de saída, com letras separadas visualmente mas texto acessível preservado.

Não há WebGL: não acrescentaria valor proporcional aos assets disponíveis ou ao custo de GPU/JS.

## SHUSH LAB

Abre através de `Alt + Shift + S` ou cinco cliques rápidos no logótipo. É carregado sob demanda e usa um `<dialog>` nativo. Todas as operações são locais e reversíveis.

- Seasons: escolha persistente em `shush:season:v1`, sincronizada por eventos de `storage`; `auto` usa `Europe/Lisbon`. Pré-visualizações não são guardadas e desaparecem ao fechar.
- Motion: duração, amplitude, easing, repetição e pausa modificam um ensaio real.
- Componentes: seleção, validação e navegação reais, sem alterar dados públicos.
- Observatório: contagem de recursos e tarefas longas, duração de navegação e amostragem de frames com APIs reais; indisponibilidades são assinaladas.
- Visão geral: comandos para ferramentas existentes, roster e partidas verificadas.

**Uma rota escondida não é segurança.** O LAB não pode modificar dados da organização, gerir sessões ou oferecer funções administrativas. Isso requer backend e autenticação reais.

## Performance, SEO e limites

A página pública não carrega o código do laboratório até o visitante o abrir. O CSS de hero e da narrativa é importado por componentes da Home. Não introduz bibliotecas de animação externas. O movimento utiliza sobretudo propriedades de composição e fica inativo no modo reduzido.

O separador apresenta sempre exatamente **Shush**, incluindo a página 404, por decisão de identidade. As descrições, URLs canónicos, Open Graph, Twitter cards e dados estruturados continuam específicos de cada página. Esta decisão enfraquece a diferenciação dos títulos nos motores de pesquisa e é uma escolha explícita do produto.

O arquivo Premier é uma fotografia manual de dez partidas verificadas no [Tracker.gg](https://tracker.gg/valorant/premier/teams/a5552155-90d0-4559-b879-f08e5f9f05b8), revista a 13/11/2026. Não é um feed em direto, nem o histórico completo.

## O que não se deve simular

Não criar clips, comunidade online, achievements, recordes, patrocínios, prémios, notícias ou integrações fictícias. Um CMS ou painel administrativo necessita de infraestrutura real. Não declarar LCP/INP/CLS de produção sem dados de campo. As métricas locais do LAB não devem ser apresentadas como Core Web Vitals.

## Manutenção

Executar `pnpm run validate`, Playwright, comparação visual em desktop/mobile e smoke HTTP da preview antes do merge. Uma nova referência visual só deve ser aceite após inspeção das capturas. O histórico Git deve ser preservado; a branch antiga não deve ser apagada antes de se confirmar a integração segura.
