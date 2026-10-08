'use client'

import { useChallengesContext } from '../contexts/challenges-context'

// Resumo do progresso: vive dentro do menu de perfil, onde o design guarda os dados da conta
export default function CompletedChallenges() {
  const { level, challengesCompleted } = useChallengesContext()

  return (
    <dl className="flex flex-col gap-1.5 text-[13px] text-[var(--ink-muted)]">
      <div className="flex items-center justify-between gap-6">
        <dt>Level</dt>
        <dd className="text-base font-extrabold text-[var(--ink)]">{level}</dd>
      </div>
      <div className="flex items-center justify-between gap-6">
        <dt>Desafios completos</dt>
        <dd className="text-base font-extrabold text-[var(--ink)]">{challengesCompleted}</dd>
      </div>
    </dl>
  )
}
