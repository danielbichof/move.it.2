# Spec 04: Persistência do progresso

**Status**: implementado · **Prefixo**: `PER`

## Objetivo

Fazer o progresso do usuário (level, xp e desafios completos) sobreviver ao recarregamento da página, sem exigir cadastro nem login.

## Histórias de usuário

- Como usuário, quero reencontrar meu level e meu xp ao reabrir o app, para não recomeçar do zero.
- Como usuário, quero usar o app sem criar conta, para começar imediatamente.

## Requisitos

| ID     | Requisito                                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| PER-01 | O progresso é guardado em três cookies do navegador: `level`, `currentExperience` e `challengesCompleted`.                             |
| PER-02 | Ao carregar a página, o servidor lê os cookies e renderiza a tela já com o progresso salvo.                                            |
| PER-03 | Na ausência de um cookie, o sistema assume o valor inicial: level 1, 0 xp e 0 desafios completos.                                      |
| PER-04 | Quando um desafio é completado, o servidor recalcula o progresso a partir dos cookies e do xp do desafio e grava os três cookies.      |
| PER-05 | Após gravar, o servidor revalida a página inicial, e a tela passa a refletir o progresso gravado.                                      |
| PER-06 | A leitura e a gravação de cookies acontecem apenas no servidor, por server actions.                                                    |
| PER-07 | O uso do app não exige cadastro, login nem banco de dados.                                                                             |

## Critérios de aceite

**Primeiro acesso**
- Dado que o navegador não tem cookies do app
- Quando abro a página
- Então vejo level 1, 0 xp na barra (meta 64) e 0 desafios completos

**Progresso mantido no reload**
- Dado que completei desafios e estou no level 2 com 56 xp
- Quando recarrego a página
- Então continuo no level 2 com 56 xp e o mesmo total de desafios completos

**Gravação ao completar**
- Dado que há um desafio ativo de 80 xp e meus cookies indicam level 1 e 40 xp
- Quando clico em **Completei**
- Então os cookies passam a `level=2`, `currentExperience=56` e `challengesCompleted` com um a mais

## Design técnico

- **Server actions**: [src/lib/cookies-actions.ts](../../src/lib/cookies-actions.ts) (`'use server'`).

  | Action               | Papel                                                                     |
  | -------------------- | ------------------------------------------------------------------------- |
  | `getUserProgress`    | Lê os três cookies e aplica os valores iniciais (`PER-02`, `PER-03`)      |
  | `completeChallenge`  | Recalcula o progresso e delega a gravação (`PER-04`)                      |
  | `updateUserProgress` | Grava os campos informados e chama `revalidatePath('/')` (`PER-05`)       |
  | `levelUp`            | Incrementa o level; não é chamada por nenhuma tela                        |

- **Leitura**: [app/page.tsx](../../app/page.tsx) é um server component que chama `getUserProgress` e passa o resultado como `initialProgress` ao `ChallengesProvider`.
- **Gravação**: o `ChallengesProvider` chama `completeChallenge(amount)` dentro de `startTransition`. Enquanto a action roda, a tela mostra o valor otimista; ao terminar, a revalidação entrega o valor gravado (ver [03-progressao.md](03-progressao.md), `PRO-10`).
- **Formato**: cada cookie guarda um número como texto, convertido com `Number()` na leitura. Os cookies são gravados sem opções (sem `maxAge`, `expires`, `httpOnly`, `secure` ou `sameSite`).
- **Sem banco**: a `DATABASE_URL` do `.env` não é usada.
- **Sistema M fora dos cookies**: itens dos pilares, foco atual e Inbox ficam no `localStorage`, em uma chave versionada (`moveit:sistema-m-v2`), e nunca se misturam com o progresso. Ver [05-sistema-m.md](05-sistema-m.md).

## Fora de escopo

- Sincronizar o progresso entre navegadores ou dispositivos.
- Contas de usuário e autenticação.
- Persistir o ciclo em andamento ou o desafio ativo: só o progresso é salvo.
- Zerar o progresso pela interface.

## Questões em aberto

1. **Progresso some ao fechar o navegador**: sem `maxAge` ou `expires`, os cookies são de sessão e o navegador pode descartá-los ao ser fechado. Isso contradiz o objetivo da feature. Qual validade os cookies devem ter?
2. **Valores adulteráveis**: os cookies não são `httpOnly` nem assinados, e a action `completeChallenge` aceita qualquer valor de xp enviado pelo cliente. O usuário consegue definir o próprio level. Aceitável para um jogo individual, mas vira problema se houver ranking ou conta. O servidor deve validar o xp contra o catálogo?
3. **Cookie inválido**: um cookie com texto não numérico vira `NaN` e se espalha por level, barra e meta. A leitura deve validar e cair no valor inicial?
4. **Falha na gravação**: se a server action falhar, o valor otimista é desfeito e o usuário não recebe nenhuma explicação. Deve haver mensagem de erro ou nova tentativa?
5. **Actions sem uso**: `levelUp` não é usada, e `updateUserProgress` fica exposta como server action pública que grava qualquer progresso. Remover a primeira e tornar a segunda uma função interna?
6. **Futuro com contas**: se o produto ganhar login (ver [03-progressao.md](03-progressao.md), questão 4), o progresso migra para um banco? O que acontece com o progresso em cookie de quem já usa o app?
