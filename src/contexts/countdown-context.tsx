'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useSystemM } from '@/src/lib/system-m-store'
import { useChallengesContext } from './challenges-context'

export type CountdownStatus = 'idle' | 'running' | 'paused' | 'finished' | 'break'

interface CountdownContextData {
  minutes: number
  seconds: number
  cycleMinutes: number
  cycleSeconds: number
  breakMinutes: number
  status: CountdownStatus
  startCountdown: () => void
  pauseCountdown: () => void
  resumeCountdown: () => void
  resetCountdown: () => void
  startNewCycle: () => void
  startBreak: () => void
  skipBreak: () => void
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout

export const breakMinutes = 5

interface CountdownProviderProps {
  children: ReactNode
}

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useChallengesContext()
  const { cycleMinutes } = useSystemM()

  const cycleSeconds = cycleMinutes * 60
  const breakSeconds = breakMinutes * 60

  const [time, setTime] = useState(cycleSeconds)
  const [status, setStatus] = useState<CountdownStatus>('idle')

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const startCountdown = useCallback(() => {
    setStatus('running')
  }, [])

  const pauseCountdown = useCallback(() => {
    setStatus(current => (current === 'running' ? 'paused' : current))
  }, [])

  const resumeCountdown = useCallback(() => {
    setStatus(current => (current === 'paused' ? 'running' : current))
  }, [])

  const resetCountdown = useCallback(() => {
    clearTimeout(countdownTimeout)
    setStatus('idle')
    setTime(cycleSeconds)
  }, [cycleSeconds])

  // Depois do desafio resolvido: recomeça o ciclo na hora
  const startNewCycle = useCallback(() => {
    clearTimeout(countdownTimeout)
    setTime(cycleSeconds)
    setStatus('running')
  }, [cycleSeconds])

  // Depois do desafio resolvido: descanso cronometrado antes do próximo foco
  const startBreak = useCallback(() => {
    clearTimeout(countdownTimeout)
    setTime(breakSeconds)
    setStatus('break')
  }, [breakSeconds])

  const skipBreak = useCallback(() => {
    clearTimeout(countdownTimeout)
    setStatus('idle')
    setTime(cycleSeconds)
  }, [cycleSeconds])

  // Trocar a duração fora do ciclo já atualiza o relógio parado
  useEffect(() => {
    if (status === 'idle') setTime(cycleSeconds)
  }, [cycleSeconds, status])

  useEffect(() => {
    const isCounting = status === 'running' || status === 'break'

    if (isCounting && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(t => t - 1)
      }, 1000)
    } else if (status === 'running' && time === 0) {
      // Use setTimeout to avoid cascading renders
      setTimeout(() => {
        setStatus('finished')
        startNewChallenge()
      }, 0)
    } else if (status === 'break' && time === 0) {
      setTimeout(() => {
        setStatus('idle')
        setTime(cycleSeconds)
      }, 0)
    }

    return () => {
      clearTimeout(countdownTimeout)
    }
  }, [status, time, startNewChallenge, cycleSeconds])

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        cycleMinutes,
        cycleSeconds,
        breakMinutes,
        status,
        startCountdown,
        pauseCountdown,
        resumeCountdown,
        resetCountdown,
        startNewCycle,
        startBreak,
        skipBreak
      }}
    >
      {children}
    </CountdownContext.Provider>
  )
}

export function useCountdownContext() {
  return useContext(CountdownContext)
}
