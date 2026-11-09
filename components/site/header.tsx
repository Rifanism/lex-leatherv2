import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getCartCount } from '@/lib/queries'
import { FREE_SHIPPING_THRESHOLD, formatRupiah } from '@/lib/format'
import { Logo } from '@/components/site/logo'
import { MobileNav } from '@/components/site/mobile-nav'
import { UserMenu } from '@/components/site/user-menu'

const links = [
  { href: '/produk', label: 'Koleksi' },
  { href: '/produk?kategori=tas', label: 'Tas' },
  { href: '/produk?kategori=dompet', label: 'Dompet' },
  { href: '/produk?kategori=aksesoris', label: 'Aksesoris' },
]

export async function Header() {
  const user = await getSessionUser()
  const cartCount = user ? await getCartCount(user.id) : 0

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="bg-primary px-4 py-1.5 text-center text-[0.68rem] uppercase tracking-[0.25em] text-primary-foreground">
        Gratis ongkir untuk pembelian di atas {formatRupiah(FREE_SHIPPING_THRESHOLD)}
      </div>
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <MobileNav links={links} />
        </div>

        <Logo />

        <div className="flex items-center justify-end gap-1 md:gap-3">
          <UserMenu
            user={user ? { name: user.name, email: user.email, role: user.role ?? 'customer' } : null}
          />
          <Link
            href="/keranjang"
            aria-label={`Keranjang, ${cartCount} item`}
            className="relative inline-flex size-10 items-center justify-center text-foreground transition-colors hover:text-primary"
          >
            <ShoppingBag className="size-5" strokeWidth={1.4} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
