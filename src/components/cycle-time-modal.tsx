'use client'

import { useState } from 'react'
import Button from '@/src/components/ui/button'
import { ChevronRightIcon, SproutIcon, TimerIcon } from '@/src/components/ui/icons'
import Modal from '@/src/components/ui/modal'
import ProgressRing from '@/src/components/ui/progress-ring'
import {
  cyclePresets,
  cycleStepMinutes,
  maxCycleMinutes,
  minCycleMinutes
} from '@/src/lib/system-m'
import { updateSystemM, useSystemM } from '@/src/lib/system-m-store'

export default function CycleTimeModal({ onClose }: { onClose: () => void }) {
  const { cycleMinutes } = useSystemM()
  const [minutes, setMinutes] = useState(cycleMinutes)
  const [isCustomOpen, setIsCustomOpen] = useState(!cyclePresets.includes(cycleMinutes))

  function confirm() {
    updateSystemM(state => ({ ...state, cycleMinutes: minutes }))
    onClose()
  }

  return (
    <Modal
      title="Escolha o tempo do ciclo"
      description="Selecione a duração do seu foco."
      onClose={onClose}
      className="max-w-[456px]"
    >
      <div className="mt-6 flex justify-center">
        <ProgressRing
          value={minutes / maxCycleMinutes}
          size={178}
          thickness={6}
          trackColor="var(--accent-soft)"
          activeColor="var(--accent)"
        >
          <SproutIcon className="size-5 text-[var(--accent)]" />
          <span className="mt-1 text-[54px] leading-none font-bold text-[var(--ink)]">
            {minutes}
          </span>
          <span className="mt-2 text-sm font-bold text-[var(--ink)]">min</span>
        </ProgressRing>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {cyclePresets.map(preset => {
          const isSelected = minutes === preset

          return (
            <button
              key={preset}
              type="button"
              aria-pressed={isSelected}
              className={`flex size-[52px] items-center justify-center rounded-full border text-[15px] font-bold transition-colors ${
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                  : 'border-[var(--row-line)] bg-white text-[var(--ink)] hover:border-[var(--accent-ring)]'
              }`}
              onClick={() => {
                setMinutes(preset)
                setIsCustomOpen(false)
              }}
            >
              {preset}
            </button>
          )
        })}
      </div>

      <div className="mt-7 rounded-[var(--radius-control)] border border-[var(--row-line)]">
        <button
          type="button"
          aria-expanded={isCustomOpen}
          className="flex h-[66px] w-full items-center gap-3.5 px-[18px] text-left"
          onClick={() => setIsCustomOpen(open => !open)}
        >
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
            <TimerIcon className="size-[17px]" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm font-bold text-[var(--ink)]">Personalizado</span>
            <span className="text-[11px] font-semibold text-[var(--ink-muted)]">
              De {minCycleMinutes} a {maxCycleMinutes} minutos (em passos de {cycleStepMinutes})
            </span>
          </span>
          <ChevronRightIcon
            className={`size-[17px] shrink-0 text-[#49658d] transition-transform ${
              isCustomOpen ? 'rotate-90' : ''
            }`}
          />
        </button>

        {isCustomOpen && (
          <div className="border-t border-[var(--row-line)] px-[18px] py-4">
            <input
              type="range"
              value={minutes}
              min={minCycleMinutes}
              max={maxCycleMinutes}
              step={cycleStepMinutes}
              aria-label="Minutos do ciclo"
              className="w-full accent-[var(--accent)]"
              onChange={e => setMinutes(Number(e.target.value))}
            />
            <div className="mt-1 flex justify-between text-[11px] font-semibold text-[var(--ink-muted)]">
              <span>{minCycleMinutes} min</span>
              <span>{maxCycleMinutes} min</span>
            </div>
          </div>
        )}
      </div>

      <Button variant="primary" size="xl" className="mt-[30px] w-full" onClick={confirm}>
        Confirmar
      </Button>
    </Modal>
  )
}
