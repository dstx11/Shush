# SHUSH · Um inverno nosso

## Direção e referência

O vídeo fornecido (20 segundos) mostra pontos de luz que se organizam numa árvore, com uma subida progressiva desde o chão, rotação lenta e estrela a acender no final. A adaptação usa esse ritmo, sem copiar o código nem obrigar o visitante a assistir a 20 segundos de loading.

Paleta: noite verde, âmbar, luz de vela e pequenos apontamentos de neve/veludo. O contraste entre Manrope e uma serifa suave distingue as histórias da informação competitiva. Molduras em arco e contornos finos aproximam a árvore de uma janela para um pequeno jardim de inverno. A neve global foi reduzida a uma camada subtil.

## Árvores e movimento

- **Bosque de âmbar:** copa cheia, verde quente, enfeites vermelhos/dourados, espirais e brilho de vela.
- **Silêncio de neve:** árvore mais alta e estreita, mais camadas, ramos mais curtos, geada abundante, ornamentos mais espaçados e luz fria.
- **Noite de veludo:** copa mais larga e baixa, ramos com degraus e maior queda, cadência de espiral diferente e tons lilás/rosa.

Cada documento escolhe uma variante antes do primeiro desenho. O módulo mantém a escolha durante React StrictMode e navegação SPA. localStorage guarda a anterior e a seleção exclui essa variante; sem acesso a storage, a escolha continua funcional e estável durante o documento, mas a não repetição entre documentos não pode ser garantida. Não há seletor manual.

A copa forma-se por camadas, com pontos luminosos na frente de crescimento, depois luzes e estrela. Duração visual aproximada: 1,65 s na primeira visita e 0,65 s em visitas da mesma sessão. Não bloqueia a utilização. Movimento reduzido apresenta a composição final imediatamente. Pausar/retomar, luzes, arrasto e rotação por teclado continuam disponíveis. Alterar as luzes não reinicia a revelação.

A introdução é um dialog nativo, com Escape e botão Entrar. Aguarda recursos iniciais e o primeiro desenho da árvore; depois sai num fade de 360 ms, sem permanência mínima. Um limite de 1600 ms impede que uma falha de recurso bloqueie o site. Não há reprodução durante navegação SPA; o acesso com movimento reduzido ou sessionStorage indisponível não abre a introdução.

## Tipografia e manutenção

SHUSH Hearth é um subset WOFF2 de Lora, com eixo variável 400–700 e versões normal/itálica. Está alojado localmente, inclui os acentos portugueses e mantém a licença SIL OFL. O nome interno foi alterado por respeito ao Reserved Font Name. Fontes originais, licença e alterações estão identificadas em `public/assets/fonts/README.txt` e `Lora-OFL.txt`. Manrope mantém-se nos controlos, nomes, impressão da camisola e dados competitivos. Manrope e IBM Plex Mono também passaram a WOFF2 local, com os ficheiros originais fornecidos pelo Google Fonts e respetivas licenças, eliminando o stylesheet externo. As seis faces somam 159,86 KiB; só as faces normais serifada e Manrope são pré-carregadas.

`winter.css` foi consolidado num único sistema sazonal, retirando as camadas anteriores de overrides. O CSS do lobby continua separado por rota, com os links de pré-render da PR #12. Não se acrescentaram dependências de produção, WebGL ou bibliotecas de partículas. Canvas mantém DPR limitado a 2 e um limite de desenho de aproximadamente 30 fps, com cancelamento real quando pausado, invisível, fora do ecrã ou em movimento reduzido.

Os traços de agulhas são agrupados em três caminhos por ramo, em vez de dezasseis strokes individuais. A formação segue tempo real, mesmo quando o relógio da física é limitado em frames lentos.

As seis rotas, os sete jogadores reais, Premier, perfis, personalizador, URLs, postais PNG e conteúdo sem JavaScript mantêm-se. Os metadados/schema e cabeçalhos de segurança não foram redesenhados. Esta branch inclui as correções da PR #12, ainda não integrada na master.

## Validação e revisão

A primeira validação local passou TypeScript, dados Premier/perfis/Drop, testes de ciclo e seleção de árvore, assets, links, build, pré-render/SEO/segurança e orçamentos. Medição final local: 109,85 KiB de JavaScript e 22,86 KiB de CSS gzip, face a 108,52/23,56 KiB na PR #12. Os recursos de fonte são contabilizados separadamente, não no orçamento JS/CSS. A face normal é pré-carregada; a itálica é pedida quando usada.

Não há alegações de melhoria medida de LCP, INP ou CLS. A limitação do browser local foi resolvida com o Chrome Headless Shell oficial 156.0.8078.79. Chromium pode agora executar os testes e gerar capturas localmente; WebKit continua a ser validado na CI.

A mudança de direção artística alterou deliberadamente as oito referências visuais antigas. As diferenças foram inspecionadas antes da aprovação de novas referências; as assertions permaneceram ativas. A CI guarda também as três variantes em desktop e mobile. O estado final de validação e as capturas revistas constam da PR.

Sem merge nem publicação em produção sem aprovação do proprietário.

## Referências visuais revistas

Foram inspecionadas as oito regiões existentes e seis capturas das três árvores em 390/1366 px, incluindo composição, acentos portugueses, contornos, impressão da camisola e ordem de foco. As referências antigas foram substituídas apenas após esta revisão da direção artística intencional. As três variantes passam também a ter assertions de pixel, totalizando 14 comparações. Não se aumentaram tolerâncias nem se mascararam regiões para fazer passar testes. As setas decorativas usam um SVG partilhado, evitando emojis e variações de fonte entre plataformas.

A primeira CI (43129505744, aa02049) teve 534 testes aprovados, 60 exclusões por formato e apenas as oito diferenças esperadas face ao design anterior. O estado final, após os refinamentos e as referências revistas, é registado na descrição da PR.

A validação local das regiões e das três variantes terminou com 18 testes aprovados, incluindo 14 comparações de pixels, sem alterar tolerâncias. O SVG partilhado preserva os ícones monocromáticos e a impressão da camisola mantém Manrope. A ordem mobile é título, árvore e história/ações, com a ordem de foco correspondente.

A CI 43132185863 confirmou 530 testes funcionais aprovados (incluindo WebKit), 60 exclusões por formato e 12 diferenças pequenas nas referências locais. Foram revistos os PNG completos e os mapas de diferenças: retratos, árvores e composição estavam completos. As referências foram uniformizadas com as capturas do Chromium da CI, mantendo as tolerâncias existentes. O texto da introdução passou a ser legível desde o primeiro frame, mesmo quando os recursos ficam prontos imediatamente.

A revisão final do preview encontrou o glifo de pausa ausente num browser. Os controlos de luz, pausa e reprodução passaram a SVG inline, preservando os rótulos e estados acessíveis; os oito testes locais de inverno/postais passaram após esta correção.

A CI 43134940884 aprovou 534 testes e excluiu 60 casos por formato. As oito diferenças ficaram limitadas aos controlos substituídos por SVG. A revisão revelou que o reset CSS colocava o SVG numa segunda linha; os botões passaram a inline-flex com alinhamento centrado e ícones sem shrink, revistos em 390/1366 px. As referências finais são revistas no ambiente da CI antes da matriz completa final.

A revisão 43197491480 confirmou que as diferenças finais ficam exclusivamente nas duas utilidades da árvore. Foram aprovadas as seis capturas de árvore e dois heróis com SVG e alinhamento corretos. As restantes seis comparações já passaram; tolerâncias e regiões permanecem intactas. A matriz completa é novamente executada no commit final, com o comando original de CI restaurado.
