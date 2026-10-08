import Tag from '@/src/components/ui/tag'
import { type Pillar, pillars } from '@/src/lib/system-m'

interface PillarTagProps {
  pillar: Pillar
  size?: 'sm' | 'md'
  // Sobre um fundo já tingido pelo pilar, a pílula vira branca para não sumir
  onTint?: boolean
}

export default function PillarTag({ pillar, size = 'sm', onTint = false }: PillarTagProps) {
  const name = pillars.find(item => item.id === pillar)?.name

  return (
    <Tag
      size={size}
      background={onTint ? 'var(--surface)' : `var(--pillar-${pillar})`}
      color={`var(--pillar-${pillar}-ink)`}
    >
      {name}
    </Tag>
  )
}
