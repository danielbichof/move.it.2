'use client'

import { useChallengesContext } from '../contexts/challenges-context'

export default  function Profile() {
    const { level } = useChallengesContext();

    return(
        <div className="flex items-center">
            <img src="https://github.com/danielbichof.png" alt='Daniel Bichof' className="w-22 h-22 rounded-full" style={{width: '5.5rem', height: '5.5rem'}} />
            <div className="ml-6">
                <strong className="text-2xl font-semibold" style={{color: 'var(--title)'}}>Daniel Bichof</strong>
                <p className="text-base mt-2 flex items-center">
                    <img src="icons/level.svg" alt="level" className="mr-2"/>
                    Level { level }
                </p>
            </div>
        </div>
    )
}