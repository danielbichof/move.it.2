'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'cta' | 'primary' | 'outline' | 'success' | 'ghost' | 'quiet' | 'soft'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'cycle' | 'plain'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  cta: 'bg-[var(--cta)] text-white hover:brightness-125',
  primary: 'bg-[var(--cta)] text-white hover:brightness-125',
  outline: 'abandon-button',
  success: 'bg-[var(--gain)] text-white hover:brightness-110',
  ghost: 'text-[var(--accent)] hover:bg-[var(--accent-faint)]',
  quiet: 'bg-[var(--accent-faint)] text-[var(--accent)] hover:brightness-95',
  soft: 'bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]'
}

// Geometria por tamanho: raio e peso ficam aqui para que `plain` possa abrir mão deles
const sizes: Record<ButtonSize, string> = {
  xs: 'h-7 gap-[5px] rounded-[var(--radius-control)] px-2.5 text-xs font-bold',
  sm: 'h-9 gap-2 rounded-[var(--radius-control)] px-3.5 text-[13px] font-bold',
  md: 'h-11 gap-2.5 rounded-[var(--radius-control)] px-5 text-sm font-bold',
  lg: 'h-12 gap-2.5 rounded-[var(--radius-control)] px-4 text-sm font-bold',
  xl: 'h-[54px] gap-2.5 rounded-[var(--radius-control)] px-6 text-sm font-bold',
  cycle: 'h-12 gap-[10px] rounded px-4 text-[15px] font-medium',
  plain: ''
}

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
