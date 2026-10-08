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
  // Desafio resolvido: o relógio já mostra o próximo ciclo em vez de um 00:00 parado
  const isBetweenCycles = status === 'finished' && !showChallenge
  // Com o ciclo aberto as listas somem e o card vira o centro da tela
  const isStage = isCycleOpen || showChallenge

  const totalSeconds = isOnBreak ? breakMinutes * 60 : cycleSeconds
  const remaining = isBetweenCycles ? cycleSeconds : minutes * 60 + seconds

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
      className={`min-w-0 px-5 py-6 transition-colors sm:px-8 ${
        isStage
          ? 'flex flex-col items-center gap-7 text-center sm:py-12'
          : 'grid gap-x-12 gap-y-6 sm:py-8 md:grid-cols-[minmax(0,1fr)_auto]'
      }`}
    >
      <div
        className={
          isStage
            ? 'flex max-w-[640px] flex-col items-center'
            : 'min-w-0 md:col-start-1 md:row-start-1'
        }
      >
        {focus && !isOnBreak && (
          <div className="mb-3 flex w-full items-center justify-between gap-3">
            <span className={isStage ? 'mx-auto' : ''}>
              <PillarTag pillar={focus.pillar} size="md" onTint />
            </span>
            {isIdle && (
              <IconButton label={`Tirar o foco de ${focus.title}`} onClick={clearFocus}>
                <EllipsisVerticalIcon className="size-[18px]" />
              </IconButton>
            )}
          </div>
        )}

        <h2 className="text-[clamp(26px,4.2vw,40px)] leading-[1.1] font-bold tracking-tight break-words text-[var(--ink)]">
          {isOnBreak ? 'Hora da pausa' : focus ? focus.title : 'Nenhum foco definido'}
        </h2>
        <p className="mt-3 max-w-[460px] text-[15px] font-medium text-[var(--ink-soft)]">
          {isOnBreak
            ? 'Descanse um pouco. O próximo ciclo começa sozinho quando o tempo acabar.'
            : focus
              ? focusPillar?.description
              : ready
                ? 'Escolha um item em Depois para focar. O ciclo também roda sem foco.'
                : ''}
        </p>
      </div>

      <div
        className={`flex min-w-0 flex-col items-center gap-4 ${
          isStage
            ? 'w-full max-w-[520px]'
            : 'md:col-start-2 md:row-span-2 md:row-start-1 md:w-[376px] md:self-center'
        }`}
      >
        {showChallenge ? (
          <CycleChallenge />
        ) : (
          <>
            <FlipClock
              minutes={isBetweenCycles ? cycleMinutes : minutes}
              seconds={isBetweenCycles ? 0 : seconds}
              active={isTicking}
              large={isStage}
              label={isOnBreak ? 'Tempo restante da pausa' : 'Tempo restante do ciclo'}
            />

            <div className="flex w-full flex-col items-center gap-2">
              <ProgressBar
                value={totalSeconds - remaining}
                max={totalSeconds}
                label={isOnBreak ? 'Progresso da pausa' : 'Progresso do ciclo'}
                className="w-full"
                trackColor="color-mix(in srgb, var(--ink) 12%, transparent)"
                fillColor={ambient ? `var(--pillar-${ambient}-ink)` : 'var(--ink)'}
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

      {!showChallenge && (
        <div
          className={
            isStage
              ? 'flex w-full max-w-[520px] flex-col items-center'
              : 'min-w-0 md:col-start-1 md:row-start-2'
          }
        >
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
            <div className="flex w-full gap-3">
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
            <div className="flex w-full gap-3">
              <Button variant="cta" size="cycle" className="flex-1" onClick={resumeCountdown}>
                <PlayIcon className="size-4" />
                Continuar
              </Button>
              <Button variant="outline" size="cycle" className="flex-1" onClick={resetCountdown}>
                <XIcon className="size-4" />
                Abandonar
              </Button>
            </div>
          )}

          {isBetweenCycles && (
            <div className="flex gap-3 md:max-w-[460px]">
              <Button variant="cta" size="cycle" className="flex-1" onClick={startNewCycle}>
                <PlayIcon className="size-4" />
                Novo ciclo
              </Button>
              <Button variant="outline" size="cycle" className="flex-1" onClick={startBreak}>
                <CoffeeIcon className="size-4" />
                Fazer pausa
              </Button>
            </div>
          )}

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
            <div className="mt-4 w-full text-left">
              <QuickCapture />
            </div>
          )}

          {(isIdle || isCycleOpen) && (
            <div className={`text-left ${isCycleOpen ? 'mt-3' : 'mt-6'}`}>
              <FocusReminder color={ambient ? `var(--pillar-${ambient}-ink)` : undefined} />
            </div>
          )}
        </div>
      )}

      {isCycleTimeOpen && <CycleTimeModal onClose={() => setIsCycleTimeOpen(false)} />}
    </Card>
  )
}
