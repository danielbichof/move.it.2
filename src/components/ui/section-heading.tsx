import type { ReactNode } from 'react'

export default function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-[17px] font-extrabold text-[var(--ink)]">{children}</h2>
}
