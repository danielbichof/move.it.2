import type { ReactNode } from 'react'

type TagSize = 'sm' | 'md'

interface TagProps {
  children: ReactNode
  background: string
  color: string
  size?: TagSize
}

const sizes: Record<TagSize, string> = {
  sm: 'rounded-[var(--radius-control)] px-2 py-[3px] text-[10px] font-extrabold',
  md: 'rounded-[var(--radius-control)] px-3.5 py-[3px] text-xs font-bold'
}

// Pílula colorida do design; quem usa decide as cores (tokens de pilar, por exemplo)
export default function Tag({ children, background, color, size = 'sm' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center leading-none ${sizes[size]}`}
      style={{ background, color }}
    >
      {children}
    </span>
  )
}
