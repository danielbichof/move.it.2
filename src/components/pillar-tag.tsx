import Tag from '@/src/components/ui/tag'
import { type Pillar, pillars } from '@/src/lib/system-m'

interface PillarTagProps {
  pillar: Pillar
  size?: 'sm' | 'md'
}

export default function PillarTag({ pillar, size = 'sm' }: PillarTagProps) {
  const name = pillars.find(item => item.id === pillar)?.name

  return (
    <Tag size={size} background={`var(--pillar-${pillar})`} color={`var(--pillar-${pillar}-ink)`}>
      {name}
    </Tag>
  )
}
