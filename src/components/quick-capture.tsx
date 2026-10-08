'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'
import Button from '@/src/components/ui/button'
import TextField from '@/src/components/ui/text-field'
import { type InboxItem, newId } from '@/src/lib/system-m'
import { updateSystemM } from '@/src/lib/system-m-store'

const confirmationMs = 2000

// Captura sem sair do foco: grava, limpa o campo, confirma em silêncio e mantém o cursor no input
export default function QuickCapture() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = text.trim()

    if (!trimmed) return

    const item: InboxItem = {
      id: newId(),
      text: trimmed,
      createdAt: new Date().toISOString()
    }

    updateSystemM(state => ({ ...state, inbox: [...state.inbox, item] }))
    setText('')
    setSaved(true)

    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setSaved(false), confirmationMs)
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex items-center gap-2">
        <TextField
          label="Anotar algo para depois"
          placeholder="Anotar algo para depois"
          value={text}
          maxLength={200}
          className="flex-1"
          onChange={e => setText(e.target.value)}
        />
        <Button type="submit" variant="outline" size="md" tabIndex={-1} disabled={!text.trim()}>
          Anotar
        </Button>
      </div>
      <p className="mt-1 h-5 text-xs" role="status" aria-live="polite">
        {saved ? 'Anotado.' : ''}
      </p>
    </form>
  )
}
