import type { Pillar } from '@/src/lib/system-m'

const paths: Record<Pillar, string[]> = {
  estabilidade: ['M3 11l9-7 9 7', 'M5 10v10h14V10', 'M10 20v-6h4v6'],
  crescimento: ['M3 17l6-6 4 4 8-8', 'M15 7h6v6'],
  laboratorio: [
    'M9 3h6',
    'M10 3v6.5L4.8 18.2A1.9 1.9 0 0 0 6.4 21h11.2a1.9 1.9 0 0 0 1.6-2.8L14 9.5V3',
    'M7.5 15h9'
  ]
}

export default function PillarIcon({ pillar, className }: { pillar: Pillar; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[pillar].map(d => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
