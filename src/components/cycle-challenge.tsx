'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import Button from '@/src/components/ui/button'
import { useChallengesContext } from '../contexts/challenges-context'

// O desafio do fim do ciclo: ocupa o lugar do relógio, que já não tem mais o que contar
export default function CycleChallenge() {
  const { activeChallenge, resetChallenge, completeChallenge } = useChallengesContext()
  const [isPending, startTransition] = useTransition()

  if (!activeChallenge) return null

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
    <div className="flex w-full flex-col gap-5 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 text-left shadow-[0_6px_14px_#8da5c31a] sm:p-7">
      <div className="flex items-center gap-4">
        <Image
          src={`/icons/${activeChallenge.type}.svg`}
          alt=""
          width={56}
          height={56}
          className="shrink-0"
          style={{ width: 56, height: 56 }}
        />
        <div>
          <p className="text-sm font-bold text-[var(--ink-soft)]">
            Ciclo concluído. Complete o desafio e ganhe
          </p>
          <p className="font-rajdhani text-[44px] leading-none font-bold text-[var(--gain)]">
            +{activeChallenge.amount} xp
          </p>
        </div>
      </div>

      <p className="text-base leading-relaxed font-medium text-[var(--ink)]">
        {activeChallenge.description}
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={isPending}
          onClick={handleChallengeFailed}
        >
          Falhei
        </Button>
        <Button
          variant="success"
          size="lg"
          className="flex-1"
          disabled={isPending}
          onClick={handleChallengeSucceeded}
        >
          Completei
        </Button>
      </div>
    </div>
  )
}
