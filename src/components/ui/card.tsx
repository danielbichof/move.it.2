import type { CSSProperties, ReactNode } from 'react'

type CardElevation = 'flat' | 'raised'

interface CardProps {
  children: ReactNode
  elevation?: CardElevation
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'article'
}

const elevations: Record<CardElevation, string> = {
  flat: 'card',
  raised: 'panel'
}

// Superfície branca padrão do design: borda clara, raio 8 e sombra opcional
export default function Card({
  children,
  elevation = 'flat',
  className = '',
  style,
  as: Tag = 'div'
}: CardProps) {
  return (
    <Tag className={`${elevations[elevation]} ${className}`} style={style}>
      {children}
    </Tag>
  )
}
