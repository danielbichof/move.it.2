# 05 — Sistema M

## Objetivo

Organizar **de onde vem o foco** do ciclo, sem transformar o Move.it em um gerenciador de produtividade.

> Foco atual → ciclo de 35 min → desafio → XP → progressão

## Base obrigatória

Preservar integralmente: ciclo de 35 minutos, iniciar/abandonar, desafio ao fim do ciclo, Completei/Falhei, XP por desafio concluído (nunca por minuto, item ou pilar), levels e progresso.

## Tela Hoje

Existe uma única experiência principal, **Hoje**, que responde "O que importa agora?". Não há outras rotas.

Hierarquia: foco atual com **Iniciar ciclo** → pilares → Inbox → progresso. Durante o ciclo ficam só o foco, o Timer e a captura rápida; pilares e Inbox somem.

## Pilares

Três pilares, cada um com uma lista simples de itens (título apenas):

- **Estabilidade**: o que mantém a vida funcionando (trabalho, responsabilidades, compromissos e, quando fizer sentido, formação).
- **Crescimento**: onde o usuário tenta evoluir de propósito (carreira, backend, estudos profissionais).
- **Laboratório**: hobbies, experimentos e projetos pessoais.

"Formação" não é um pilar: vive em Estabilidade ou Crescimento conforme o contexto.

Cada item pode ser criado, removido e marcado como **foco** (**Focar**). Há no máximo um foco; remover o item em foco limpa o foco. Itens não são tarefas: sem subtarefas, prazo, prioridade, estado ou Kanban.

## Inbox

Captura rápida: "isso surgiu, registro agora e decido depois onde colocar". Só texto. Cada entrada pode ser movida para um pilar (vira item e sai da Inbox) ou descartada. A captura também funciona dentro do Timer, durante o ciclo.

## Dados e persistência

- Progresso e Sistema M ficam no Postgres, cada registro com dono (`userId`). Ver [04-persistencia.md](04-persistencia.md).
- Tipos em [src/lib/system-m.ts](../../src/lib/system-m.ts); estado e mutações em [src/contexts/system-m-context.tsx](../../src/contexts/system-m-context.tsx), que atualiza a tela na hora e grava pelas server actions de [src/lib/system-m-actions.ts](../../src/lib/system-m-actions.ts).
- O que um navegador ainda guardava no `localStorage` (chave `moveit:sistema-m-v2`) é importado para o banco na primeira visita e apagado depois.
- O app começa vazio, sem exemplos.

## Fora do escopo

Páginas de Projetos, Semana, Temporada, Formação e Estatísticas; dashboard; Kanban, subtarefas, hábitos, ranking, moedas; registro de sessões e tempo por pilar; capacidade semanal; XP por minuto.

**O Sistema M deve caber dentro do Move.it. O Move.it não deve ser reconstruído para caber dentro do Sistema M.**
