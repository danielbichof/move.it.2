'use client'

import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

// Input de texto do design; o rótulo é acessível, não visível
export default function TextField({ label, className = '', ...props }: TextFieldProps) {
  return (
    <input
      type="text"
      aria-label={label}
      autoComplete="off"
      className={`h-10 min-w-0 rounded-[var(--radius-control)] border border-[var(--surface-line)] bg-white px-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[var(--accent-ring)] ${className}`}
      {...props}
    />
  )
}
