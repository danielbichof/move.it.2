import { cookies } from 'next/headers'
import Countdown from '@/src/components/countdown'
import LegacyImport from '@/src/components/legacy-import'
import TodayLists from '@/src/components/today-lists'
import TopHeader from '@/src/components/top-header'
import UnlockForm from '@/src/components/unlock-form'
import { ChallengesProvider } from '@/src/contexts/challenges-context'
import { CountdownProvider } from '@/src/contexts/countdown-context'
import { SystemMProvider } from '@/src/contexts/system-m-context'
import { loadAppData } from '@/src/lib/app-data'
import { hasAccess } from '@/src/lib/session'

// Os dados vêm do banco a cada visita: sem isto, um build sem APP_SECRET congelaria a tela de senha
export const dynamic = 'force-dynamic'

export default async function Home() {
  if (!(await hasAccess())) return <UnlockForm />

  const { progress, systemM } = await loadAppData()
  const hasLegacyCookies = (await cookies()).has('challengesCompleted')

  return (
    <SystemMProvider initialState={systemM}>
      <ChallengesProvider initialProgress={progress}>
        <CountdownProvider>
          <LegacyImport hasLegacyCookies={hasLegacyCookies} />
          <TopHeader />

          <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-4 pt-8 pb-16 md:px-8 md:pt-10">
            <h1 className="text-lg font-medium text-[var(--ink-soft)]">O que importa agora?</h1>

            <Countdown />

            <TodayLists />
          </main>
        </CountdownProvider>
      </ChallengesProvider>
    </SystemMProvider>
  )
}
