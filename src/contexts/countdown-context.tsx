'use client'

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react'
import { useChallengesContext } from './challenges-context'

interface CountdownContextData {
  minutes: number
  seconds: number
  hasFinished: boolean
  isActive: boolean
  startCountdown: () => void
  resetCountdown: () => void
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout

interface CountdownProviderProps {
  children: ReactNode
}

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useChallengesContext()
  
  const [time, setTime] = useState(0.1 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)
  
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  
  const startCountdown = useCallback(() => {
    setIsActive(true)
  }, [])
  
  const resetCountdown = useCallback(() => {
    clearTimeout(countdownTimeout)
    setIsActive(false)
    setTime(0.1 * 60)
    setHasFinished(false)
  }, [])
  
  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1)
      }, 1000)
    } else if (isActive && time === 0) {
      // Use setTimeout to avoid cascading renders
      setTimeout(() => {
        setHasFinished(true)
        setIsActive(false)
        startNewChallenge()
      }, 0)
    }
    
    return () => {
      clearTimeout(countdownTimeout)
    }
  }, [isActive, time, startNewChallenge])
  
  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown
      }}
    >
      {children}
    </CountdownContext.Provider>
  )
}

export function useCountdownContext() {
  return useContext(CountdownContext)
}