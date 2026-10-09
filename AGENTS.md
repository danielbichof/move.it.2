# AGENTS.md

Move.it 2 — Pomodoro/gamification app. Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` committed; do not use npm/yarn/bun).

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint`, `pnpm lint:fix` (Biome: lint + format, config in `biome.json`)
- Typecheck: no script — run `pnpm exec tsc --noEmit`
- Local database: `pnpm db:up` / `pnpm db:down` (Postgres 17 in `docker-compose.yml`; wipe with `docker compose down -v`)
- Database: `pnpm db:generate` (after editing `src/lib/db/schema.ts`) and `pnpm db:migrate` (Drizzle Kit; migrations committed in `drizzle/`)
- **No tests exist** in this repo.

## Layout / architecture

- `app/` — App Router pages (at repo root, NOT under `src/`). `src/` holds UI code: `components/`, `contexts/`, `lib/`.
- `src/components/ui/` — primitivas genéricas sem estado de domínio (Button, Card, Modal, Tag, …). Componentes de domínio ficam um nível acima e compõem essas primitivas; **nomes de arquivo em inglês**, textos de UI em pt-BR.
- **Path alias**: `tsconfig.json` maps `@/*` → `./*` (repo root), so imports are `@/src/components/...`, never `@/components/...`.
- UI strings and commit messages are in **pt-BR**.
- Entry flow: `app/page.tsx` (server component, `force-dynamic`) checks `hasAccess()`, loads everything with `loadAppData()` (`src/lib/app-data.ts`), then wraps `<SystemMProvider>` > `<ChallengesProvider>` > `<CountdownProvider>`.
- **Persistence**: Postgres via Drizzle (`src/lib/db/`, driver `node-postgres`, so the same code runs on the local Docker database and on Neon; multi-statement writes use `db().transaction`). `DATABASE_URL` and `APP_SECRET` live in `.env.local`, which overrides the leftover `.env`. Every table has `userId`; until login exists `src/lib/session.ts` returns one fixed user and gates access with the `APP_SECRET` password (open in dev when unset, closed in production).
- **State**: three React contexts (`src/contexts/`). `SystemMProvider` and `ChallengesProvider` use `useOptimistic` over server-loaded data and call `'use server'` actions (`src/lib/system-m-actions.ts`, `src/lib/progress-actions.ts`) that write to the database + `revalidatePath('/')`. Root `challenges.json` is dead data — the real challenge list is `src/lib/challenges-data.ts`.

## Traps (don't get misled)

- **Biome replaces ESLint and Prettier**: `biome.json` is the only lint/format config (single quotes, no semicolons, 2-space indent, width 100, no trailing commas). `css.parser.tailwindDirectives` is on so Biome parses Tailwind v4 syntax in `app/globals.css`. `public/` is excluded.
- **Tailwind v4**: uses `@tailwindcss/postcss` + `@import "tailwindcss"` in `app/globals.css`. Theme tokens are CSS vars in `:root` there. `tailwind.config.ts` is v3-style and **not loaded** (no `@config` directive) — update colors/fonts in `globals.css`, not there.
- Fonts: Inter/Rajdhani via `next/font` in `app/layout.tsx` (`--font-inter`, `--font-rajdhani`).

## When editing

- Server/client split matters: files in `src/contexts/` are `'use client'`; every write goes through a `'use server'` action that starts with `requireUserId()`, validates its input and filters by `userId`.
- `src/lib/db/schema.ts` is also read by Drizzle Kit outside Next: use relative imports there, not the `@/` alias.
- Verify with `pnpm lint && pnpm exec tsc --noEmit` (and `pnpm build` for route-level changes).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
