'use client'

import HabitList from '@/src/components/habit-list'
import Inbox from '@/src/components/inbox'
import LaterList from '@/src/components/later-list'
import { useChallengesContext } from '../contexts/challenges-context'
import { useCountdownContext } from '../contexts/countdown-context'

// Com o ciclo aberto ficam só o foco, o Timer e a captura rápida (spec 05): as listas voltam
// quando o usuário pode escolher de novo
export default function TodayLists() {
  const { status } = useCountdownContext()
  const { activeChallenge } = useChallengesContext()

  const isInCycle =
    status === 'running' || status === 'paused' || (status === 'finished' && activeChallenge)

  if (isInCycle) return null

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <LaterList />
      <HabitList />
      <Inbox />
    </div>
  )
}
