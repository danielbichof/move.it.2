'use client'

import Button from '@/src/components/ui/button'
import Modal from '@/src/components/ui/modal'
import { useChallengesContext } from '@/src/contexts/challenges-context'

export function LevelUpModal() {
  const { level, closeLevelUpModal } = useChallengesContext()

  return (
    <Modal
      title="Parabéns"
      description="Você alcançou um novo level"
      onClose={closeLevelUpModal}
      className="max-w-[400px] text-center"
    >
      <p
        className="mt-6 flex h-36 items-center justify-center font-rajdhani text-[8rem] leading-none font-bold text-[var(--accent)]"
        style={{
          background: 'url("/icons/levelup.svg") no-repeat center',
          backgroundSize: 'contain'
        }}
      >
        {level}
      </p>

      <Button variant="primary" className="mt-6 w-full" onClick={closeLevelUpModal}>
        Continuar
      </Button>
    </Modal>
  )
}
