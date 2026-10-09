export default function CountBadge({ count }: { count: number }) {
  return (
    <span className="flex size-6 items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
      {count}
    </span>
  )
}
