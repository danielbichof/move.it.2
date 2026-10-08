import Countdown from '@/src/components/countdown'
import CycleFeedback from '@/src/components/cycle-feedback'
import FocusReminder from '@/src/components/focus-reminder'
import HabitList from '@/src/components/habit-list'
import Inbox from '@/src/components/inbox'
import LaterList from '@/src/components/later-list'
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

        <main className="mx-auto w-full max-w-[1440px] px-4 pb-12 md:px-[42px]">
          <div className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-[var(--surface)] px-4 py-8 shadow-[0_24px_70px_#a4b5d833] md:px-[30px] md:py-10">
            <header className="flex flex-col gap-2">
              <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--ink-soft)]">
                <span className="size-[9px] rounded-full bg-[#8fa8ff]" aria-hidden="true" />
                Hoje
              </span>
              <h1 className="text-[30px] font-extrabold text-[var(--ink)]">O que importa agora?</h1>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[810fr_462fr]">
              <Countdown />
              <FocusReminder />
            </div>

            <CycleFeedback />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[426fr_392fr_430fr]">
              <LaterList />
              <HabitList />
              <Inbox />
            </div>
          </div>
        </main>
      </CountdownProvider>
    </ChallengesProvider>
  )
}
