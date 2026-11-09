import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { getAddresses } from '@/lib/queries'
import { AddressManager } from '@/components/account/address-manager'
import { ProfileForm } from '@/components/account/profile-form'

export const metadata: Metadata = { title: 'Akun Saya' }

export default async function AccountPage() {
  const user = await requireUser()
  const addresses = await getAddresses(user.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <p className="eyebrow">Akun</p>
          <h1 className="text-5xl">Halo, {user.name.split(' ')[0]}</h1>
        </div>
        <Link
          href="/pesanan"
          className="text-xs uppercase tracking-[0.25em] text-primary underline-offset-8 hover:underline"
        >
          Lihat pesanan saya
        </Link>
      </div>

      <section className="mb-16 space-y-6">
        <h2 className="text-3xl">Profil</h2>
        <div className="gold-rule" />
        <ProfileForm name={user.name} email={user.email} phone={user.phone ?? ''} />
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl">Buku Alamat</h2>
        <div className="gold-rule" />
        <AddressManager addresses={addresses} />
      </section>
    </div>
  )
}
