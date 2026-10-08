interface ProgressBarProps {
  value: number
  max: number
  label: string
  className?: string
  trackColor?: string
  fillColor?: string
}

// Trilho fino de progresso (a barra de XP do cabeçalho)
export default function ProgressBar({
  value,
  max,
  label,
  className = '',
  trackColor = 'var(--header-xp-track)',
  fillColor = 'var(--header-xp-fill)'
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`h-[5px] overflow-hidden rounded-lg ${className}`}
      style={{ background: trackColor }}
    >
      <div
        className="h-full rounded-lg transition-all duration-300"
        style={{ width: `${percent}%`, background: fillColor }}
      />
    </div>
  )
}
