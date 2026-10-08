'use client'

import Image from 'next/image'
import Avatar from '@/src/components/ui/avatar'
import { updateSystemM, useSystemM } from '@/src/lib/system-m-store'
import { useChallengesContext } from '../contexts/challenges-context'

export default function Profile() {
  const { level } = useChallengesContext()
  const { userName } = useSystemM()

  function setUserName(name: string) {
    if (name !== userName) {
      updateSystemM(state => ({ ...state, userName: name }))
    }
  }

  return (
    <div className="flex items-center">
      <Avatar name={userName} size={40} className="bg-[var(--accent)]!" />
      <div className="ml-3">
        <input
          key={userName}
          type="text"
          maxLength={40}
          defaultValue={userName}
          placeholder="Seu nome"
          aria-label="Seu nome"
          className="block w-36 max-w-full border-0 bg-transparent text-base font-semibold text-[var(--ink)] outline-none"
          onBlur={e => setUserName(e.target.value.trim())}
          onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
        />
        <p className="flex items-center text-xs">
          <Image
            src="/icons/level.svg"
            alt=""
            width={10}
            height={12}
            className="mr-1.5"
            style={{ width: 10, height: 12 }}
          />
          Level {level}
        </p>
      </div>
    </div>
  )
}
