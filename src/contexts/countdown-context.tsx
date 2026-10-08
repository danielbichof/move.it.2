'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
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

export const breakMinutes = 5

interface CountdownProviderProps {
  children: ReactNode
}

// O relógio conta pelo horário final e não por "1 segundo por tick": abas em segundo plano
// têm timers estrangulados, mas o horário real continua certo quando a aba volta
const tickMs = 250

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useChallengesContext()
  const { cycleMinutes } = useSystemM()

  const cycleSeconds = cycleMinutes * 60
  const breakSeconds = breakMinutes * 60

  const [time, setTime] = useState(cycleSeconds)
  const [status, setStatus] = useState<CountdownStatus>('idle')

  // Espelha `time` para o efeito do relógio começar de onde parou sem recriar o intervalo a cada segundo
  const timeRef = useRef(time)
  const endAt = useRef(0)

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const startCountdown = useCallback(() => {
    // O pedido precisa nascer de um clique: sem ele o navegador nunca libera o aviso de fim de ciclo
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {
        // Sem permissão o ciclo roda igual, só sem o aviso
      })
    }

    setStatus('running')
  }, [])

  const pauseCountdown = useCallback(() => {
    setStatus(current => (current === 'running' ? 'paused' : current))
  }, [])

  const resumeCountdown = useCallback(() => {
    setStatus(current => (current === 'paused' ? 'running' : current))
  }, [])

  const resetCountdown = useCallback(() => {
    setStatus('idle')
    setTime(cycleSeconds)
  }, [cycleSeconds])

  // Depois do desafio resolvido: recomeça o ciclo na hora
  const startNewCycle = useCallback(() => {
    setTime(cycleSeconds)
    setStatus('running')
  }, [cycleSeconds])

  // Depois do desafio resolvido: descanso cronometrado antes do próximo foco
  const startBreak = useCallback(() => {
    setTime(breakSeconds)
    setStatus('break')
  }, [breakSeconds])

  const skipBreak = useCallback(() => {
    setStatus('idle')
    setTime(cycleSeconds)
  }, [cycleSeconds])

  useEffect(() => {
    timeRef.current = time
  }, [time])

  // Trocar a duração fora do ciclo já atualiza o relógio parado
  useEffect(() => {
    if (status === 'idle') setTime(cycleSeconds)
  }, [cycleSeconds, status])

  useEffect(() => {
    if (status !== 'running' && status !== 'break') return

    endAt.current = Date.now() + timeRef.current * 1000

    const interval = setInterval(() => {
      setTime(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)))
    }, tickMs)

    return () => clearInterval(interval)
  }, [status])

  useEffect(() => {
    if (time > 0) return

    if (status === 'running') {
      setStatus('finished')
      startNewChallenge()
    } else if (status === 'break') {
      setStatus('idle')
      setTime(cycleSeconds)
    }
  }, [time, status, startNewChallenge, cycleSeconds])

  // O tempo restante na aba: dá para acompanhar o ciclo sem voltar para a página
  useEffect(() => {
    const isCounting = status === 'running' || status === 'break'

    document.title = isCounting
      ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} · move.it`
      : 'Move.it'
  }, [status, minutes, seconds])

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
