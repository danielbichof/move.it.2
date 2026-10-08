'use client'

import ProgressBar from '@/src/components/ui/progress-bar'
import { useChallengesContext } from '../contexts/challenges-context'

interface ExperienceBarProps {
  className?: string
  trackClassName?: string
}

export default function ExperienceBar({
  className = '',
  trackClassName = 'flex-1'
}: ExperienceBarProps) {
  const { currentExperience, experienceToNextLevel } = useChallengesContext()

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <span className="shrink-0 text-xs font-bold text-[var(--header-xp-start)]">
        {currentExperience} xp
      </span>
      <ProgressBar
        value={currentExperience}
        max={experienceToNextLevel}
        label="Experiência"
        className={trackClassName}
      />
      <span className="shrink-0 text-xs text-[var(--header-xp-end)]">
        {experienceToNextLevel} xp
      </span>
    </div>
  )
}
