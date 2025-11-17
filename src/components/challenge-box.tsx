'use client'

import { useTransition } from 'react';
import Image from 'next/image';
import { useChallengesContext } from '../contexts/challenges-context';
import { useCountdownContext } from '../contexts/countdown-context';

export default function ChallengeBox() {
    const { activeChallenge, resetChallenge, completeChallenge } = useChallengesContext()
    const { resetCountdown } = useCountdownContext()
    const [isPending, startTransition] = useTransition()


    function handleChallengeSucceeded(){
        startTransition(() => {
            completeChallenge();
            resetCountdown();
        });
    }


    function handleChallengeFailed(){
        startTransition(() => {
            resetChallenge();
            resetCountdown();
        });
    }
    return(
        <div className="h-full bg-white rounded shadow-lg p-6 flex flex-col items-center justify-center text-center" style={{boxShadow: '0 0 60px rgba(0, 0, 0, 0.05)'}}>

            { activeChallenge ? (
                <div className="h-full flex flex-col">
                    <header className="font-semibold text-xl px-8 pb-6 border-b" style={{color: 'var(--blue)', borderBottomColor: 'var(--gray-line)'}}>
                        Ganhe {activeChallenge.amount} xp
                    </header>

                    <main className="flex-1 flex flex-col items-center justify-center">
                        <Image src={`/icons/${activeChallenge.type}.svg`} alt={`${activeChallenge.type} challenge`} width={112} height={112} className="mb-6"/>
                        <strong className="text-2xl font-semibold my-6" style={{color: 'var(--title)'}}>
                            Novo desafio
                        </strong>
                        <p className="leading-6">{activeChallenge.description}</p>
                    </main>

                    <footer className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="h-12 flex items-center justify-center border-0 rounded text-base font-semibold text-white transition-all hover:brightness-90 disabled:opacity-50"
                            style={{backgroundColor: 'var(--red)'}}
                            onClick={handleChallengeFailed}
                            disabled={isPending}
                        >
                            {isPending ? 'Processando...' : 'Falhei'}
                        </button>
                        <button
                            type="button"
                            className="h-12 flex items-center justify-center border-0 rounded text-base font-semibold text-white transition-all hover:brightness-90 disabled:opacity-50"
                            style={{backgroundColor: 'var(--green)'}}
                            onClick={handleChallengeSucceeded}
                            disabled={isPending}
                        >
                            {isPending ? 'Processando...' : 'Completei'}
                        </button>
                    </footer>
                </div>
            ): (
            <div className="flex flex-col items-center">
                <strong className="text-2xl font-medium leading-snug">
                    Finalize um ciclo para receber um desafio
                </strong>
                <p className="flex flex-col items-center leading-snug max-w-3/5 mt-12">
                    <Image src="/icons/level-up.svg" alt="level up" width={96} height={96} className="mb-4"/>
                    Avance de level completando desafios
                </p>
            </div>)}
        </div>
    )
}