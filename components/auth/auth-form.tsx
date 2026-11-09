'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

type Props = { mode: 'masuk' | 'daftar'; next?: string }

export function AuthForm({ mode, next }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'daftar'
  const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))

    if (isSignUp) {
      const name = String(form.get('name'))
      const phone = String(form.get('phone') ?? '')
      if (password !== String(form.get('confirm'))) {
        setError('Konfirmasi kata sandi tidak cocok')
        setLoading(false)
        return
      }
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        phone: phone || undefined,
      } as Parameters<typeof authClient.signUp.email>[0])
      if (error) {
        setError('Pendaftaran gagal. Periksa data Anda atau coba email lain.')
        setLoading(false)
        return
      }
    } else {
      const { error } = await authClient.signIn.email({ email, password })
      if (error) {
        setError('Email atau kata sandi salah')
        setLoading(false)
        return
      }
    }
    router.push(target)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nama Lengkap</Label>
          <Input id="name" name="name" required autoComplete="name" className="h-12 rounded-none" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" className="h-12 rounded-none" />
      </div>
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nomor Telepon</Label>
          <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" className="h-12 rounded-none" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kata Sandi</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          className="h-12 rounded-none"
        />
      </div>
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Konfirmasi Kata Sandi</Label>
          <Input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="h-12 rounded-none" />
        </div>
      )}

      {error && (
        <p role="alert" className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="h-14 w-full rounded-none text-xs uppercase tracking-[0.28em]">
        {loading ? 'Memproses...' : isSignUp ? 'Buat Akun' : 'Masuk'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
        <Link
          href={isSignUp ? '/masuk' : '/daftar'}
          className="text-primary underline-offset-4 hover:underline"
        >
          {isSignUp ? 'Masuk' : 'Daftar sekarang'}
        </Link>
      </p>
    </form>
  )
}
