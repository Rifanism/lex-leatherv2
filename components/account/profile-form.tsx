'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/app/actions/account'

export function ProfileForm({
  name,
  email,
  phone,
}: {
  name: string
  email: string
  phone: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [values, setValues] = useState({ name, phone })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await updateProfile(values)
      if (!result.ok) toast.error(result.error)
      else toast.success('Profil diperbarui')
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="profile-name" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nama Lengkap</Label>
        <Input
          id="profile-name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
          className="h-12 rounded-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</Label>
        <Input id="profile-email" value={email} disabled className="h-12 rounded-none" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-phone" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nomor Telepon</Label>
        <Input
          id="profile-phone"
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          placeholder="08xxxxxxxxxx"
          className="h-12 rounded-none"
        />
      </div>
      <Button type="submit" disabled={pending} className="h-12 rounded-none px-10 text-xs uppercase tracking-[0.25em]">
        {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  )
}
