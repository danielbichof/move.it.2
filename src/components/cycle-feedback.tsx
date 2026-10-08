'use client'

import type { ReactNode } from 'react'
import Card from '@/src/components/ui/card'
import { CircleCheckIcon, ShieldCheckIcon, StarIcon } from '@/src/components/ui/icons'
import { useChallengesContext } from '../contexts/challenges-context'

function Half({
  icon,
  label,
  detail,
  divided = false
}: {
  icon: ReactNode
  label: string
  detail: string
  divided?: boolean
}) {
  return (
    <div
      className={`flex flex-1 items-center gap-3.5 px-6 py-4 ${divided ? 'border-t border-[#e8eef7] sm:border-t-0 sm:border-l' : ''}`}
    >
      <span className="shrink-0 text-[var(--accent)]" aria-hidden="true">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-[13px] font-bold text-[#536b96]">{label}</span>
        <span className="truncate text-[15px] font-bold text-[var(--ink)]">{detail}</span>
      </div>
    </div>
  )
}

// A faixa que mostra o desafio do ciclo (o exercício) e o XP que ele vale
export default function CycleFeedback() {
  const { activeChallenge } = useChallengesContext()

  return (
    <Card
      as="section"
      className="flex flex-col rounded-[var(--radius-card)] sm:flex-row sm:items-stretch"
    >
      <Half
        icon={
          activeChallenge ? (
            <CircleCheckIcon className="size-[22px]" />
          ) : (
            <ShieldCheckIcon className="size-[22px]" />
          )
        }
        label={activeChallenge ? 'Desafio disponível' : 'Desafio'}
        detail={activeChallenge ? 'Ciclo completo' : 'Complete o ciclo'}
      />
      <Half
        icon={<StarIcon className="size-[22px]" />}
        label="XP"
        detail={`+${activeChallenge ? activeChallenge.amount : 0}`}
        divided
      />
    </Card>
  )
}
