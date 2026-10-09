import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

function connect() {
  const url = process.env.DATABASE_URL

  if (!url?.startsWith('postgres')) {
    throw new Error(
      'DATABASE_URL precisa apontar para um Postgres (defina em .env.local; local: pnpm db:up)'
    )
  }

  return drizzle({ client: new Pool({ connectionString: url }) })
}

// Guardada no `globalThis`: o hot reload do dev recarrega este módulo e abriria um pool por vez
const cache = globalThis as { moveitDb?: ReturnType<typeof connect> }

// Conexão criada no primeiro uso: o build não precisa de banco
export function db() {
  cache.moveitDb ??= connect()

  return cache.moveitDb
}
