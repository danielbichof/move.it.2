interface FlipClockProps {
  minutes: number
  seconds: number
  label: string
  // O dígito dos segundos é o que "vira": ganha o meio-tom só enquanto o ciclo corre
  active?: boolean
}

const flipping = 'linear-gradient(180deg, #eef2fa 0, #eef2fa 50%, #ffffff 50%, #ffffff 100%)'

// clamp() em vez de tamanho fixo: em telas muito estreitas os cartões encolhem
// em vez de forçar rolagem horizontal
const digitStyle = {
  width: 'clamp(38px, 11vw, 52px)',
  height: 'clamp(56px, 16vw, 76px)',
  fontSize: 'clamp(32px, 9vw, 50px)'
}

function Digit({ value, isFlipping = false }: { value: string; isFlipping?: boolean }) {
  return (
    <span
      className="relative flex items-center justify-center overflow-hidden rounded-[var(--radius-control)] border border-[var(--surface-line)] font-extrabold text-[var(--ink)] shadow-[0_6px_14px_#8da5c31a]"
      style={{ ...digitStyle, background: isFlipping ? flipping : 'var(--surface)' }}
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
    <div role="timer" aria-label={label} className="flex items-center gap-2.5">
      <span className="sr-only">{`${mm}:${ss}`}</span>

      <span className="flex gap-1" aria-hidden="true">
        <Digit value={mm[0]} />
        <Digit value={mm[1]} />
      </span>

      <span className="flex flex-col items-center gap-3" aria-hidden="true">
        <span className="size-[7px] rounded-full bg-[#9db0d3]" />
        <span className="size-[7px] rounded-full bg-[#405a87]" />
      </span>

      <span className="flex gap-1" aria-hidden="true">
        <Digit value={ss[0]} />
        <Digit value={ss[1]} isFlipping={active} />
      </span>
    </div>
  )
}
