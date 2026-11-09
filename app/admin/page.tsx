import Link from 'next/link'
import { AlertTriangle, Banknote, Clock, PackageCheck, Users } from 'lucide-react'
import { getAdminStats } from '@/lib/queries'
import { formatDate, formatRupiah } from '@/lib/format'
import { StatusBadge } from '@/components/shop/status-badge'

function lastSevenDays(daily: { day: string; total: number }[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    return {
      key,
      label: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      total: daily.find((x) => x.day === key)?.total ?? 0,
    }
  })
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()
  const days = lastSevenDays(stats.daily)
  const max = Math.max(...days.map((d) => d.total), 1)

  const cards = [
    { label: 'Pendapatan', value: formatRupiah(stats.revenue), hint: `${stats.paidOrders} pesanan dibayar`, icon: Banknote },
    { label: 'Perlu Dikirim', value: String(stats.toShip), hint: 'Sudah dibayar / diproses', icon: PackageCheck },
    { label: 'Menunggu Bayar', value: String(stats.pending), hint: 'Belum ada pembayaran', icon: Clock },
    { label: 'Pelanggan', value: String(stats.customers), hint: `${stats.activeProducts} produk aktif`, icon: Users },
  ]

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="eyebrow">Ringkasan</p>
        <h1 className="text-4xl md:text-5xl">Dashboard</h1>
      </header>

      <section aria-label="Statistik" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="space-y-3 border border-border bg-card/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
              <Icon className="size-4 text-primary" strokeWidth={1.5} />
            </div>
            <p className="font-serif text-3xl text-primary">{value}</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="space-y-6 border border-border bg-card/60 p-6">
          <h2 className="text-2xl">Penjualan 7 Hari Terakhir</h2>
          <div className="flex h-48 items-end gap-3" role="img" aria-label="Grafik penjualan 7 hari terakhir">
            {days.map((d) => (
              <div key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="w-full bg-primary/80 transition-all"
                  style={{ height: `${Math.max((d.total / max) * 100, d.total > 0 ? 4 : 1)}%` }}
                  title={formatRupiah(d.total)}
                />
                <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 border border-border bg-card/60 p-6">
          <h2 className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="size-5 text-amber-400" strokeWidth={1.5} /> Stok Menipis
          </h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">Semua stok aman.</p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <Link href={`/admin/produk/${p.id}`} className="hover:text-primary">{p.name}</Link>
                  <span className={p.stock === 0 ? 'text-destructive' : 'text-amber-400'}>
                    {p.stock === 0 ? 'Habis' : `${p.stock} sisa`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="space-y-4 border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Pesanan Terbaru</h2>
          <Link href="/admin/pesanan" className="text-xs uppercase tracking-[0.2em] text-primary hover:underline">
            Semua pesanan
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.recentOrders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/pesanan/${o.code}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm hover:text-primary"
                >
                  <span className="font-medium">{o.code}</span>
                  <span className="text-muted-foreground">{formatDate(o.createdAt)}</span>
                  <span>{formatRupiah(o.total)}</span>
                  <StatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
