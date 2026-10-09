import { asc, eq } from 'drizzle-orm'
import { db } from '@/src/lib/db'
import { habits, inboxItems, items, users } from '@/src/lib/db/schema'
import type { UserProgress } from '@/src/lib/progress-actions'
import { requireUserId } from '@/src/lib/session'
import { defaultCycleMinutes, isCycleMinutes, type SystemM } from '@/src/lib/system-m'

export interface AppData {
  progress: UserProgress
  systemM: SystemM
}

// Tudo que a tela Hoje precisa. Na primeira visita cria o usuário
export async function loadAppData(): Promise<AppData> {
  const userId = await requireUserId()

  await db().insert(users).values({ id: userId }).onConflictDoNothing()

  const [[user], userItems, userInbox, userHabits] = await Promise.all([
    db().select().from(users).where(eq(users.id, userId)),
    db()
      .select({
        id: items.id,
        pillar: items.pillar,
        title: items.title,
        createdAt: items.createdAt
      })
      .from(items)
      .where(eq(items.userId, userId))
      .orderBy(asc(items.createdAt), asc(items.id)),
    db()
      .select({ id: inboxItems.id, text: inboxItems.text, createdAt: inboxItems.createdAt })
      .from(inboxItems)
      .where(eq(inboxItems.userId, userId))
      .orderBy(asc(inboxItems.createdAt), asc(inboxItems.id)),
    db()
      .select({ id: habits.id, name: habits.name, doneOn: habits.doneOn })
      .from(habits)
      .where(eq(habits.userId, userId))
      .orderBy(asc(habits.createdAt), asc(habits.id))
  ])

  return {
    progress: {
      level: user.level,
      currentExperience: user.currentExperience,
      challengesCompleted: user.challengesCompleted
    },
    systemM: {
      version: 2,
      userName: user.name,
      cycleMinutes: isCycleMinutes(user.cycleMinutes) ? user.cycleMinutes : defaultCycleMinutes,
      items: userItems,
      focusId: userItems.some(item => item.id === user.focusId) ? user.focusId : null,
      inbox: userInbox,
      habits: userHabits
    }
  }
}
