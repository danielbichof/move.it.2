'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useOptimistic,
  useState,
  useTransition
} from 'react'
import {
  type Habit,
  type InboxItem,
  type Item,
  isHabitDone,
  newId,
  type Pillar,
  type SystemM,
  today
} from '@/src/lib/system-m'
import * as server from '@/src/lib/system-m-actions'

interface SystemMActions {
  addItem: (title: string, pillar: Pillar) => void
  removeItem: (id: string) => void
  setFocus: (id: string | null) => void
  addInboxItem: (text: string) => void
  discardInboxItem: (id: string) => void
  moveInboxItem: (id: string, pillar: Pillar) => void
  addHabit: (name: string) => void
  toggleHabit: (habit: Habit) => void
  removeHabit: (id: string) => void
  setUserName: (name: string) => void
  setCycleMinutes: (minutes: number) => void
}

type Update = (state: SystemM) => SystemM

const SystemMContext = createContext({} as SystemM)
const SystemMActionsContext = createContext({} as SystemMActions)

interface SystemMProviderProps {
  children: ReactNode
  initialState: SystemM
}

export function SystemMProvider({ children, initialState }: SystemMProviderProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [saveFailed, setSaveFailed] = useState(false)

  // A tela muda na hora; quando a action termina, vale o que o servidor gravou
  const [state, applyOptimistic] = useOptimistic(initialState, (current, update: Update) =>
    update(current)
  )

  function mutate(update: Update, persist: () => Promise<void>) {
    startTransition(async () => {
      applyOptimistic(update)

      try {
        await persist()
        setSaveFailed(false)
      } catch {
        // A mudança otimista é desfeita sozinha; o aviso explica por que ela sumiu
        setSaveFailed(true)
      }
    })
  }

  // Outro dispositivo pode ter gravado enquanto a aba estava em segundo plano
  useEffect(() => {
    function refresh() {
      if (document.visibilityState === 'visible') router.refresh()
    }

    document.addEventListener('visibilitychange', refresh)

    return () => document.removeEventListener('visibilitychange', refresh)
  }, [router])

  const actions: SystemMActions = {
    addItem(title, pillar) {
      const item: Item = { id: newId(), pillar, title, createdAt: new Date().toISOString() }

      mutate(
        current => ({ ...current, items: [...current.items, item] }),
        () => server.addItem(item)
      )
    },

    removeItem(id) {
      mutate(
        current => ({
          ...current,
          items: current.items.filter(item => item.id !== id),
          focusId: current.focusId === id ? null : current.focusId
        }),
        () => server.removeItem(id)
      )
    },

    setFocus(id) {
      mutate(
        current => ({ ...current, focusId: id }),
        () => server.setFocus(id)
      )
    },

    addInboxItem(text) {
      const entry: InboxItem = { id: newId(), text, createdAt: new Date().toISOString() }

      mutate(
        current => ({ ...current, inbox: [...current.inbox, entry] }),
        () => server.addInboxItem(entry)
      )
    },

    discardInboxItem(id) {
      mutate(
        current => ({ ...current, inbox: current.inbox.filter(entry => entry.id !== id) }),
        () => server.discardInboxItem(id)
      )
    },

    // O item sai da Inbox e entra no pilar escolhido
    moveInboxItem(id, pillar) {
      const entry = state.inbox.find(inboxItem => inboxItem.id === id)

      if (!entry) return

      const item: Item = { id: newId(), pillar, title: entry.text, createdAt: entry.createdAt }

      mutate(
        current => ({
          ...current,
          items: [...current.items, item],
          inbox: current.inbox.filter(inboxItem => inboxItem.id !== id)
        }),
        () => server.moveInboxItem(id, item)
      )
    },

    addHabit(name) {
      const habit: Habit = { id: newId(), name, doneOn: null }

      mutate(
        current => ({ ...current, habits: [...current.habits, habit] }),
        () => server.addHabit(habit)
      )
    },

    toggleHabit(habit) {
      const doneOn = isHabitDone(habit) ? null : today()

      mutate(
        current => ({
          ...current,
          habits: current.habits.map(other =>
            other.id === habit.id ? { ...other, doneOn } : other
          )
        }),
        () => server.setHabitDone(habit.id, doneOn)
      )
    },

    removeHabit(id) {
      mutate(
        current => ({ ...current, habits: current.habits.filter(habit => habit.id !== id) }),
        () => server.removeHabit(id)
      )
    },

    setUserName(name) {
      mutate(
        current => ({ ...current, userName: name }),
        () => server.setUserName(name)
      )
    },

    setCycleMinutes(minutes) {
      mutate(
        current => ({ ...current, cycleMinutes: minutes }),
        () => server.setCycleMinutes(minutes)
      )
    }
  }

  return (
    <SystemMContext.Provider value={state}>
      <SystemMActionsContext.Provider value={actions}>
        {children}
        {saveFailed && (
          <p
            role="alert"
            className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[420px] rounded-[var(--radius-card)] bg-[var(--ink)] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
          >
            Não foi possível salvar. Confira a conexão e tente de novo.
          </p>
        )}
      </SystemMActionsContext.Provider>
    </SystemMContext.Provider>
  )
}

export function useSystemM() {
  return useContext(SystemMContext)
}

export function useSystemMActions() {
  return useContext(SystemMActionsContext)
}
