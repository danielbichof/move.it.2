'use client'

import { useCountdownContext } from "../contexts/countdown-context";

export default function Countdown() {

  const { minutes, 
    seconds, 
    hasFinished, 
    isActive, 
    startCountdown, 
    resetCountdown
  } = useCountdownContext();
  

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split("");
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split("");

  
  return (
    <div>
      <div className="flex items-center font-semibold" style={{fontFamily: 'var(--font-rajdhani)', fontWeight: 600, color: 'var(--title)'}}>
        <div className="flex-1 flex items-center justify-evenly bg-white shadow-lg rounded text-center" style={{boxShadow: '0 0 60px rgba(0, 0, 0, 0.05)', fontSize: '8.5rem'}}>
          <span className="flex-1 border-r" style={{borderRightColor: '#f0f1f3'}}>{minuteLeft}</span>
          <span className="flex-1 border-l" style={{borderLeftColor: '#f0f1f3'}}>{minuteRight}</span>
        </div>
        <span className="mx-2" style={{fontSize: '6.25rem'}}>:</span>
        <div className="flex-1 flex items-center justify-evenly bg-white shadow-lg rounded text-center" style={{boxShadow: '0 0 60px rgba(0, 0, 0, 0.05)', fontSize: '8.5rem'}}>
          <span className="flex-1 border-r" style={{borderRightColor: '#f0f1f3'}}>{secondLeft}</span>
          <span className="flex-1 border-l" style={{borderLeftColor: '#f0f1f3'}}>{secondRight}</span>
        </div>
      </div>

      {hasFinished ? (
        <button 
        disabled 
        className="w-full h-20 mt-8 flex items-center justify-center border-0 rounded text-xl font-semibold cursor-not-allowed transition-colors" 
        style={{background: 'var(--white)', color: 'var(--text)'}}>
          Ciclo encerrado
        </button>
      ) : (
        <>
          {isActive ? (
            <button
              type="button"
              className="w-full h-20 mt-8 flex items-center justify-center border-0 rounded text-xl font-semibold transition-colors hover:brightness-90"
              style={{background: 'var(--white)', color: 'var(--title)'}}
              onMouseEnter={(e) => {(e.target as HTMLElement).style.background = 'var(--red)'; (e.target as HTMLElement).style.color = 'var(--white)'}}
              onMouseLeave={(e) => {(e.target as HTMLElement).style.background = 'var(--white)'; (e.target as HTMLElement).style.color = 'var(--title)'}}
              onClick={resetCountdown}
            >
              Abandonar ciclo
            </button>
          ) : (
            <button
              type="button"
              className="w-full h-20 mt-8 flex items-center justify-center border-0 rounded text-xl font-semibold transition-colors"
              style={{background: 'var(--blue)', color: 'var(--white)'}}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = 'var(--blue-dark)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'var(--blue)'}
              onClick={startCountdown}
            >
              Iniciar ciclo
            </button>
          )}
        </>
      )}
    </div>
  );
}
