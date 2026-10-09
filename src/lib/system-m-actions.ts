'use server'

import { and, eq, isNull, lt } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { db } from '@/src/lib/db'
import { habits, inboxItems, items, users } from '@/src/lib/db/schema'
import { requireUserId } from '@/src/lib/session'
import {
  defaultCycleMinutes,
  type Habit,
  type InboxItem,
  type Item,
  isCycleMinutes,
  type Pillar,
  parseSystemM,
  pillars
} from '@/src/lib/system-m'

// Tudo que chega aqui vem do cliente: cada action valida antes de gravar

function invalid(): never {
  throw new Error('Dados inválidos')
}

function id(value: unknown) {
  return typeof value === 'string' && /^[a-z0-9]{1,40}$/.test(value) ? value : invalid()
}

function text(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return invalid()

  const trimmed = value.trim()

  return trimmed && trimmed.length <= maxLength ? trimmed : invalid()
}

function pillar(value: unknown) {
  return pillars.some(option => option.id === value) ? (value as Pillar) : invalid()
}

function instant(value: unknown) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : invalid()
}

function day(value: unknown) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : invalid()
}

export async function addItem(item: Item) {
  const userId = await requireUserId()

  await db()
    .insert(items)
    .values({
      id: id(item.id),
      userId,
      pillar: pillar(item.pillar),
      title: text(item.title, 120),
      createdAt: instant(item.createdAt)
    })

  revalidatePath('/')
}

// Remover o item em foco limpa o foco na mesma gravação
export async function removeItem(itemId: string) {
  const userId = await requireUserId()

  const owned = and(eq(items.id, id(itemId)), eq(items.userId, userId))

  await db().transaction(async tx => {
    await tx.delete(items).where(owned)
    await tx
      .update(users)
      .set({ focusId: null })
      .where(and(eq(users.id, userId), eq(users.focusId, itemId)))
  })

  revalidatePath('/')
}

export async function setFocus(itemId: string | null) {
  const userId = await requireUserId()

  await db()
    .update(users)
    .set({ focusId: itemId === null ? null : id(itemId) })
    .where(eq(users.id, userId))

  revalidatePath('/')
}

export async function addInboxItem(entry: InboxItem) {
  const userId = await requireUserId()

  await db()
    .insert(inboxItems)
    .values({
      id: id(entry.id),
      userId,
      text: text(entry.text, 200),
      createdAt: instant(entry.createdAt)
    })

  revalidatePath('/')
}

export async function discardInboxItem(entryId: string) {
  const userId = await requireUserId()

  await db()
    .delete(inboxItems)
    .where(and(eq(inboxItems.id, id(entryId)), eq(inboxItems.userId, userId)))

  revalidatePath('/')
}

// A entrada sai da Inbox e entra no pilar escolhido, com o id que o cliente já mostra na tela
export async function moveInboxItem(entryId: string, item: Item) {
  const userId = await requireUserId()
  const owned = and(eq(inboxItems.id, id(entryId)), eq(inboxItems.userId, userId))

  const moved = { id: id(item.id), userId, pillar: pillar(item.pillar) }

  await db().transaction(async tx => {
    const [entry] = await tx.delete(inboxItems).where(owned).returning()

    if (!entry) return

    await tx.insert(items).values({ ...moved, title: entry.text, createdAt: entry.createdAt })
  })

  revalidatePath('/')
}

export async function addHabit(habit: Habit) {
  const userId = await requireUserId()

  await db()
    .insert(habits)
    .values({ id: id(habit.id), userId, name: text(habit.name, 60), doneOn: null })

  revalidatePath('/')
}

// `doneOn` é o dia local do navegador: o servidor não sabe o fuso do usuário
export async function setHabitDone(habitId: string, doneOn: string | null) {
  const userId = await requireUserId()

  await db()
    .update(habits)
    .set({ doneOn: doneOn === null ? null : day(doneOn) })
    .where(and(eq(habits.id, id(habitId)), eq(habits.userId, userId)))

  revalidatePath('/')
}

export async function removeHabit(habitId: string) {
  const userId = await requireUserId()

  await db()
    .delete(habits)
    .where(and(eq(habits.id, id(habitId)), eq(habits.userId, userId)))

  revalidatePath('/')
}

export async function setUserName(name: string) {
  const userId = await requireUserId()

  if (typeof name !== 'string' || name.length > 40) invalid()

  await db().update(users).set({ name: name.trim() }).where(eq(users.id, userId))

  revalidatePath('/')
}

export async function setCycleMinutes(minutes: number) {
  const userId = await requireUserId()

  if (!isCycleMinutes(minutes)) invalid()

  await db().update(users).set({ cycleMinutes: minutes }).where(eq(users.id, userId))

  revalidatePath('/')
}

function legacyCount(value: string | undefined) {
  const count = Number(value)

  return Number.isInteger(count) && count >= 0 ? count : null
}

// Migração única do que vivia no navegador: o Sistema M do localStorage (recebido como texto)
// e o progresso dos cookies antigos. Repetir a chamada não duplica nada
export async function importLegacy(raw: string | null) {
  const userId = await requireUserId()
  const cookiesStore = await cookies()
  const legacy = parseSystemM(typeof raw === 'string' ? raw : null)
  const owner = eq(users.id, userId)

  await db().transaction(async tx => {
    if (legacy.items.length > 0) {
      await tx
        .insert(items)
        .values(legacy.items.map(item => ({ ...item, title: item.title.slice(0, 120), userId })))
        .onConflictDoNothing()
    }

    if (legacy.inbox.length > 0) {
      await tx
        .insert(inboxItems)
        .values(legacy.inbox.map(entry => ({ ...entry, text: entry.text.slice(0, 200), userId })))
        .onConflictDoNothing()
    }

    if (legacy.habits.length > 0) {
      await tx
        .insert(habits)
        .values(
          legacy.habits.map(habit => ({
            id: habit.id,
            userId,
            name: habit.name.slice(0, 60),
            doneOn: habit.doneOn && /^\d{4}-\d{2}-\d{2}$/.test(habit.doneOn) ? habit.doneOn : null
          }))
        )
        .onConflictDoNothing()
    }

    // Nome, duração e foco do navegador só preenchem o que o banco ainda não tem
    if (legacy.userName) {
      await tx
        .update(users)
        .set({ name: legacy.userName.slice(0, 40) })
        .where(and(owner, eq(users.name, '')))
    }

    if (legacy.cycleMinutes !== defaultCycleMinutes) {
      await tx
        .update(users)
        .set({ cycleMinutes: legacy.cycleMinutes })
        .where(and(owner, eq(users.cycleMinutes, defaultCycleMinutes)))
    }

    if (legacy.focusId) {
      await tx
        .update(users)
        .set({ focusId: legacy.focusId })
        .where(and(owner, isNull(users.focusId)))
    }

    // O progresso dos cookies só entra se estiver à frente do que o banco já tem
    const level = legacyCount(cookiesStore.get('level')?.value)
    const currentExperience = legacyCount(cookiesStore.get('currentExperience')?.value)
    const challengesCompleted = legacyCount(cookiesStore.get('challengesCompleted')?.value)

    if (
      level !== null &&
      level >= 1 &&
      currentExperience !== null &&
      challengesCompleted !== null
    ) {
      await tx
        .update(users)
        .set({ level, currentExperience, challengesCompleted })
        .where(and(owner, lt(users.challengesCompleted, challengesCompleted)))
    }
  })

  for (const name of ['level', 'currentExperience', 'challengesCompleted']) {
    cookiesStore.delete(name)
  }

  revalidatePath('/')
}
