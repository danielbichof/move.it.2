'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useOptimistic,
  useState,
  useTransition
} from 'react'
import { LevelUpModal } from '@/src/components/level-up-modal'
import { type Challenge, challenges } from '@/src/lib/challenges-data'
import {
  completeChallenge as completeChallengeCookie,
  type UserProgress
} from '@/src/lib/cookies-actions'

interface ChallengeContextData {
  // Server state
  level: number
  currentExperience: number
  experienceToNextLevel: number
  challengesCompleted: number

  // Client state
  activeChallenge: Challenge | null
  isLevelUpModalOpen: boolean

  // Actions
  startNewChallenge: () => void
  resetChallenge: () => void
  completeChallenge: () => void
  closeLevelUpModal: () => void
}

interface ChallengesProviderProps {
  children: ReactNode
  initialProgress: UserProgress
}

export const ChallengesContext = createContext({} as ChallengeContextData)

export function ChallengesProvider({ children, initialProgress }: ChallengesProviderProps) {
  const [, startTransition] = useTransition()

  // Optimistic updates for server state
  const [optimisticProgress, addOptimisticProgress] = useOptimistic(
    initialProgress,
    (state, newProgress: Partial<UserProgress>) => ({
      ...state,
      ...newProgress
    })
  )

  // Client-only state
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

  const experienceToNextLevel = ((optimisticProgress.level + 1) * 4) ** 2

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge)

    // Play notification sound
    if (typeof window !== 'undefined') {
      new Audio('/notification.mp3').play().catch(() => {
        // Ignore audio play errors
      })

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Novo desafio 🎉', {
          body: `Valendo ${challenge.amount} xp`
        })

        // Clicar no aviso traz o usuário de volta para a aba do desafio
        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      }
    }
  }

  function resetChallenge() {
    setActiveChallenge(null)
  }

  function completeChallenge() {
    if (!activeChallenge) return

    const { amount } = activeChallenge
    const finalExperience = optimisticProgress.currentExperience + amount
    const experienceToNext = ((optimisticProgress.level + 1) * 4) ** 2

    // Optimistic update
    if (finalExperience >= experienceToNext) {
      addOptimisticProgress({
        level: optimisticProgress.level + 1,
        currentExperience: finalExperience - experienceToNext,
        challengesCompleted: optimisticProgress.challengesCompleted + 1
      })
      setIsLevelUpModalOpen(true)
    } else {
      addOptimisticProgress({
        currentExperience: finalExperience,
        challengesCompleted: optimisticProgress.challengesCompleted + 1
      })
    }

    setActiveChallenge(null)

    // Server action
    startTransition(async () => {
      await completeChallengeCookie(amount)
    })
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false)
  }

  return (
    <ChallengesContext.Provider
      value={{
        level: optimisticProgress.level,
        currentExperience: optimisticProgress.currentExperience,
        challengesCompleted: optimisticProgress.challengesCompleted,
        experienceToNextLevel,
        activeChallenge,
        isLevelUpModalOpen,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal
      }}
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}

export function useChallengesContext() {
  return useContext(ChallengesContext)
}
