# AGENTS.md

Move.it 2 — Pomodoro/gamification app. Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` committed; do not use npm/yarn/bun).

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint`, `pnpm lint:fix` (Biome: lint + format, config in `biome.json`)
- Typecheck: no script — run `pnpm exec tsc --noEmit`
- **No tests exist** in this repo.

## Layout / architecture

- `app/` — App Router pages (at repo root, NOT under `src/`). `src/` holds UI code: `components/`, `contexts/`, `lib/`.
- `src/components/ui/` — primitivas genéricas sem estado de domínio (Button, Card, Modal, Tag, …). Componentes de domínio ficam um nível acima e compõem essas primitivas; **nomes de arquivo em inglês**, textos de UI em pt-BR.
- **Path alias**: `tsconfig.json` maps `@/*` → `./*` (repo root), so imports are `@/src/components/...`, never `@/components/...`.
- UI strings and commit messages are in **pt-BR**.
- Entry flow: `app/page.tsx` (server component) reads cookie progress via server action `getUserProgress`, then wraps `<ChallengesProvider>` > `<CountdownProvider>`.
- **State**: two React contexts (`src/contexts/`). `ChallengesProvider` uses `useOptimistic` over server-loaded progress and calls server actions in `src/lib/cookies-actions.ts` (`'use server'`) that persist to cookies + `revalidatePath('/')`. There is no database: `.env`'s `DATABASE_URL` is unused, root `challenges.json` is dead data — the real challenge list is `src/lib/challenges-data.ts`.

## Traps (don't get misled)

- **Biome replaces ESLint and Prettier**: `biome.json` is the only lint/format config (single quotes, no semicolons, 2-space indent, width 100, no trailing commas). `css.parser.tailwindDirectives` is on so Biome parses Tailwind v4 syntax in `app/globals.css`. `public/` is excluded.
- **Tailwind v4**: uses `@tailwindcss/postcss` + `@import "tailwindcss"` in `app/globals.css`. Theme tokens are CSS vars in `:root` there. `tailwind.config.ts` is v3-style and **not loaded** (no `@config` directive) — update colors/fonts in `globals.css`, not there.
- Fonts: Inter/Rajdhani via `next/font` in `app/layout.tsx` (`--font-inter`, `--font-rajdhani`).

## When editing

- Server/client split matters: files in `src/contexts/` are `'use client'`; cookie mutations must go through the `'use server'` actions in `src/lib/cookies-actions.ts`.
- Verify with `pnpm lint && pnpm exec tsc --noEmit` (and `pnpm build` for route-level changes).
