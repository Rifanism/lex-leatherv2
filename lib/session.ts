import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export type SessionUser = {
  id: string
  name: string
  email: string
  phone?: string | null
  role?: string | null
}

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() })
  return (session?.user as SessionUser | undefined) ?? null
})

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/masuk')
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/masuk?next=/admin')
  if (user.role !== 'admin') redirect('/')
  return user
}

export async function requireAdminAction(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin') throw new Error('Tidak diizinkan')
  return user
}

export async function requireUserAction(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) throw new Error('Silakan masuk terlebih dahulu')
  return user
}
