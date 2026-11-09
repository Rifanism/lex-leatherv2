import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/session'
import { Logo } from '@/components/site/logo'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminSignOut } from '@/components/admin/admin-sign-out'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin Lex Leather' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-card/60 lg:sticky lg:top-0 lg:h-svh lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-6 py-6 lg:flex-col lg:items-start lg:gap-2">
          <Logo href="/admin" />
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">Panel Admin</p>
        </div>
        <div className="px-2 pb-4 lg:px-0">
          <AdminNav />
        </div>
        <div className="hidden border-t border-border p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="truncate text-sm">{admin.name}</p>
          <p className="mb-3 truncate text-xs text-muted-foreground">{admin.email}</p>
          <AdminSignOut />
        </div>
      </aside>
      <main className="min-w-0 px-4 py-10 md:px-10">{children}</main>
    </div>
  )
}
