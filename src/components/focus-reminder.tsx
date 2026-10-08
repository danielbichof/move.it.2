import { SproutIcon } from '@/src/components/ui/icons'

interface FocusReminderProps {
  // Cor do pilar em foco; sem foco, vale o acento padrão
  color?: string
}

// A plantinha do Move.it: lembra, sem pedir nada, por que o ciclo existe
export default function FocusReminder({ color = 'var(--accent-ring-soft)' }: FocusReminderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0" style={{ color }} aria-hidden="true">
        <SproutIcon className="size-9" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-[var(--ink)]">Mantenha o foco</p>
        <p className="text-xs text-[var(--ink-soft)]">Cada ciclo te aproxima dos seus objetivos.</p>
      </div>
    </div>
  )
}
