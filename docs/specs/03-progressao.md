# Spec 03: Progressão (experiência e levels)

**Status**: implementado · **Prefixo**: `PRO`

## Objetivo

Dar ao usuário um motivo para repetir o hábito: cada desafio completo rende xp, o xp acumulado sobe o level, e o progresso fica sempre visível na tela.

## Histórias de usuário

- Como usuário, quero ver meu level e quanto falta para o próximo, para ter uma meta de curto prazo.
- Como usuário, quero ver quantos desafios já completei, para acompanhar minha constância.
- Como usuário, quero ser parabenizado ao subir de level, para sentir que o esforço foi reconhecido.

## Requisitos

| ID     | Requisito                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| PRO-01 | Um usuário novo começa no level 1, com 0 xp e 0 desafios completos.                                                                        |
| PRO-02 | A meta de xp para sair de um level é `((level + 1) * 4)²`.                                                                                 |
| PRO-03 | Quando um desafio é completado, o sistema soma o xp do desafio ao xp atual e soma um aos desafios completos.                               |
| PRO-04 | Quando o xp atual atinge ou ultrapassa a meta, o sistema sobe um level e mantém como xp atual o excedente sobre a meta.                    |
| PRO-05 | Um desafio completo sobe no máximo um level.                                                                                               |
| PRO-06 | A barra de experiência exibe `0 xp` à esquerda, a meta do level à direita e o xp atual marcado na posição proporcional ao progresso.       |
| PRO-07 | O perfil exibe o level atual, e o contador "Desafios Completos" exibe o total acumulado.                                                   |
| PRO-08 | Quando o usuário sobe de level, o sistema exibe um modal com o novo level e a mensagem "Parabéns / Você alcançou um novo level".           |
| PRO-09 | O modal de level up permanece aberto até o usuário clicar no botão de fechar.                                                              |
| PRO-10 | Barra, level e contador são atualizados imediatamente ao clicar em **Completei**, sem esperar a gravação do progresso.                     |

### Tabela de metas

| Level atual | Meta de xp | xp acumulado desde o level 1 |
| ----------- | ---------- | ---------------------------- |
| 1           | 64         | 64                           |
| 2           | 144        | 208                          |
| 3           | 256        | 464                          |
| 4           | 400        | 864                          |
| 5           | 576        | 1440                         |

Com a média de cerca de 81 xp por desafio, o level 2 costuma chegar no primeiro desafio completo e o level 5 por volta do 11º.

## Critérios de aceite

**Ganhar xp sem subir de level**
- Dado que estou no level 2 com 50 xp (meta 144)
- Quando completo um desafio de 80 xp
- Então fico no level 2 com 130 xp e a barra avança para cerca de 90%

**Subir de level com excedente**
- Dado que estou no level 1 com 40 xp (meta 64)
- Quando completo um desafio de 80 xp
- Então passo ao level 2 com 56 xp, a meta da barra vira 144 e o modal de level up exibe "2"

**Fechar o modal**
- Dado que o modal de level up está aberto
- Quando clico no botão de fechar
- Então o modal some e o level novo continua exibido no perfil

**Atualização imediata**
- Dado que há um desafio ativo
- Quando clico em **Completei**
- Então barra de xp e contador de desafios mudam no mesmo instante

## Design técnico

- **Estado**: `ChallengesProvider` em [src/contexts/challenges-context.tsx](../../src/contexts/challenges-context.tsx) recebe `initialProgress` do servidor e o envolve em `useOptimistic`. `experienceToNextLevel` é derivado do level a cada render.
- **Crédito de xp**: `completeChallenge` calcula o novo progresso, aplica a atualização otimista (`PRO-10`), abre o modal se houve level up e chama a server action `completeChallenge` de [src/lib/cookies-actions.ts](../../src/lib/cookies-actions.ts), que refaz o cálculo e grava o resultado (ver [04-persistencia.md](04-persistencia.md)).
- **Regra duplicada**: a fórmula de `PRO-02` e a regra de `PRO-04` existem no contexto (valor otimista) e na server action (valor gravado). Qualquer mudança precisa ser feita nos dois lugares, ou a tela mostra um valor e o cookie guarda outro.
- **Interface**:
  - [src/components/experience-bar.tsx](../../src/components/experience-bar.tsx): barra e marcador de xp.
  - [src/components/profile.tsx](../../src/components/profile.tsx): level, ao lado de nome e avatar.
  - [src/components/completed-challenges.tsx](../../src/components/completed-challenges.tsx): contador.
  - [src/components/level-up-modal.tsx](../../src/components/level-up-modal.tsx): modal, renderizado pelo próprio `ChallengesProvider` enquanto `isLevelUpModalOpen` for verdadeiro.

## Fora de escopo

- Level máximo: a progressão não tem teto.
- Perda de xp ou de level.
- Ranking, conquistas e comparação entre usuários.
- Perfil editável: nome e avatar são fixos no código.

## Questões em aberto

1. **Ritmo dos primeiros levels**: a meta do level 1 (64 xp) é menor que o xp de 9 dos 12 desafios, então na maioria das vezes o primeiro desafio completo já sobe o usuário para o level 2. É o efeito desejado para a primeira sessão?
2. **Fechar o modal**: o modal só fecha pelo botão; não responde a `Esc` nem a clique fora. Deve aceitar essas formas?
3. **Compartilhamento**: existe um ícone `twitter.svg` e a cor `--blue-twitter` sem uso. O modal deve ter um botão de compartilhar o level?
4. **Identidade do usuário**: o perfil mostra um nome e avatar fixos. O produto terá perfil por usuário (por exemplo, login com GitHub)?
5. **Fonte única da regra**: a duplicação descrita no design técnico deve ser eliminada, extraindo a regra para uma função compartilhada entre cliente e servidor?
