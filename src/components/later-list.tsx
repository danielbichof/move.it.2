'use client'

import { type FormEvent, useState } from 'react'
import PillarIcon from '@/src/components/pillar-icon'
import Button from '@/src/components/ui/button'
import IconButton from '@/src/components/ui/icon-button'
import { PlusIcon, XIcon } from '@/src/components/ui/icons'
import SectionHeading from '@/src/components/ui/section-heading'
import Tag from '@/src/components/ui/tag'
import TextField from '@/src/components/ui/text-field'
import { useSystemM, useSystemMActions } from '@/src/contexts/system-m-context'
import { type Pillar, pillars } from '@/src/lib/system-m'

function NewItemForm({ onDone }: { onDone: () => void }) {
  const { addItem } = useSystemMActions()
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState<Pillar>('estabilidade')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = title.trim()

    if (!trimmed) return

    addItem(trimmed, pillar)
    setTitle('')
    onDone()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 py-3">
      <TextField
        label="Novo item"
        placeholder="Novo item"
        value={title}
        maxLength={120}
        className="w-full"
        onChange={e => setTitle(e.target.value)}
      />
      <div className="flex flex-wrap items-center gap-2">
        {pillars.map(option => (
          <button
            key={option.id}
            type="button"
            aria-pressed={pillar === option.id}
            className={`transition-opacity ${pillar === option.id ? '' : 'opacity-45'}`}
            onClick={() => setPillar(option.id)}
          >
            <Tag background={`var(--pillar-${option.id})`} color={`var(--pillar-${option.id}-ink)`}>
              {option.name}
            </Tag>
          </button>
        ))}
        <button
          type="submit"
          disabled={!title.trim()}
          className="ml-auto text-xs font-bold text-[var(--accent)] disabled:opacity-40"
        >
          Adicionar
        </button>
      </div>
    </form>
  )
}

// Tudo que não é o foco do momento fica aqui, pronto para virar o próximo ciclo
export default function LaterList() {
  const { items, focusId } = useSystemM()
  const { setFocus, removeItem } = useSystemMActions()
  const [isAdding, setIsAdding] = useState(false)

  const pending = items.filter(item => item.id !== focusId)

  return (
    <section className="flex min-w-0 flex-col">
      <SectionHeading>Depois</SectionHeading>

      <ul className="mt-3 border-t border-[var(--row-line)]">
        {pending.map(item => (
          <li
            key={item.id}
            className="group flex items-stretch gap-1 border-b border-[var(--row-line)]"
          >
            <button
              type="button"
              className="-mx-2 flex min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-control)] px-2 py-3.5 text-left transition-colors hover:bg-[var(--accent-faint)]"
              aria-label={`Focar em ${item.title}`}
              onClick={() => setFocus(item.id)}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="line-clamp-2 text-[15px] font-semibold break-words text-[var(--ink)]">
                  {item.title}
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: `var(--pillar-${item.pillar}-ink)` }}
                >
                  <PillarIcon pillar={item.pillar} className="size-3.5" />
                  {pillars.find(option => option.id === item.pillar)?.name}
                </span>
              </span>

              <span
                className="shrink-0 text-xs font-bold text-[var(--accent)] sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                aria-hidden="true"
              >
                Focar
              </span>
            </button>

            <IconButton
              label={`Remover ${item.title}`}
              tone="danger"
              className="px-1"
              onClick={() => removeItem(item.id)}
            >
              <XIcon className="size-4" />
            </IconButton>
          </li>
        ))}
      </ul>

      {pending.length === 0 && !isAdding && (
        <p className="pt-3.5 text-[13px] text-[var(--ink-muted)]">
          Nada esperando. Adicione o que vem depois deste ciclo.
        </p>
      )}

      {isAdding ? (
        <NewItemForm onDone={() => setIsAdding(false)} />
      ) : (
        <Button
          variant="ghost"
          size="plain"
          className="-mx-2 h-11 w-[calc(100%+1rem)] justify-start rounded-[var(--radius-control)] px-2 text-sm font-bold"
          onClick={() => setIsAdding(true)}
        >
          <PlusIcon className="size-4" />
          Adicionar item
        </Button>
      )}
    </section>
  )
}
