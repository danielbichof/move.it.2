'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { challenges } from '@/src/lib/challenges-data'
import { db } from '@/src/lib/db'
import { users } from '@/src/lib/db/schema'
import { requireUserId } from '@/src/lib/session'

export interface UserProgress {
  level: number
  currentExperience: number
  challengesCompleted: number
}

export async function completeChallenge(experienceAmount: number) {
  const userId = await requireUserId()

  // O xp vem do cliente: só vale se existir no catálogo de desafios
  if (!challenges.some(challenge => challenge.amount === experienceAmount)) {
    throw new Error('Desafio desconhecido')
  }

  const [progress] = await db()
    .select({
      level: users.level,
      currentExperience: users.currentExperience,
      challengesCompleted: users.challengesCompleted
    })
    .from(users)
    .where(eq(users.id, userId))

  if (!progress) throw new Error('Usuário não encontrado')

  const experienceToNextLevel = ((progress.level + 1) * 4) ** 2

  let finalExperience = progress.currentExperience + experienceAmount
  let newLevel = progress.level

  if (finalExperience >= experienceToNextLevel) {
    finalExperience = finalExperience - experienceToNextLevel
    newLevel = progress.level + 1
  }

  await db()
    .update(users)
    .set({
      currentExperience: finalExperience,
      challengesCompleted: progress.challengesCompleted + 1,
      level: newLevel
    })
    .where(eq(users.id, userId))

  revalidatePath('/')

  return { leveledUp: newLevel > progress.level }
}
