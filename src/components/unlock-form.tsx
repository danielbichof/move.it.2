'use client'

import { useActionState } from 'react'
import Button from '@/src/components/ui/button'
import Card from '@/src/components/ui/card'
import { BoltIcon } from '@/src/components/ui/icons'
import TextField from '@/src/components/ui/text-field'
import { unlock } from '@/src/lib/session-actions'

// Porta única enquanto não há login: a senha é a APP_SECRET do servidor
export default function UnlockForm() {
  const [error, submit, isPending] = useActionState(unlock, null)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[400px] flex-col justify-center px-4">
      <Card as="section" elevation="raised" className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-[10px]">
          <BoltIcon className="size-6 text-[var(--header-brand)]" />
          <h1 className="text-lg font-bold text-[var(--ink)]">move.it</h1>
        </div>

        <form action={submit} className="flex flex-col gap-3">
          <TextField
            label="Senha de acesso"
            placeholder="Senha de acesso"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full"
          />
          <Button type="submit" variant="cta" size="md" disabled={isPending}>
            Entrar
          </Button>
          <p className="min-h-5 text-xs font-semibold text-[var(--red)]" role="alert">
            {error ?? ''}
          </p>
        </form>
      </Card>
    </main>
  )
}
