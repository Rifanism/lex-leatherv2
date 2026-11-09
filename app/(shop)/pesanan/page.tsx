import type { Metadata } from 'next'
import Link from 'next/link'
import { PackageOpen } from 'lucide-react'
import { requireUser } from '@/lib/session'
import { getOrderItemPreviews, getUserOrders } from '@/lib/queries'
import { formatDate, formatRupiah } from '@/lib/format'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProductImage } from '@/components/shop/product-image'
import { StatusBadge } from '@/components/shop/status-badge'

export const metadata: Metadata = { title: 'Pesanan Saya' }

export default async function OrdersPage() {
  const user = await requireUser()
  const orders = await getUserOrders(user.id)
  const items = await getOrderItemPreviews(orders.map((o) => o.id))

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="mb-10 space-y-3">
        <p className="eyebrow">Riwayat</p>
        <h1 className="text-5xl">Pesanan Saya</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-5 border border-dashed border-border py-24 text-center">
          <PackageOpen className="size-10 text-primary" strokeWidth={1} />
          <p className="font-serif text-3xl">Belum ada pesanan</p>
          <Link
            href="/produk"
            className={cn(buttonVariants(), 'h-12 rounded-none px-8 text-xs uppercase tracking-[0.28em]')}
          >
            Jelajahi Koleksi
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const own = items.filter((i) => i.orderId === order.id)
            return (
              <li key={order.id}>
                <Link
                  href={`/pesanan/${order.code}`}
                  className="flex flex-col gap-4 border border-border p-5 transition-colors hover:border-primary sm:flex-row sm:items-center"
                >
                  <div className="flex -space-x-3">
                    {own.slice(0, 3).map((i) => (
                      <div key={i.id} className="relative size-16 overflow-hidden border-2 border-background">
                        <ProductImage src={i.image ?? ''} alt={i.name} sizes="64px" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-serif text-xl">{order.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} &middot; {own.reduce((s, i) => s + i.quantity, 0)} barang
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-2">
                    <p className="font-serif text-xl text-primary">{formatRupiah(order.total)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
