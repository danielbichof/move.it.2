import type { ReactNode } from 'react'

interface ProgressRingProps {
  value: number
  size: number
  thickness: number
  trackColor?: string
  activeColor?: string
  animated?: boolean
  className?: string
  children?: ReactNode
}

// Anel de progresso: serve tanto para o Timer quanto para a prévia de duração do ciclo
export default function ProgressRing({
  value,
  size,
  thickness,
  trackColor = 'var(--surface-line)',
  activeColor = 'var(--accent)',
  animated = false,
  className = '',
  children
}: ProgressRingProps) {
  const radius = (size - thickness) / 2
  const length = 2 * Math.PI * radius
  const clamped = Math.min(1, Math.max(0, value))

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={activeColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - clamped)}
          style={animated ? { transition: 'stroke-dashoffset 1s linear' } : undefined}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
      )}
    </div>
  )
}
