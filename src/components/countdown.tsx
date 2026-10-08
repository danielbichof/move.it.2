'use client'

import { useState } from 'react'
import CycleTimeModal from '@/src/components/cycle-time-modal'
import PillarTag from '@/src/components/pillar-tag'
import QuickCapture from '@/src/components/quick-capture'
import Button from '@/src/components/ui/button'
import Card from '@/src/components/ui/card'
import FlipClock from '@/src/components/ui/flip-clock'
import IconButton from '@/src/components/ui/icon-button'
import {
  CoffeeIcon,
  EllipsisVerticalIcon,
  PauseIcon,
  PlayIcon,
  TimerIcon,
  XIcon
} from '@/src/components/ui/icons'
import ProgressBar from '@/src/components/ui/progress-bar'
import { useChallengesContext } from '@/src/contexts/challenges-context'
import { focusItem, pillars } from '@/src/lib/system-m'
import { updateSystemM, useSystemM, useSystemMReady } from '@/src/lib/system-m-store'
import { useCountdownContext } from '../contexts/countdown-context'

function clearFocus() {
  updateSystemM(state => ({ ...state, focusId: null }))
}

// Card principal da tela Hoje: o foco atual e o Timer juntos
export default function Countdown() {
  const {
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
  } = useCountdownContext()

  const { activeChallenge } = useChallengesContext()
  const focus = focusItem(useSystemM())
  const ready = useSystemMReady()
  const focusPillar = pillars.find(pillar => pillar.id === focus?.pillar)
  const [isCycleTimeOpen, setIsCycleTimeOpen] = useState(false)

  const isIdle = status === 'idle'
  const isOnBreak = status === 'break'
  const isTicking = status === 'running' || isOnBreak
  const totalSeconds = isOnBreak ? breakMinutes * 60 : cycleSeconds
  const remaining = minutes * 60 + seconds

  return (
    <Card as="section" elevation="raised" className="min-w-0 px-4 pt-[26px] pb-[21px] sm:px-7">
      <div className="flex items-start gap-4">
        {focus && !isOnBreak ? (
          <PillarTag pillar={focus.pillar} size="md" />
        ) : (
          <span className="text-xs font-bold text-[var(--ink-soft)]">
            {isOnBreak ? 'Pausa' : 'Foco atual'}
          </span>
        )}

        <div className="ml-auto flex items-center gap-4">
          <span className="text-[13px] font-bold text-[#35517a]">~ {cycleMinutes} min</span>
          {focus && isIdle && (
            <IconButton label={`Tirar o foco de ${focus.title}`} onClick={clearFocus}>
              <EllipsisVerticalIcon className="size-[18px]" />
            </IconButton>
          )}
        </div>
      </div>

      <div className="mt-[19px] flex flex-col gap-6 md:flex-row md:items-start">
        <div className="min-w-0 flex-1">
          {isOnBreak ? (
            <>
              <h2 className="text-[23px] font-extrabold text-[var(--ink)]">Hora da pausa</h2>
              <p className="mt-1 max-w-[500px] text-[15px] font-medium text-[var(--ink-soft)]">
                Descanse um pouco. O próximo ciclo começa sozinho quando o tempo acabar.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-[23px] font-extrabold break-words text-[var(--ink)]">
                {focus ? focus.title : 'Nenhum foco definido'}
              </h2>
              <p className="mt-1 max-w-[500px] text-[15px] font-medium text-[var(--ink-soft)]">
                {focus
                  ? focusPillar?.description
                  : ready
                    ? 'Escolha um item em Depois para focar. O ciclo também roda sem foco.'
                    : ''}
              </p>
            </>
          )}

          {status === 'idle' && (
            <Button
              variant="cta"
              size="cycle"
              className="mt-7 w-full md:w-[190px]"
              onClick={startCountdown}
            >
              <PlayIcon className="size-4" />
              Iniciar ciclo
            </Button>
          )}

          {status === 'running' && (
            <div className="mt-7 flex gap-3">
              <Button variant="soft" size="cycle" className="flex-1" onClick={pauseCountdown}>
                <PauseIcon className="size-4" />
                Pausar
              </Button>
              <Button variant="outline" size="cycle" className="flex-1" onClick={resetCountdown}>
                <XIcon className="size-4" />
                Abandonar
              </Button>
            </div>
          )}

          {status === 'paused' && (
            <div className="mt-7 flex gap-3">
              <Button variant="soft" size="cycle" className="flex-1" onClick={resumeCountdown}>
                <PlayIcon className="size-4" />
                Continuar
              </Button>
              <Button variant="outline" size="cycle" className="flex-1" onClick={resetCountdown}>
                <XIcon className="size-4" />
                Abandonar
              </Button>
            </div>
          )}

          {status === 'finished' &&
            (activeChallenge ? (
              <Button variant="quiet" size="cycle" disabled className="mt-7 w-full md:w-[190px]">
                Ciclo encerrado
              </Button>
            ) : (
              <div className="mt-7 flex gap-3">
                <Button variant="cta" size="cycle" className="flex-1" onClick={startNewCycle}>
                  <PlayIcon className="size-4" />
                  Novo ciclo
                </Button>
                <Button variant="outline" size="cycle" className="flex-1" onClick={startBreak}>
                  <CoffeeIcon className="size-4" />
                  Fazer pausa
                </Button>
              </div>
            ))}

          {isOnBreak && (
            <Button
              variant="outline"
              size="cycle"
              className="mt-7 w-full md:w-[190px]"
              onClick={skipBreak}
            >
              Pular pausa
            </Button>
          )}

          {status === 'running' && (
            <div className="mt-4 w-full md:max-w-md">
              <QuickCapture />
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col items-center gap-4 self-center md:w-[246px]">
          <FlipClock
            minutes={minutes}
            seconds={seconds}
            active={isTicking}
            label={isOnBreak ? 'Tempo restante da pausa' : 'Tempo restante do ciclo'}
          />

          <div className="flex w-full flex-col items-center gap-2">
            <ProgressBar
              value={totalSeconds - remaining}
              max={totalSeconds}
              label={isOnBreak ? 'Progresso da pausa' : 'Progresso do ciclo'}
              className="w-full"
              trackColor="#e3eaf5"
              fillColor="var(--accent)"
            />
            <span className="text-sm font-bold text-[#405a87]">
              {status === 'finished'
                ? 'concluído'
                : isOnBreak
                  ? `de ${breakMinutes} min`
                  : `de ${cycleMinutes} min`}
            </span>
          </div>

          <Button
            variant="quiet"
            size="xs"
            disabled={!isIdle}
            aria-haspopup="dialog"
            title="Alterar o tempo do ciclo"
            onClick={() => setIsCycleTimeOpen(true)}
          >
            <TimerIcon className="size-[13px]" />
            Alterar tempo
          </Button>
        </div>
      </div>

      {isCycleTimeOpen && <CycleTimeModal onClose={() => setIsCycleTimeOpen(false)} />}
    </Card>
  )
}
