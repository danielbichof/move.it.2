import Countdown from '@/src/components/countdown'
import TodayLists from '@/src/components/today-lists'
import TopHeader from '@/src/components/top-header'
import { ChallengesProvider } from '@/src/contexts/challenges-context'
import { CountdownProvider } from '@/src/contexts/countdown-context'
import { getUserProgress } from '@/src/lib/cookies-actions'

export default async function Home() {
  const initialProgress = await getUserProgress()

  return (
    <ChallengesProvider initialProgress={initialProgress}>
      <CountdownProvider>
        <TopHeader />

        <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pt-8 pb-16 md:px-8 md:pt-10">
          <h1 className="text-[32px] leading-tight font-extrabold text-[var(--ink)]">
            O que importa agora?
          </h1>

          <Countdown />

          <TodayLists />
        </main>
      </CountdownProvider>
    </ChallengesProvider>
  )
}
