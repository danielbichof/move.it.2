'use client'

import { useState } from 'react'
import QuickCapture from '@/src/components/quick-capture'
import Button from '@/src/components/ui/button'
import Card from '@/src/components/ui/card'
import CountBadge from '@/src/components/ui/count-badge'
import IconButton from '@/src/components/ui/icon-button'
import { PlusIcon, XIcon } from '@/src/components/ui/icons'
import SectionHeading from '@/src/components/ui/section-heading'
import Tag from '@/src/components/ui/tag'
import { type Item, newId, pillars } from '@/src/lib/system-m'
import { updateSystemM, useSystemM, useSystemMReady } from '@/src/lib/system-m-store'

function discard(id: string) {
  updateSystemM(state => ({ ...state, inbox: state.inbox.filter(entry => entry.id !== id) }))
}

// O item sai da Inbox e entra no pilar escolhido
function moveTo(id: string, pillar: Item['pillar']) {
  updateSystemM(state => {
    const entry = state.inbox.find(inboxItem => inboxItem.id === id)

    if (!entry) return state

    const item: Item = { id: newId(), pillar, title: entry.text, createdAt: entry.createdAt }

    return {
      ...state,
      items: [...state.items, item],
      inbox: state.inbox.filter(inboxItem => inboxItem.id !== id)
    }
  })
}

// Captura rápida e triagem: o item vira um pilar ou é descartado
export default function Inbox() {
  const { inbox } = useSystemM()
  const ready = useSystemMReady()
  const [isCapturing, setIsCapturing] = useState(false)

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center gap-[9px]">
        <SectionHeading>Inbox</SectionHeading>
        {inbox.length > 0 && <CountBadge count={inbox.length} />}
        <Button
          variant="quiet"
          size="xs"
          aria-expanded={isCapturing}
          className="ml-auto"
          onClick={() => setIsCapturing(open => !open)}
        >
          <PlusIcon className="size-[13px]" />
          Novo item
        </Button>
      </div>

      <Card className="flex flex-col gap-4 px-[18px] py-4">
        {isCapturing && <QuickCapture />}

        {ready && inbox.length === 0 && !isCapturing && (
          <p className="text-xs text-[var(--ink-muted)]">
            Inbox vazia. Anote agora, decida depois onde colocar.
          </p>
        )}

        {inbox.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-start gap-3 ${index > 0 ? 'border-t border-[var(--divider)] pt-4' : ''}`}
          >
            <span
              className="mt-0.5 size-[18px] shrink-0 rounded-full border-2 border-[var(--accent-ring-soft)]"
              aria-hidden="true"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-bold break-words text-[var(--ink)]">
                {entry.text}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {pillars.map(pillar => (
                  <button
                    key={pillar.id}
                    type="button"
                    aria-label={`Mover ${entry.text} para ${pillar.name}`}
                    className="transition-all hover:brightness-95"
                    onClick={() => moveTo(entry.id, pillar.id)}
                  >
                    <Tag
                      background={`var(--pillar-${pillar.id})`}
                      color={`var(--pillar-${pillar.id}-ink)`}
                    >
                      {pillar.name}
                    </Tag>
                  </button>
                ))}
              </div>
            </div>

            <IconButton
              label={`Descartar ${entry.text}`}
              tone="danger"
              onClick={() => discard(entry.id)}
            >
              <XIcon className="size-4" />
            </IconButton>
          </div>
        ))}
      </Card>
    </section>
  )
}
