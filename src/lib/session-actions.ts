'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { accessCookie, accessToken, matches } from '@/src/lib/session'

const oneYear = 60 * 60 * 24 * 365

export async function unlock(_previous: string | null, formData: FormData) {
  const secret = process.env.APP_SECRET
  const password = formData.get('password')

  if (!secret) return 'Defina APP_SECRET no servidor para liberar o acesso.'

  if (typeof password !== 'string' || !matches(password, secret)) return 'Senha incorreta.'

  const cookiesStore = await cookies()

  cookiesStore.set(accessCookie, accessToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: oneYear,
    path: '/'
  })

  revalidatePath('/')

  return null
}
