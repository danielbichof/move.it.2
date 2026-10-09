'use client'

import QuickCapture from '@/src/components/quick-capture'
import CountBadge from '@/src/components/ui/count-badge'
import IconButton from '@/src/components/ui/icon-button'
import { XIcon } from '@/src/components/ui/icons'
import SectionHeading from '@/src/components/ui/section-heading'
import Tag from '@/src/components/ui/tag'
import { useSystemM, useSystemMActions } from '@/src/contexts/system-m-context'
import { pillars } from '@/src/lib/system-m'

// Captura rápida e triagem: o item vira um pilar ou é descartado
export default function Inbox() {
  const { inbox } = useSystemM()
  const { discardInboxItem, moveInboxItem } = useSystemMActions()

  return (
    <section className="flex min-w-0 flex-col">
      <div className="flex items-center gap-2">
        <SectionHeading>Inbox</SectionHeading>
        {inbox.length > 0 && <CountBadge count={inbox.length} />}
      </div>

      <ul className="mt-3 border-t border-[var(--row-line)]">
        {inbox.map(entry => (
          <li
            key={entry.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 border-b border-[var(--row-line)] py-3.5"
          >
            {/* `contents`: o texto divide a linha com o X e as tags ganham a largura toda */}
            <div className="contents">
              <span className="text-[15px] font-semibold break-words text-[var(--ink)]">
                {entry.text}
              </span>
              <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[var(--ink-muted)]">Mover para</span>
                {pillars.map(pillar => (
                  <button
                    key={pillar.id}
                    type="button"
                    aria-label={`Mover ${entry.text} para ${pillar.name}`}
                    className="transition-all hover:brightness-95"
                    onClick={() => moveInboxItem(entry.id, pillar.id)}
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
              className="px-1"
              onClick={() => discardInboxItem(entry.id)}
            >
              <XIcon className="size-4" />
            </IconButton>
          </li>
        ))}
      </ul>

      {inbox.length === 0 && (
        <p className="pt-3.5 text-[13px] text-[var(--ink-muted)]">
          Inbox vazia. Anote agora, decida depois onde colocar.
        </p>
      )}

      <div className="mt-3.5">
        <QuickCapture />
      </div>
    </section>
  )
}
