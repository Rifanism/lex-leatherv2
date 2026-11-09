'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, Package, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth-client'

type Props = {
  user: { name: string; email: string; role: string } | null
}

export function UserMenu({ user }: Props) {
  const router = useRouter()

  if (!user) {
    return (
      <Link
        href="/masuk"
        className="px-3 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:text-primary"
      >
        Masuk
      </Link>
    )
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu akun"
        className="inline-flex size-10 items-center justify-center text-foreground outline-none transition-colors hover:text-primary"
      >
        <User className="size-5" strokeWidth={1.4} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-border bg-popover">
        <div className="space-y-0.5 px-1.5 py-1.5">
          <p className="truncate font-serif text-base">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        {user.role === 'admin' && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <LayoutDashboard className="size-4" /> Dashboard Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem render={<Link href="/akun" />}>
          <User className="size-4" /> Profil &amp; Alamat
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/pesanan" />}>
          <Package className="size-4" /> Pesanan Saya
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut className="size-4" /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
