import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Até existir login há um único dono dos dados. Quando o login entrar, só este arquivo muda:
// `requireUserId` passa a devolver o usuário da sessão
const fixedUserId = 'daniel'

export const accessCookie = 'moveit-acesso'

// O cookie guarda um derivado da senha, nunca a senha
export function accessToken(secret: string) {
  return createHash('sha256').update(`moveit:${secret}`).digest('hex')
}

export function matches(value: string, expected: string) {
  const a = Buffer.from(value)
  const b = Buffer.from(expected)

  return a.length === b.length && timingSafeEqual(a, b)
}

// Sem APP_SECRET o app fica aberto em desenvolvimento e fechado em produção: com banco,
// qualquer pessoa com a URL leria e gravaria os dados
export async function hasAccess() {
  const secret = process.env.APP_SECRET

  if (!secret) return process.env.NODE_ENV !== 'production'

  const value = (await cookies()).get(accessCookie)?.value

  return value !== undefined && matches(value, accessToken(secret))
}

export async function requireUserId() {
  if (!(await hasAccess())) throw new Error('Acesso negado')

  return fixedUserId
}
