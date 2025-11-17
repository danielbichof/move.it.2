'use client'

import { useChallengesContext } from '../contexts/challenges-context'


export default function ExperienceBar(){
    const { currentExperience, experienceToNextLevel } = useChallengesContext()
    
    const percentToLevel = Math.round((currentExperience * 100)) / experienceToNextLevel;
    
    
    return (
        <header className="flex items-start w-full py-12 mb-8">
            <span className="text-base">0 xp</span>
            <div className="flex-1 h-1 rounded mx-6 relative bg-gray-400">
                <div className="h-1 rounded transition-all duration-300" style={{width: `${percentToLevel}%`, backgroundColor: 'var(--green)'}} />
                <span className="absolute top-3 text-sm font-medium transform -translate-x-1/2" style={{ left: `${percentToLevel}%`}}>
                    {currentExperience} xp
                </span>
            </div>
            <span className="text-base">{experienceToNextLevel} xp</span>
        </header>
    )
}

