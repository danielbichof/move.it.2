'use client'

import { CheckIcon } from '@/src/components/ui/icons'

interface CheckCircleProps {
  checked: boolean
  label: string
  onChange: () => void
  className?: string
}

// Círculo vazado que vira preenchido com check, como nos hábitos do design
export default function CheckCircle({
  checked,
  label,
  onChange,
  className = ''
}: CheckCircleProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={label}
      className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent-ring)] transition-colors ${className}`}
      style={{ background: checked ? 'var(--accent-ring)' : 'transparent' }}
      onClick={onChange}
    >
      {checked && <CheckIcon className="size-3 text-white" />}
    </button>
  )
}
