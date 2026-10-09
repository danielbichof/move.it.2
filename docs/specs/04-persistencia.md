# Spec 04: Persistência

**Status**: implementado · **Prefixo**: `PER`

## Objetivo

Fazer o progresso (level, xp e desafios completos) e o Sistema M (itens, foco, Inbox, hábitos, nome e duração do ciclo) sobreviverem ao recarregamento e à troca de navegador ou dispositivo.

## Histórias de usuário

- Como usuário, quero reencontrar meu level, meu xp e minhas listas ao reabrir o app, para não recomeçar do zero.
- Como usuário, quero anotar algo no celular e ver no computador, para usar o app onde eu estiver.
- Como usuário que já usava o app, quero que o que estava salvo no navegador continue lá depois da mudança para o banco.

## Requisitos

| ID     | Requisito                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| PER-02 | Ao carregar a página, o servidor lê os dados e renderiza a tela já com o progresso e as listas salvos.                                      |
| PER-03 | Na primeira visita o sistema cria o usuário com os valores iniciais: level 1, 0 xp, 0 desafios completos e ciclo de 35 minutos.             |
| PER-04 | Quando um desafio é completado, o servidor recalcula o progresso a partir do que está gravado e do xp do desafio.                           |
| PER-05 | Após gravar, o servidor revalida a página inicial, e a tela passa a refletir o que foi gravado.                                             |
| PER-06 | Leitura e gravação acontecem apenas no servidor, por server actions.                                                                        |
| PER-08 | Os dados ficam em um banco Postgres. Cada registro pertence a um usuário (`userId`).                                                        |
| PER-09 | Enquanto não há login existe um único usuário, e o acesso exige a senha definida em `APP_SECRET`. Em desenvolvimento, sem a variável, o acesso é livre; em produção, sem ela, o acesso é negado. |
| PER-10 | Toda action valida o que recebe do cliente antes de gravar. O xp de um desafio só é aceito se existir no catálogo.                          |
| PER-11 | Uma mudança aparece na tela na hora. Se a gravação falhar, a mudança é desfeita e o sistema avisa que não foi possível salvar.              |
| PER-12 | Quando a aba volta a ficar visível, a tela busca de novo os dados gravados.                                                                 |
| PER-13 | Na primeira visita de um navegador que ainda guarda dados antigos (Sistema M no `localStorage`, progresso em cookies), o sistema os importa para o banco e os apaga do navegador. |
| PER-14 | A importação não duplica registros nem sobrescreve o que o banco já tem: o progresso dos cookies só entra se tiver mais desafios completos. |

`PER-01` (progresso em cookies) e `PER-07` (uso sem banco) foram substituídos por `PER-08` e `PER-09`.

## Critérios de aceite

**Primeiro acesso**
- Dado que o banco não tem dados e o navegador não guarda nada antigo
- Quando abro a página
- Então vejo level 1, 0 xp na barra (meta 64), 0 desafios completos e listas vazias

**Dados em outro navegador**
- Dado que completei desafios e adicionei itens em um navegador
- Quando abro o app em outro navegador e informo a senha
- Então vejo o mesmo level, o mesmo xp e as mesmas listas

**Gravação ao completar**
- Dado que há um desafio ativo de 80 xp e estou no level 1 com 40 xp
- Quando clico em **Completei**
- Então passo ao level 2 com 56 xp e um desafio completo a mais

**Importação**
- Dado que meu navegador guarda itens no `localStorage` e progresso em cookies, e o banco está vazio
- Quando abro a página
- Então os itens e o progresso aparecem, e o navegador deixa de guardar a chave `moveit:sistema-m-v2` e os cookies `level`, `currentExperience` e `challengesCompleted`

**Acesso sem senha**
- Dado que `APP_SECRET` está definida e não informei a senha
- Quando abro a página
- Então vejo só o formulário de senha

## Design técnico

- **Banco**: Postgres com Drizzle: em desenvolvimento, o container de `docker-compose.yml` (`pnpm db:up`); em produção, a Neon. Esquema em [src/lib/db/schema.ts](../../src/lib/db/schema.ts) (`users`, `items`, `inbox_items`, `habits`), conexão em [src/lib/db/index.ts](../../src/lib/db/index.ts), migrations em `drizzle/`. O driver é o `node-postgres`, igual nos dois ambientes; gravações com mais de um comando usam `db().transaction`.
- **Leitura**: [app/page.tsx](../../app/page.tsx) chama `loadAppData` ([src/lib/app-data.ts](../../src/lib/app-data.ts)), que lê tudo e entrega o progresso ao `ChallengesProvider` e o Sistema M ao `SystemMProvider`.
- **Gravação**: [src/lib/progress-actions.ts](../../src/lib/progress-actions.ts) (`completeChallenge`) e [src/lib/system-m-actions.ts](../../src/lib/system-m-actions.ts) (uma action por mudança). Os providers aplicam a mudança com `useOptimistic` e chamam a action dentro de `startTransition`.
- **Acesso**: [src/lib/session.ts](../../src/lib/session.ts). `requireUserId` abre toda action e devolve o usuário fixo; a senha vira um cookie `httpOnly` com um derivado dela. É o ponto onde o login vai entrar.
- **Importação**: [src/components/legacy-import.tsx](../../src/components/legacy-import.tsx) envia o texto do `localStorage` para `importLegacy`, que o valida com `parseSystemM` e lê os cookies antigos no servidor.
- **Ids**: gerados no cliente (`newId`), para que o registro mostrado na hora seja o mesmo que o servidor grava.
- **Dia do hábito**: o cliente envia o dia local (`YYYY-MM-DD`); o servidor não conhece o fuso do usuário.

## Fora de escopo

- Contas de usuário, cadastro e login.
- Persistir o ciclo em andamento ou o desafio ativo.
- Zerar o progresso pela interface.
- Uso offline: sem conexão, as mudanças não são gravadas.

## Questões em aberto

1. **Duas abas ao mesmo tempo**: `completeChallenge` lê e depois grava. Dois desafios completados no mesmo instante em dispositivos diferentes podem contar como um. Vale trocar por um incremento atômico?
2. **Falha ao carregar**: sem banco disponível a página mostra o erro padrão do Next. Deve haver uma tela própria?
3. **Login**: quando houver contas, o usuário fixo vira a conta do Daniel ou os dados são migrados para um novo id?
