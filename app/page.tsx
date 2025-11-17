import ChallengeBox from '@/src/components/challenge-box'
import CompletedChallenges from '@/src/components/completed-challenges'
import Countdown from '@/src/components/countdown'
import ExperienceBar from '@/src/components/experience-bar'
import Profile from '@/src/components/profile'
import { ChallengesProvider } from '@/src/contexts/challenges-context'
import { CountdownProvider } from '@/src/contexts/countdown-context'
import { getUserProgress } from '@/src/lib/cookies-actions'

export default async function Home() {
  const initialProgress = await getUserProgress()

  return (
    <ChallengesProvider
        initialProgress={initialProgress}
      >
          <div className="min-h-screen max-w-[992px] m-auto flex flex-col items-center bg-background">
          <ExperienceBar />

          <CountdownProvider>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

              <div className="flex flex-col gap-6">
                <Profile />
                <CompletedChallenges />
                <Countdown />
              </div>

              <div>
                <ChallengeBox />
              </div>

            </section>
          </CountdownProvider>

        </div>
      </ChallengesProvider>
  )
}
