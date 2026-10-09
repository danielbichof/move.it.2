import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { defineConfig } from 'drizzle-kit'

// O drizzle-kit roda fora do Next e só carrega o .env. Aqui vale a mesma ordem do Next:
// o .env.local sobrepõe o .env
const env = { ...process.env }

for (const file of ['.env', '.env.local']) {
  if (existsSync(file)) Object.assign(env, parseEnv(readFileSync(file, 'utf8')))
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL ?? ''
  }
})
