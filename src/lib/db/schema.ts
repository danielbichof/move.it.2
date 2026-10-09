import { date, index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
// Caminho relativo: o drizzle-kit lê este arquivo fora do Next e não resolve o alias `@/`
import { defaultCycleMinutes, type Pillar } from '../system-m'

// Todo registro tem dono (`userId`) desde já: o login entra depois sem mudar o esquema

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default(''),
  level: integer('level').notNull().default(1),
  currentExperience: integer('current_experience').notNull().default(0),
  challengesCompleted: integer('challenges_completed').notNull().default(0),
  cycleMinutes: integer('cycle_minutes').notNull().default(defaultCycleMinutes),
  // Sem chave estrangeira: remover o item em foco limpa este campo na mesma gravação
  focusId: text('focus_id')
})

export const items = pgTable(
  'items',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    pillar: text('pillar').$type<Pillar>().notNull(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull()
  },
  table => [index('items_user_idx').on(table.userId)]
)

export const inboxItems = pgTable(
  'inbox_items',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull()
  },
  table => [index('inbox_items_user_idx').on(table.userId)]
)

export const habits = pgTable(
  'habits',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    // Dia local do navegador (YYYY-MM-DD) em que foi marcado
    doneOn: date('done_on', { mode: 'string' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow()
  },
  table => [index('habits_user_idx').on(table.userId)]
)
