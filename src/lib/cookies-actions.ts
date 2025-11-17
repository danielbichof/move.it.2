'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface UserProgress {
  level: number
  currentExperience: number
  challengesCompleted: number
}

export async function getUserProgress(): Promise<UserProgress> {
  const cookiesStore = await cookies()
  
  return {
    level: Number(cookiesStore.get('level')?.value ?? 1),
    currentExperience: Number(cookiesStore.get('currentExperience')?.value ?? 0),
    challengesCompleted: Number(cookiesStore.get('challengesCompleted')?.value ?? 0)
  }
}

export async function updateUserProgress(progress: Partial<UserProgress>) {
  const cookiesStore = await cookies()
  
  if (progress.level !== undefined) {
    cookiesStore.set('level', String(progress.level))
  }
  
  if (progress.currentExperience !== undefined) {
    cookiesStore.set('currentExperience', String(progress.currentExperience))
  }
  
  if (progress.challengesCompleted !== undefined) {
    cookiesStore.set('challengesCompleted', String(progress.challengesCompleted))
  }
  
  revalidatePath('/')
}

export async function levelUp() {
  const progress = await getUserProgress()
  await updateUserProgress({
    level: progress.level + 1
  })
}

export async function completeChallenge(experienceAmount: number) {
  const progress = await getUserProgress()
  const experienceToNextLevel = Math.pow((progress.level + 1) * 4, 2)
  
  let finalExperience = progress.currentExperience + experienceAmount
  let newLevel = progress.level
  
  if (finalExperience >= experienceToNextLevel) {
    finalExperience = finalExperience - experienceToNextLevel
    newLevel = progress.level + 1
  }
  
  await updateUserProgress({
    currentExperience: finalExperience,
    challengesCompleted: progress.challengesCompleted + 1,
    level: newLevel
  })
  
  return { leveledUp: newLevel > progress.level }
}