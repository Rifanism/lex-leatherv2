'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Store, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/produk', label: 'Produk', icon: Package },
  { href: '/admin/pesanan', label: 'Pesanan', icon: ShoppingBag },
  { href: '/admin/pelanggan', label: 'Pelanggan', icon: Users },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-3 border-l-2 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors',
              active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
      <Link
        href="/"
        className="flex shrink-0 items-center gap-3 border-l-2 border-transparent px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground lg:mt-6"
      >
        <Store className="size-4" />
        Lihat Toko
      </Link>
    </nav>
  )
}
