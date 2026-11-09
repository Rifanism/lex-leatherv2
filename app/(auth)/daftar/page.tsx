import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Daftar' }

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const user = await getSessionUser()
  if (user) redirect('/')

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl">Buat Akun</h1>
        <p className="text-sm text-muted-foreground">
          Bergabung untuk menyimpan alamat, keranjang, dan riwayat pesanan.
        </p>
      </div>
      <AuthForm mode="daftar" next={next} />
    </div>
  )
}
