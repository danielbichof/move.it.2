'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import Button from '@/src/components/ui/button'
import Card from '@/src/components/ui/card'
import { SproutIcon } from '@/src/components/ui/icons'
import { useChallengesContext } from '../contexts/challenges-context'

// Mesmo slot do design muda de mensagem por estado do ciclo; aqui ele também
// assume o desafio ativo em vez de empilhar mais uma caixa abaixo
export default function FocusReminder() {
  const { activeChallenge, resetChallenge, completeChallenge } = useChallengesContext()
  const [isPending, startTransition] = useTransition()

  if (!activeChallenge) {
    return (
      <Card
        as="section"
        className="flex min-w-0 flex-col items-center justify-center gap-3 px-6 py-8"
      >
        <SproutIcon className="size-[50px] text-[#8fa6ff]" />
        <h2 className="text-sm font-extrabold text-[var(--ink)]">Mantenha o foco</h2>
        <p className="max-w-[230px] text-center text-xs leading-[1.45] text-[var(--ink-muted)]">
          Cada ciclo te aproxima dos seus objetivos.
        </p>
      </Card>
    )
  }

  function handleChallengeSucceeded() {
    startTransition(() => {
      completeChallenge()
    })
  }

  function handleChallengeFailed() {
    startTransition(() => {
      resetChallenge()
    })
  }

  return (
    <Card
      as="section"
      className="flex min-w-0 flex-col items-center justify-center gap-4 px-6 py-8 text-center"
    >
      <Image src={`/icons/${activeChallenge.type}.svg`} alt="" width={56} height={56} />

      <div>
        <p className="text-[13px] font-extrabold text-[var(--accent)]">
          Novo desafio · ganhe {activeChallenge.amount} xp
        </p>
        <p className="mt-1.5 max-w-[280px] text-xs leading-[1.45] text-[var(--ink-muted)]">
          {activeChallenge.description}
        </p>
      </div>

      <div className="flex w-full max-w-[280px] gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isPending}
          onClick={handleChallengeFailed}
        >
          Falhei
        </Button>
        <Button
          variant="success"
          size="sm"
          className="flex-1"
          disabled={isPending}
          onClick={handleChallengeSucceeded}
        >
          Completei
        </Button>
      </div>
    </Card>
  )
}
