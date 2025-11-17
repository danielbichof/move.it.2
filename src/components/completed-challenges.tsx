'use client'

import { useChallengesContext } from '../contexts/challenges-context'

export default function CompletedChallenges() {
    const { challengesCompleted } = useChallengesContext()

    return(
        <div className="flex items-center justify-between my-14 pb-4 border-b font-medium" style={{borderBottomColor: '#d7d8da'}}>
            <span className="text-xl">Desafios Completos</span>
            <span className="text-2xl">{challengesCompleted}</span>
        </div>
    )
}