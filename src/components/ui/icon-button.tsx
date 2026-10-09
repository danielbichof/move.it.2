'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  tone?: 'muted' | 'danger'
}

const tones = {
  muted: 'text-[#7b91b8] hover:text-[var(--ink)]',
  danger: 'text-[#7b91b8] hover:text-[var(--red)]'
}

// Botão só de ícone: o rótulo acessível é obrigatório
export default function IconButton({
  label,
  tone = 'muted',
  className = '',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex shrink-0 items-center justify-center rounded-[var(--radius-control)] transition-colors ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
