'use client'

import Image from 'next/image'
import { useChallengesContext } from '@/src/contexts/challenges-context'

export function LevelUpModal() {
  const { level, closeLevelUpModal } = useChallengesContext()
  
  return (
    <div 
      className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-50"
      style={{ background: 'rgba(243, 243, 245, 0.8)' }}
    >
      <div 
        className="bg-white w-full max-w-[400px] px-12 py-8 rounded text-center relative"
        style={{ 
          background: 'var(--white)',
          borderRadius: '5px',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.05)'
        }}
      >
        <header 
          className="font-semibold text-center mb-4"
          style={{
            fontSize: '8.75rem',
            fontWeight: 600,
            color: 'var(--blue)',
            background: 'url(\'/icons/levelup.svg\') no-repeat center',
            backgroundSize: 'contain'
          }}
        >
          {level}
        </header>

        <strong 
          className="block text-4xl mb-1"
          style={{
            fontSize: '2.25rem',
            color: 'var(--title)'
          }}
        >
          Parabéns
        </strong>
        
        <p 
          className="text-xl mt-1"
          style={{
            fontSize: '1.25rem',
            color: 'var(--text)',
            marginTop: '0.25rem'
          }}
        >
          Você alcançou um novo level
        </p>

        <button 
          type="button"
          className="absolute top-2 right-2 bg-transparent border-0 text-[0px] rounded-full hover:bg-gray-100"
          onClick={closeLevelUpModal}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            border: 0,
            fontSize: '0px'
          }}
        >
          <Image 
            src="/icons/close.svg" 
            alt="Fechar modal" 
            width={24} 
            height={24}
          />
        </button>
      </div>
    </div>
  )
}