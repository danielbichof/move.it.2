'use client'

import ProgressBar from '@/src/components/ui/progress-bar'
import { useChallengesContext } from '../contexts/challenges-context'

interface ExperienceBarProps {
  className?: string
}

// Level e xp sempre à vista: é o que o usuário ganha ao fechar cada ciclo
export default function ExperienceBar({ className = '' }: ExperienceBarProps) {
  const { level, currentExperience, experienceToNextLevel } = useChallengesContext()

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-rajdhani shrink-0 text-lg leading-none font-semibold text-[var(--ink)]">
        Lv {level}
      </span>
      <ProgressBar
        value={currentExperience}
        max={experienceToNextLevel}
        label="Experiência"
        className="h-2 min-w-0 flex-1 md:max-w-[520px]"
      />
      <span className="shrink-0 text-xs font-bold text-[var(--header-xp-end)]">
        {currentExperience}
        <span className="hidden sm:inline"> / {experienceToNextLevel}</span> xp
      </span>
    </div>
  )
}
