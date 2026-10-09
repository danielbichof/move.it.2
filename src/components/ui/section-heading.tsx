import type { ReactNode } from 'react'

export default function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-[15px] font-bold text-[var(--ink)]">{children}</h2>
}
