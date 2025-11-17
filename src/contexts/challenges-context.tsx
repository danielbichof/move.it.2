'use client'

import React, { createContext, useContext, useState, ReactNode, useOptimistic, useTransition } from 'react'
import { Challenge, challenges } from '@/src/lib/challenges-data'
import { completeChallenge as completeChallengeCookie, UserProgress } from '@/src/lib/cookies-actions'
import { LevelUpModal } from '@/src/components/level-up-modal'

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
  
  const experienceToNextLevel = Math.pow((optimisticProgress.level + 1) * 4, 2)
  
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
      if (Notification.permission === 'granted') {
        new Notification('Novo desafio 🎉', {
          body: `Valendo ${challenge.amount} xp`
        })
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
    const experienceToNext = Math.pow((optimisticProgress.level + 1) * 4, 2)
    
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