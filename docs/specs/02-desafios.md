# Spec 02: Desafios

**Status**: implementado · **Prefixo**: `DES`

## Objetivo

Transformar a pausa entre ciclos em um cuidado rápido com o corpo: ao fim de cada ciclo de foco, o usuário recebe um exercício curto de alongamento ou de descanso para os olhos, valendo xp.

## Histórias de usuário

- Como usuário, quero ser avisado quando o ciclo acabar, mesmo estando em outra aba, para não perder a pausa.
- Como usuário, quero receber um exercício simples e objetivo para saber exatamente o que fazer na pausa.
- Como usuário, quero dizer se completei ou não o desafio, para ser recompensado apenas quando cumpro.

## Requisitos

| ID     | Requisito                                                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| DES-01 | Sem desafio ativo, o painel exibe a mensagem "Finalize um ciclo para receber um desafio".                                                      |
| DES-02 | Quando um ciclo é encerrado, o sistema sorteia um desafio do catálogo, com a mesma probabilidade para todos.                                   |
| DES-03 | Quando um desafio é sorteado, o sistema toca um som de notificação. Se o navegador bloquear o áudio, o desafio aparece normalmente.            |
| DES-04 | Quando um desafio é sorteado e o navegador já tem permissão de notificação, o sistema exibe a notificação "Novo desafio 🎉 / Valendo N xp".    |
| DES-05 | O painel do desafio ativo exibe o xp em jogo ("Ganhe N xp"), o ícone do tipo, o título "Novo desafio" e a descrição do exercício.              |
| DES-06 | O painel do desafio ativo exibe os botões **Falhei** e **Completei**.                                                                          |
| DES-07 | Quando o usuário clica em **Completei**, o sistema credita o xp do desafio, soma um aos desafios completos e fecha o desafio.                  |
| DES-08 | Quando o usuário clica em **Falhei**, o sistema fecha o desafio sem alterar xp, level nem a contagem de desafios completos.                    |
| DES-09 | Enquanto a resposta é processada, os dois botões ficam desabilitados e exibem "Processando...".                                                |
| DES-10 | Há no máximo um desafio ativo por vez.                                                                                                         |

### Catálogo

O catálogo tem 12 desafios: 9 do tipo `body` (alongamento) e 3 do tipo `eye` (descanso visual). O xp varia de 50 a 140, com média de cerca de 81 por desafio.

| Campo         | Regra                                                               |
| ------------- | ------------------------------------------------------------------- |
| `type`        | `'body'` ou `'eye'`; define o ícone em `public/icons/<type>.svg`    |
| `description` | Instrução em pt-BR, executável em poucos minutos sem equipamento    |
| `amount`      | xp concedido ao completar; inteiro positivo                         |

## Critérios de aceite

**Receber um desafio**
- Dado que um ciclo ativo chega a `00:00`
- Quando o ciclo é encerrado
- Então o painel mostra um desafio do catálogo com seu xp, ícone e descrição, e o som de notificação toca

**Completar um desafio**
- Dado que há um desafio ativo valendo 80 xp
- Quando clico em **Completei**
- Então meu xp aumenta em 80, os desafios completos aumentam em 1 e o painel volta à mensagem inicial

**Falhar um desafio**
- Dado que há um desafio ativo
- Quando clico em **Falhei**
- Então o painel volta à mensagem inicial e xp, level e desafios completos permanecem iguais

**Notificação sem permissão**
- Dado que o navegador não concedeu permissão de notificação
- Quando um desafio é sorteado
- Então nenhuma notificação do sistema aparece, e o desafio é exibido no painel normalmente

## Design técnico

- **Catálogo**: array `challenges` em [src/lib/challenges-data.ts](../../src/lib/challenges-data.ts), tipado pela interface `Challenge`. O `challenges.json` da raiz não é usado.
- **Sorteio**: `startNewChallenge` em [src/contexts/challenges-context.tsx](../../src/contexts/challenges-context.tsx) escolhe um índice com `Math.random`, grava `activeChallenge`, toca `/notification.mp3` e cria a `Notification`.
- **Gatilho**: `startNewChallenge` é chamado pelo `CountdownProvider` quando o tempo zera (ver [01-ciclo-de-foco.md](01-ciclo-de-foco.md), `CIC-07`).
- **Interface**: [src/components/challenge-box.tsx](../../src/components/challenge-box.tsx) renderiza o estado vazio ou o desafio ativo. Os dois botões executam dentro de `useTransition`, o que gera o estado "Processando...".
- **Resposta**: **Completei** chama `completeChallenge` e `resetCountdown`; **Falhei** chama `resetChallenge` e `resetCountdown`. O crédito de xp é descrito em [03-progressao.md](03-progressao.md).
- **Estado**: `activeChallenge` existe só no cliente e não é persistido.

## Fora de escopo

- Verificar se o exercício foi mesmo feito: a resposta é uma declaração do usuário.
- Penalidade por falhar: falhar apenas deixa de dar xp.
- Trocar ou pular o desafio sorteado.
- Histórico de quais desafios foram feitos.

## Questões em aberto

1. **Pedido de permissão de notificação**: o app nunca chama `Notification.requestPermission()`, então `DES-04` só vale para quem concedeu a permissão por conta própria. Quando o app deve pedir: ao abrir, ou no primeiro **Iniciar ciclo**?
2. **Navegadores sem a API de notificação**: `startNewChallenge` lê `Notification.permission` sem checar se a API existe. Onde ela não existe, essa leitura lança erro. O desafio ainda é exibido, mas o erro precisa ser evitado.
3. **Repetição**: o sorteio pode repetir o mesmo desafio em ciclos seguidos. Deve evitar o último sorteado?
4. **Equilíbrio do catálogo**: só 3 de 12 desafios são de olhos, então cerca de 75% dos sorteios são de alongamento. É a proporção desejada?
5. **Desafio perdido no reload**: recarregar a página com um desafio ativo descarta o desafio sem crédito de xp. É aceitável?
