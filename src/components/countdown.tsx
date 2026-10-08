'use client'

import { useState } from 'react'
import CycleChallenge from '@/src/components/cycle-challenge'
import CycleTimeModal from '@/src/components/cycle-time-modal'
import FocusReminder from '@/src/components/focus-reminder'
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

// Card principal da tela Hoje: o foco atual, o Timer e, ao fim do ciclo, o desafio
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
  const isCycleOpen = status === 'running' || status === 'paused'
  const showChallenge = status === 'finished' && activeChallenge !== null
  const totalSeconds = isOnBreak ? breakMinutes * 60 : cycleSeconds
  const remaining = minutes * 60 + seconds

  // O pilar do foco tinge o card inteiro: dá para saber onde está a atenção sem ler
  const ambient = focus && !isOnBreak ? focus.pillar : null
  const ambientStyle = ambient
    ? {
        background: `var(--pillar-${ambient})`,
        borderColor: `color-mix(in srgb, var(--pillar-${ambient}-ink) 30%, transparent)`
      }
    : undefined

  return (
    <Card
      as="section"
      elevation="raised"
      style={ambientStyle}
      className="grid min-w-0 gap-x-10 gap-y-6 px-5 py-6 transition-colors sm:px-8 sm:py-8 md:min-h-[340px] md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[auto_1fr]"
    >
      <div className="min-w-0 md:col-start-1 md:row-start-1">
        {focus && !isOnBreak && (
          <div className="mb-3 flex items-center justify-between gap-3">
            <PillarTag pillar={focus.pillar} size="md" onTint />
            {isIdle && (
              <IconButton label={`Tirar o foco de ${focus.title}`} onClick={clearFocus}>
                <EllipsisVerticalIcon className="size-[18px]" />
              </IconButton>
            )}
          </div>
        )}

        {isOnBreak ? (
          <>
            <h2 className="text-[26px] leading-tight font-extrabold text-[var(--ink)]">
              Hora da pausa
            </h2>
            <p className="mt-2 max-w-[460px] text-[15px] font-medium text-[var(--ink-soft)]">
              Descanse um pouco. O próximo ciclo começa sozinho quando o tempo acabar.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[26px] leading-tight font-extrabold break-words text-[var(--ink)]">
              {focus ? focus.title : 'Nenhum foco definido'}
            </h2>
            <p className="mt-2 max-w-[460px] text-[15px] font-medium text-[var(--ink-soft)]">
              {focus
                ? focusPillar?.description
                : ready
                  ? 'Escolha um item em Depois para focar. O ciclo também roda sem foco.'
                  : ''}
            </p>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-col items-center gap-4 md:col-start-2 md:row-span-2 md:row-start-1 md:w-[376px] md:self-center">
        {showChallenge ? (
          <CycleChallenge />
        ) : (
          <>
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
                trackColor="color-mix(in srgb, var(--ink) 12%, transparent)"
                fillColor={ambient ? `var(--pillar-${ambient}-ink)` : 'var(--accent)'}
              />
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--ink-soft)]">
                  {isOnBreak ? `de ${breakMinutes} min` : `de ${cycleMinutes} min`}
                </span>
                {isIdle && (
                  <Button
                    variant="quiet"
                    size="xs"
                    aria-haspopup="dialog"
                    title="Alterar o tempo do ciclo"
                    onClick={() => setIsCycleTimeOpen(true)}
                  >
                    <TimerIcon className="size-[13px]" />
                    Alterar tempo
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="min-w-0 md:col-start-1 md:row-start-2 md:self-end">
        {isIdle && (
          <Button
            variant="cta"
            size="cycle"
            className="w-full md:w-[220px]"
            onClick={startCountdown}
          >
            <PlayIcon className="size-4" />
            Iniciar ciclo
          </Button>
        )}

        {status === 'running' && (
          <div className="flex gap-3">
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
          <div className="flex gap-3">
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
          (showChallenge ? (
            <p className="text-[15px] font-bold text-[var(--ink)]">
              Ciclo concluído. Resolva o desafio para liberar o próximo.
            </p>
          ) : (
            <div className="flex gap-3">
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
            className="w-full md:w-[220px]"
            onClick={skipBreak}
          >
            Pular pausa
          </Button>
        )}

        {isCycleOpen && (
          <div className="mt-4 w-full md:max-w-md">
            <QuickCapture />
          </div>
        )}

        {(isIdle || isCycleOpen) && (
          <div className="mt-6">
            <FocusReminder color={ambient ? `var(--pillar-${ambient}-ink)` : undefined} />
          </div>
        )}
      </div>

      {isCycleTimeOpen && <CycleTimeModal onClose={() => setIsCycleTimeOpen(false)} />}
    </Card>
  )
}
