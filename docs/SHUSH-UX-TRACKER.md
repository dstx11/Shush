# SHUSH — Acompanhamento dos 66 requisitos de UX

Esta lista preserva o âmbito acordado. Não confunde código existente, alterações novas e conclusão verificada. Nenhum ponto fica concluído apenas por estar escrito nesta tabela.

## Estados

- **Aplicado nesta revisão:** há implementação nova; o fecho exige validação funcional e visual específica.
- **Parcial / existente:** existe uma base, mas ainda falta rever toda a abrangência do requisito.
- **Por implementar:** não existe cobertura suficiente para o dar como aplicado.

| ID | Requisito | Estado | Evidência / próximo critério |
|---|---|---|---|
| 01 | Composição estável | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 02 | Transições de luz | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 03 | Profundidade pelo contraste | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 04 | Fundos que respiram lentamente | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 05 | Revelações por máscaras | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 06 | Texturas e materialidade discretas | Aplicado nesta revisão | `src/styles/cozy.css` + teste de estados de cópia; rever desktop/mobile e movimento reduzido. |
| 07 | Continuidade entre estados | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 08 | Momentos de repouso | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 09 | Hover, pressão e conclusão distintos | Aplicado nesta revisão | `src/styles/cozy.css` + teste de estados de cópia; rever desktop/mobile e movimento reduzido. |
| 10 | Pressão visual subtil | Aplicado nesta revisão | `src/styles/cozy.css` + teste de estados de cópia; rever desktop/mobile e movimento reduzido. |
| 11 | Contornos que se iluminam | Aplicado nesta revisão | `src/styles/cozy.css` + teste de estados de cópia; rever desktop/mobile e movimento reduzido. |
| 12 | Ícones que comunicam a ação | Aplicado nesta revisão | `CopyIcon.tsx`, `PlayerActions`, `DropSection`: sucesso real, nome acessível estável e largura reservada; teste de regressão. |
| 13 | Confirmação sem alterar a largura | Aplicado nesta revisão | `CopyIcon.tsx`, `PlayerActions`, `DropSection`: sucesso real, nome acessível estável e largura reservada; teste de regressão. |
| 14 | Seleção persistente distinta do hover | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 15 | Hierarquia das ações | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 16 | Foco de teclado visível | Aplicado nesta revisão | `src/styles/cozy.css` + teste de estados de cópia; rever desktop/mobile e movimento reduzido. |
| 17 | Feedback imediato no toque | Aplicado nesta revisão | `src/styles/cozy.css` + teste de estados de cópia; rever desktop/mobile e movimento reduzido. |
| 18 | Erros junto da ação | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 19 | Um palco permanente no roster | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 20 | Transições de retratos sem vazio | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 21 | Iluminação individual | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 22 | Revelação curta do nome | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 23 | Seleção imediatamente reconhecida | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 24 | Pré-visualização discreta no hover | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 25 | Dossier com continuidade | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 26 | Informação em camadas | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 27 | Partilha contextual do jogador | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 28 | Seleção acessível no mobile durante o dossier | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 29 | Continuidade desde o primeiro ecrã | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 30 | Revelação da identidade pela luz | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 31 | Saída da intro ligada à página | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 32 | Detalhe sazonal discreto na intro | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 33 | Continuidade entre páginas | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 34 | Reconhecimento imediato da navegação | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 35 | Direção fotográfica consistente | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 36 | Conteúdo próprio por secção | Por implementar | Depende de conteúdo real adicional da equipa; não substituir por histórias ou dados inventados. |
| 37 | Variedade de composição | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 38 | Feedback contextual de personalização | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 39 | Filtros sem saltos de posição | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 40 | Materialidade própria por época | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 41 | Loading, vazio, erro e sucesso cuidados | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 42 | Linguagem comum de interação | Aplicado nesta revisão | `src/styles/cozy.css` + teste de estados de cópia; rever desktop/mobile e movimento reduzido. |
| 43 | Regresso ao ponto exato | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 44 | Histórico coerente do browser | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 45 | Ligações diretas completas | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 46 | Destino de navegação identificável | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 47 | Navegação móvel ao alcance do polegar | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 48 | Alternativas ao hover | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 49 | Separar seleção de abertura de detalhes | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 50 | Identidade visual coerente por jogador | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 51 | Preparação inteligente do próximo retrato | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 52 | Última seleção sempre correta | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 53 | Enquadramento individual por fotografia | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 54 | Dossier adaptado aos dados reais | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 55 | Tolerância a cliques repetidos | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 56 | Distinguir cancelamento de erro | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 57 | Desfazer alterações reversíveis | Por implementar | Adicionar recuperação da configuração anterior sem interferir com os rascunhos existentes. |
| 58 | Guardar sem interromper | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 59 | Validação no momento certo | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 60 | Recuperação sem perda de trabalho | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 61 | Reservar espaço para recursos | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 62 | Textos longos e Unicode | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 63 | Decoração sem falsas affordances | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 64 | Contraste sobre fotografias | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 65 | Retoma após interrupções | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |
| 66 | Revisão em condições reais | Parcial / existente | Rever o percurso completo e registar evidência específica antes de fechar. |

## Critérios de fecho

Cada ponto deve registar componente/rota, comportamento esperado, teste ou revisão visual, limitações e commit publicado. As verificações globais do build e os testes antigos são necessários, mas não demonstram por si só que os 66 requisitos estão concluídos.

## Revisão atual — bordas, superfícies e controlos

Sistema comum de contornos suaves e realces interiores aplicado aos painéis principais das seis áreas públicas, respeitando as cores sazonais. Hover e pressão usam contorno/luz, sem deslocar o botão. Cópia de Riot ID e resumo mostra progresso/sucesso real no próprio controlo e mantém a largura. Retratos do hero/roster e revelações de secções deixam de acompanhar lateralmente o cursor. Dados, fotografias e disponibilidade comercial permanecem factuais.
