import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Masuk' }

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const user = await getSessionUser()
  if (user) redirect(next?.startsWith('/') && !next.startsWith('//') ? next : user.role === 'admin' ? '/admin' : '/')

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl">Selamat Datang</h1>
        <p className="text-sm text-muted-foreground">Masuk untuk melanjutkan belanja Anda.</p>
      </div>
      <AuthForm mode="masuk" next={next} />
    </div>
  )
}
