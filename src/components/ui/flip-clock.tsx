interface FlipClockProps {
  minutes: number
  seconds: number
  label: string
  // Os dois-pontos só pulsam enquanto o tempo corre
  active?: boolean
}

// clamp() em vez de tamanho fixo: em telas estreitas os cartões encolhem em vez de
// forçar rolagem horizontal
const digitStyle = {
  width: 'clamp(46px, 13vw, 78px)',
  height: 'clamp(68px, 19vw, 112px)',
  fontSize: 'clamp(48px, 14vw, 84px)'
}

function Digit({ value }: { value: string }) {
  return (
    <span
      className="font-rajdhani relative flex items-center justify-center overflow-hidden rounded-[var(--radius-control)] border border-[var(--surface-line)] bg-[var(--surface)] leading-none font-semibold text-[var(--ink)] shadow-[0_6px_14px_#8da5c31a]"
      style={digitStyle}
    >
      {value}
      <span className="absolute inset-x-0 top-1/2 h-px bg-[#e3eaf5]" />
    </span>
  )
}

export default function FlipClock({ minutes, seconds, label, active = false }: FlipClockProps) {
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  return (
    <div role="timer" aria-label={label} className="flex items-center gap-2 sm:gap-3">
      <span className="sr-only">{`${mm}:${ss}`}</span>

      <span className="flex gap-1" aria-hidden="true">
        <Digit value={mm[0]} />
        <Digit value={mm[1]} />
      </span>

      <span
        className={`flex flex-col items-center gap-4 ${active ? 'clock-ticking' : ''}`}
        aria-hidden="true"
      >
        <span className="size-2 rounded-full bg-[var(--ink-soft)]" />
        <span className="size-2 rounded-full bg-[var(--ink-soft)]" />
      </span>

      <span className="flex gap-1" aria-hidden="true">
        <Digit value={ss[0]} />
        <Digit value={ss[1]} />
      </span>
    </div>
  )
}
