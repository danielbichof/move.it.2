'use client'

import Link from 'next/link'
import { useState } from 'react'
import CompletedChallenges from '@/src/components/completed-challenges'
import ExperienceBar from '@/src/components/experience-bar'
import Profile from '@/src/components/profile'
import Avatar from '@/src/components/ui/avatar'
import Card from '@/src/components/ui/card'
import { BoltIcon, ChevronDownIcon } from '@/src/components/ui/icons'
import { useSystemM } from '@/src/contexts/system-m-context'

export default function TopHeader() {
  const { userName } = useSystemM()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="border-b border-[var(--header-line)] bg-[var(--header-bg)]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center gap-4 px-4 md:gap-8 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-[10px]">
          <BoltIcon className="size-6 text-[var(--header-brand)]" />
          <span className="text-lg font-bold text-[var(--header-title)]">move.it</span>
        </Link>

        <ExperienceBar className="min-w-0 flex-1" />

        <div className="relative ml-auto shrink-0">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isProfileOpen}
            aria-label="Abrir menu do perfil"
            className="flex items-center gap-2"
            onClick={() => setIsProfileOpen(open => !open)}
          >
            <Avatar name={userName} />
            <ChevronDownIcon className="size-3.5 text-[var(--header-icon)]" />
          </button>

          {isProfileOpen && (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Fechar menu do perfil"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setIsProfileOpen(false)}
              />
              <Card className="absolute top-full right-0 z-20 mt-2 flex w-60 flex-col gap-4 p-4 shadow-lg">
                <Profile />
                <CompletedChallenges />
              </Card>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
