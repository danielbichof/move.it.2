'use client'

import { type ReactNode, useEffect, useId, useRef } from 'react'
import IconButton from '@/src/components/ui/icon-button'
import { XIcon } from '@/src/components/ui/icons'

interface ModalProps {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  className?: string
}

// Diálogo centralizado sobre um fundo escurecido: fecha no Esc, no X e no clique de fora
export default function Modal({
  title,
  description,
  onClose,
  children,
  className = ''
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialog = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dialog.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    const { overflow } = document.body.style

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fechar"
        className="absolute inset-0 cursor-default bg-[#17243bb3]"
        onClick={onClose}
      />

      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative max-h-full w-full overflow-y-auto rounded-[var(--radius-card)] bg-white p-5 shadow-[0_24px_56px_#07163140] outline-none sm:p-7 ${className}`}
      >
        <h2 id={titleId} className="pr-10 text-[22px] font-bold text-[var(--ink)]">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="mt-1.5 text-sm font-medium text-[var(--ink-muted)]">
            {description}
          </p>
        )}

        <IconButton
          label="Fechar"
          className="absolute top-6 right-6 size-8 text-[#49658d]"
          onClick={onClose}
        >
          <XIcon className="size-[18px]" />
        </IconButton>

        {children}
      </div>
    </div>
  )
}
