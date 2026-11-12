# SHUSH · Refinamento de produção

## 1. Auditoria antes de alterações

Base: `3b7365c`, Vite 8 / React 19 / TypeScript estrito / React Router, seis rotas estáticas pré-renderizadas em Cloudflare Pages. Sem backend, autenticação, pagamentos, bases de dados ou dados privados enviados a serviços. A PR #13 tem 542 testes aprovados e 60 exclusões por formato na CI; a validação técnica foi novamente executada nesta auditoria.

Baseline: JS 109,85 KiB e CSS 22,86 KiB gzip (todos os chunks). `pnpm audit --json`: zero vulnerabilidades reportadas em 90 dependências; isto não prova ausência de vulnerabilidades. Existem versões mais recentes, incluindo alterações minor/major; não são instaladas indiscriminadamente. A pesquisa de assinaturas comuns de chaves privadas/tokens no projeto não encontrou correspondências; não equivale a uma auditoria das contas/segredos externos.

### Problemas priorizados

1. **Editor de postais:** não bloqueia o scroll de fundo, trata cliques no padding como cliques no backdrop, não comunica preparação/exportação nem impede operações repetidas. Mensagens sem espaços ultrapassam a coluna do PNG. O contador está incluído no nome acessível do campo. Correção visual e funcional primeiro.
2. **Ações assíncronas:** o roster permite feedback de uma ação antiga sobrepor uma operação mais recente; no Drop, a conclusão antiga pode retirar o estado ocupado de uma ação nova. Corrigir os identificadores de operação e a invalidação ao editar/repor.
3. **Manutenção:** gestão de modal e exportação duplicada; renderização do postal misturada com o editor. Extrair apenas responsabilidades realmente partilhadas. Metadados de navegação dependem de JSON do DOM sem validação; reconstruir a identidade a partir dos dados próprios.
4. **Recursos:** o desenho do postal (não utilizado na maioria das visitas) é enviado no chunk inicial da Home e redesenhado integralmente em cada edição. Separar o renderer e carregar apenas quando necessário, agrupando alterações num frame e mantendo recuperação de falhas.
5. **Navegação:** o mapa de scroll cresce com chaves de histórico sem limite; limitar a retenção. Preservar os testes de scroll, foco e navegação existentes.
6. **Segurança:** CSP mantém permissões para Google Fonts apesar das fontes locais, permite objetos do próprio domínio e não distingue estilos de elementos de atributos dinâmicos. Restringir sem bloquear o estilo dinâmico legítimo. Manter scripts externos/inline bloqueados. Limitar rascunhos antes de fazer JSON.parse; evitar diagnóstico detalhado em consola de produção.

### Elementos preservados

Direção cinematográfica/cozy, três árvores, ritmo da introdução, navegação, sete retratos reais, dados competitivos, personalizador, ligações partilháveis, rascunhos voluntários, exportação de cartazes/postais e conteúdo sem JavaScript. Sem novas dependências, arquitetura de aplicação ou funcionalidades comerciais fictícias.

## 2. Ordem de execução

Experiência/editor e feedback → verificação funcional → extração de responsabilidades e fiabilidade → carregamento/desenho e medições comparáveis → CSP/configuração/input bounds → testes técnicos, acessibilidade e visuais → revisão final. Nenhuma publicação em produção nesta fase.

## 3. Evidência e limites

As medições de LCP/CLS são de laboratório no Chrome Headless Shell 156.0.8078.4, preview de produção local, sem CPU/rede limitadas. Não representam percentis de utilizadores reais. INP de campo requer tráfego e recolha real; os testes de interação são apenas verificações de laboratório. Axe, teclado, zoom e diferentes viewports não constituem certificação WCAG nem testes de dispositivos físicos.

CSRF, autorização, sessões, cookies autenticados e rate limiting de endpoints não se aplicam a esta aplicação estática. Acesso à conta Cloudflare, regras externas, DNS, proteção da branch, rotação de credenciais e um teste de intrusão externo não são demonstrados por esta auditoria. A publicação e a confirmação dos novos headers no domínio de produção ficam dependentes de aprovação.

## 4. Implementação e resultados

