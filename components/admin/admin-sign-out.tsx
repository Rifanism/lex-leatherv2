'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function AdminSignOut() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut()
        router.push('/masuk')
        router.refresh()
      }}
      className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
    >
      <LogOut className="size-4" /> Keluar
    </button>
  )
}
