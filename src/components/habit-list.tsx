'use client'

import { type FormEvent, useState } from 'react'
import Button from '@/src/components/ui/button'
import CheckCircle from '@/src/components/ui/check-circle'
import IconButton from '@/src/components/ui/icon-button'
import { PlusIcon, XIcon } from '@/src/components/ui/icons'
import SectionHeading from '@/src/components/ui/section-heading'
import TextField from '@/src/components/ui/text-field'
import { type Habit, isHabitDone, newId, today } from '@/src/lib/system-m'
import { updateSystemM, useSystemM, useSystemMReady } from '@/src/lib/system-m-store'

function toggleHabit(id: string) {
  updateSystemM(state => ({
    ...state,
    habits: state.habits.map(habit =>
      habit.id === id ? { ...habit, doneOn: isHabitDone(habit) ? null : today() } : habit
    )
  }))
}

function removeHabit(id: string) {
  updateSystemM(state => ({ ...state, habits: state.habits.filter(habit => habit.id !== id) }))
}

function NewHabitForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = name.trim()

    if (!trimmed) return

    const habit: Habit = { id: newId(), name: trimmed, doneOn: null }

    updateSystemM(state => ({ ...state, habits: [...state.habits, habit] }))
    setName('')
    onDone()
  }

  return (
    <form onSubmit={submit} className="flex h-[52px] items-center gap-2.5">
      <TextField
        label="Novo hábito"
        placeholder="Novo hábito"
        value={name}
        maxLength={60}
        className="h-9 flex-1"
        onChange={e => setName(e.target.value)}
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="text-xs font-bold text-[var(--accent)] disabled:opacity-40"
      >
        Adicionar
      </button>
    </form>
  )
}

// Os hábitos do dia: marcados zeram sozinhos quando a data vira
export default function HabitList() {
  const { habits } = useSystemM()
  const ready = useSystemMReady()
  const [isAdding, setIsAdding] = useState(false)

  return (
    <section className="flex min-w-0 flex-col">
      <SectionHeading>Hábitos de hoje</SectionHeading>

      <ul className="mt-3 border-t border-[var(--row-line)]">
        {habits.map(habit => {
          const done = isHabitDone(habit)

          return (
            <li
              key={habit.id}
              className="flex min-h-[52px] items-center gap-3 border-b border-[var(--row-line)]"
            >
              <CheckCircle
                checked={done}
                label={`Marcar ${habit.name} como feito`}
                onChange={() => toggleHabit(habit.id)}
              />

              <span
                className={`min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--ink)] ${done ? 'line-through opacity-50' : ''}`}
              >
                {habit.name}
              </span>

              <IconButton
                label={`Remover ${habit.name}`}
                tone="danger"
                className="px-1"
                onClick={() => removeHabit(habit.id)}
              >
                <XIcon className="size-4" />
              </IconButton>
            </li>
          )
        })}
      </ul>

      {ready && habits.length === 0 && !isAdding && (
        <p className="pt-3.5 text-[13px] text-[var(--ink-muted)]">
          Sem hábitos ainda. Comece com um pequeno.
        </p>
      )}

      {isAdding ? (
        <NewHabitForm onDone={() => setIsAdding(false)} />
      ) : (
        <Button
          variant="ghost"
          size="plain"
          className="-mx-2 h-11 w-[calc(100%+1rem)] justify-start rounded-[var(--radius-control)] px-2 text-sm font-bold"
          onClick={() => setIsAdding(true)}
        >
          <PlusIcon className="size-4" />
          Adicionar hábito
        </Button>
      )}
    </section>
  )
}