- **Experiência:** postal sem cortes em palavras longas, contagem por grafemas, nomes acessíveis estáveis, pré-visualização anunciada, exportações protegidas contra duplicação/obsolescência, erro e recuperação visíveis. Padding não fecha o dialog; fundo e posição ficam preservados. Mudanças para movimento reduzido removem retratos em saída. Cartazes de partidas comunicam também falhas de exportação.
- **Reflow:** seis rotas verificadas a 200% de tamanho de texto em 390/1366 CSS px. O ensaio inicial tinha overflow nas seis rotas móveis; os componentes passaram a adaptar-se ao espaço tipográfico com container queries, sem esconder o problema com overflow-x:hidden. Filtros, tamanhos, ligações, contagens e controlos mantêm-se disponíveis. A matriz existente cobre também 320 CSS px, tablets, paisagem e alta densidade.
- **Arquitetura:** renderer de postal separado da UI; texto Unicode reutilizado; lifecycle de modais e recursos de download partilhado; metadados reconstruídos de uma identidade própria comum ao build/client. Mapa de scroll limitado a 64 entradas. Removidos seletores comprovadamente sem utilização. Sem dependências novas.
- **Fiabilidade:** ações antigas não substituem feedback nem retiram o estado ocupado de uma ação mais recente. Callbacks após fecho/unmount são ignorados. Só uma falha ao abrir uma rota pode provocar a recuperação por reload, limitada por sessão; um hover ou renderer opcional nunca recarrega a página. O renderer tem deadline de 8 s e permite recuperar sem perder a mensagem.
- **Desempenho:** uma camada estática 1600×900 é reutilizada enquanto o editor está aberto, no máximo para a edição atual, e libertada ao fechar (assim como a pré-visualização). Na mesma sequência de 41 eventos de escrita, houve 41 reconstruções completas antes e zero depois, com 23 composições leves agrupadas por frame. Ensaio sintético 390×844, CPU 4×: 7,59 s antes e 1,04 s depois. Não é INP de campo. O bitmap adicional tem cerca de 5,5 MiB RGBA teóricos enquanto aberto; não se mantém um cache das três edições.
- **Transferência:** o renderer passou a chunk opcional, pedido só ao abrir o editor. A segurança, recuperação e acessibilidade acrescentam código: o grafo JS inicial da Home passou de 94 917 para 96 363 bytes gzip na medição final. Não se alega redução global de bytes nem melhoria de LCP. As novas funcionalidades permanecem dentro dos budgets de 125/24 KiB.
- **Segurança:** CSP elimina permissões para Google Fonts, bloqueia objetos/frames/workers e scripts de atributo; estilos de elementos só locais, atributos dinâmicos continuam explicitamente permitidos. Testada a política exata numa origem HTTPS reservada, com bytes servidos pelo preview local, sem contactar esse domínio externamente. Injeções executáveis são bloqueadas e os fluxos legítimos continuam funcionais. CSS da 404 passou a ficheiro local, com contraste e identidade coerentes. Links rejeitam esquemas ativos, caminhos de rede/backslash e credenciais; novos separadores recebem proteção rel. Rascunhos são limitados antes do JSON.parse, sourcemaps desativados e a distribuição rejeita ficheiros privados/debug. Diagnóstico próprio detalhado fica restrito ao desenvolvimento. CI passa também a auditar dependências de risco alto.

As referências visuais existentes mantêm-se, com assertions e tolerâncias intactas. Não foi necessário redesenhar a árvore ou mudar a identidade para resolver estes problemas. A validação técnica final e 52 casos dirigidos passaram localmente antes da matriz completa. Os resultados finais de Chromium/WebKit, HTTP do preview e comparações de pixels são registados na PR, evitando um novo build só para atualizar números de relatório.

### Fontes técnicas

[MDN: CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [MDN: object-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/object-src), [OWASP: Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html). CSP é defesa adicional, não prova de ausência de XSS. A permissão de atributos de estilo é um compromisso explícito para a aplicação estática e o React existentes.

Para repetir o ensaio de escrita: `pnpm run build`, iniciar `pnpm run preview -- --port 4173` e executar `node scripts/measure-postcard.mjs`. Requer o Chromium do Playwright instalado; `SHUSH_CHROMIUM_PATH` permite escolher um executável equivalente. Os tempos do cenário incluem a automação e 100 ms de estabilização; são uma amostra sintética, não um benchmark estatístico. Não existe linter dedicado no projeto: as verificações de código incluem TypeScript estrito/noUnused, validação de dados e testes; não se alega uma execução ESLint.

A execução funcional local completa nos oito projetos Chromium terminou com **554 aprovados, 102 exclusões por formato, zero falhas**, reservando as comparações de pixels para o ambiente de referência da CI. O build final mede **112,29 KiB de JS e 23,84 KiB de CSS gzip**, com os budgets originais preservados.
