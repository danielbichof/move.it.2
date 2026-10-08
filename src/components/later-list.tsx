'use client'

import { type FormEvent, useState } from 'react'
import PillarIcon from '@/src/components/pillar-icon'
import PillarTag from '@/src/components/pillar-tag'
import Button from '@/src/components/ui/button'
import Card from '@/src/components/ui/card'
import IconButton from '@/src/components/ui/icon-button'
import { PlusIcon, XIcon } from '@/src/components/ui/icons'
import SectionHeading from '@/src/components/ui/section-heading'
import Tag from '@/src/components/ui/tag'
import TextField from '@/src/components/ui/text-field'
import { type Item, newId, type Pillar, pillars } from '@/src/lib/system-m'
import { updateSystemM, useSystemM, useSystemMReady } from '@/src/lib/system-m-store'

function setFocus(id: string) {
  updateSystemM(state => ({ ...state, focusId: id }))
}

function removeItem(id: string) {
  updateSystemM(state => ({
    ...state,
    items: state.items.filter(item => item.id !== id),
    focusId: state.focusId === id ? null : state.focusId
  }))
}

function NewItemForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState('')
  const [pillar, setPillar] = useState<Pillar>('estabilidade')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = title.trim()

    if (!trimmed) return

    const item: Item = { id: newId(), pillar, title: trimmed, createdAt: new Date().toISOString() }

    updateSystemM(state => ({ ...state, items: [...state.items, item] }))
    setTitle('')
    onDone()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 px-[22px] py-4">
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
          className="ml-auto text-xs font-extrabold text-[var(--accent)] disabled:opacity-40"
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
  const ready = useSystemMReady()
  const [isAdding, setIsAdding] = useState(false)

  const pending = items.filter(item => item.id !== focusId)

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <SectionHeading>Depois</SectionHeading>

      <Card className="overflow-hidden">
        <ul>
          {pending.map(item => (
            <li
              key={item.id}
              className="group relative flex items-stretch border-b border-[var(--row-line)]"
            >
              <span
                className="absolute top-0 bottom-0 left-0 z-[1] w-[3px]"
                style={{ background: `var(--pillar-${item.pillar}-ink)` }}
                aria-hidden="true"
              />
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3.5 py-4 pr-2 pl-[22px] text-left transition-colors hover:bg-[var(--accent-faint)]"
                aria-label={`Focar em ${item.title}`}
                onClick={() => setFocus(item.id)}
              >
                <span
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `var(--pillar-${item.pillar})`,
                    color: `var(--pillar-${item.pillar}-ink)`
                  }}
                  aria-hidden="true"
                >
                  <PillarIcon pillar={item.pillar} className="size-[17px]" />
                </span>

                <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                  <span className="line-clamp-2 text-sm font-extrabold break-words text-[var(--ink)]">
                    {item.title}
                  </span>
                  <PillarTag pillar={item.pillar} />
                </span>

                <span
                  className="shrink-0 text-xs font-extrabold text-[var(--accent)] sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                  aria-hidden="true"
                >
                  Focar
                </span>
              </button>

              <div className="flex shrink-0 items-center pr-3 pl-1">
                <IconButton
                  label={`Remover ${item.title}`}
                  tone="danger"
                  onClick={() => removeItem(item.id)}
                >
                  <XIcon className="size-[16px]" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>

        {ready && pending.length === 0 && !isAdding && (
          <p className="px-[22px] pt-[18px] text-xs text-[var(--ink-muted)]">
            Nada esperando. Adicione o que vem depois deste ciclo.
          </p>
        )}

        {isAdding ? (
          <NewItemForm onDone={() => setIsAdding(false)} />
        ) : (
          <Button
            variant="ghost"
            size="plain"
            className="h-[52px] w-full justify-start px-[22px] text-sm font-bold"
            onClick={() => setIsAdding(true)}
          >
            <PlusIcon className="size-4" />
            Adicionar item
          </Button>
        )}
      </Card>
    </section>
  )
}
