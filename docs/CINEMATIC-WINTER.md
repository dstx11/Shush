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

SHUSH Hearth é um subset WOFF2 de Lora, com eixo variável 400–700 e versões normal/itálica. Está alojado localmente, inclui os acentos portugueses e mantém a licença SIL OFL. O nome interno foi alterado por respeito ao Reserved Font Name. Fontes originais, licença e alterações estão identificadas em `public/assets/fonts/README.txt` e `Lora-OFL.txt`. Manrope mantém-se nos controlos, nomes e dados competitivos.

`winter.css` foi consolidado num único sistema sazonal, retirando as camadas anteriores de overrides. O CSS do lobby continua separado por rota, com os links de pré-render da PR #12. Não se acrescentaram dependências de produção, WebGL ou bibliotecas de partículas. Canvas mantém DPR limitado a 2 e aproximadamente 30 fps, com cancelamento real quando pausado, invisível, fora do ecrã ou em movimento reduzido.

As seis rotas, os sete jogadores reais, Premier, perfis, personalizador, URLs, postais PNG e conteúdo sem JavaScript mantêm-se. Os metadados/schema e cabeçalhos de segurança não foram redesenhados. Esta branch inclui as correções da PR #12, ainda não integrada na master.

## Validação e revisão

A primeira validação local passou TypeScript, dados Premier/perfis/Drop, testes de ciclo e seleção de árvore, assets, links, build, pré-render/SEO/segurança e orçamentos. Medição inicial: 109,41 KiB de JavaScript e 22,57 KiB de CSS gzip, face a 108,52/23,56 KiB na PR #12. A nova fonte local é um recurso separado (normal e itálica, aproximadamente 93 KiB em conjunto), não incluído no orçamento JS/CSS. A face normal é pré-carregada; a itálica é pedida quando usada.

Não há alegações de melhoria medida de LCP, INP ou CLS. O browser local desta sessão tem as limitações de execução documentadas na auditoria anterior, pelo que os testes de interface, capturas e WebKit são executados na CI.

A mudança de direção artística altera deliberadamente as oito referências visuais antigas. As assertions permanecem ativas: as primeiras diferenças servem para inspecionar o resultado antes de aprovar referências novas. A CI guarda também as três variantes em desktop e mobile. O estado final de validação e as capturas revistas constam da PR.

Sem merge nem publicação em produção sem aprovação do proprietário.
