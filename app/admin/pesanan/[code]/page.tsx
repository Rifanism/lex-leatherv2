import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { getOrderByCode } from '@/lib/queries'
import { formatDateTime, formatRupiah, paymentLabel } from '@/lib/format'
import { OrderStatusForm } from '@/components/admin/order-status-form'
import { ProductImage } from '@/components/shop/product-image'
import { StatusBadge } from '@/components/shop/status-badge'

export const metadata: Metadata = { title: 'Detail Pesanan' }

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const data = await getOrderByCode(code)
  if (!data) notFound()
  const { order, items } = data
  const [customer] = await db
    .select({ name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, order.userId))
    .limit(1)

  return (
    <div className="space-y-8">
      <Link
        href="/admin/pesanan"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" /> Semua Pesanan
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">Pesanan</p>
          <h1 className="text-4xl md:text-5xl">{order.code}</h1>
          <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <ul className="border-t border-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 border-b border-border py-4">
                <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden border border-border">
                  <ProductImage src={item.image ?? ''} alt={item.name} sizes="64px" />
                </div>
                <div className="flex flex-1 justify-between gap-4 text-sm">
                  <div>
                    <p className="font-serif text-lg">{item.name}</p>
                    <p className="text-muted-foreground">{formatRupiah(item.price)} x {item.quantity}</p>
                  </div>
                  <p className="text-primary">{formatRupiah(item.price * item.quantity)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 border border-border p-5 text-sm">
              <p className="eyebrow">Pelanggan</p>
              <p className="font-serif text-xl">{customer?.name}</p>
              <p className="text-muted-foreground">{customer?.email}</p>
              <p className="pt-2 font-medium">{order.recipientName} &middot; {order.phone}</p>
              <p className="leading-relaxed text-muted-foreground">{order.address}</p>
              {order.note && <p>Catatan: {order.note}</p>}
            </div>
            <div className="space-y-2 border border-border p-5 text-sm">
              <p className="eyebrow">Pembayaran</p>
              <p>Metode: <span className="text-primary">{paymentLabel(order.paymentType)}</span></p>
              <p>Dibayar: {formatDateTime(order.paidAt)}</p>
              <p>Subtotal: {formatRupiah(order.subtotal)}</p>
              <p>Ongkir: {order.shippingCost === 0 ? 'Gratis' : formatRupiah(order.shippingCost)}</p>
              <p className="font-serif text-2xl text-primary">{formatRupiah(order.total)}</p>
            </div>
          </div>
        </div>

        <aside className="h-fit border border-border bg-card/60 p-6">
          <h2 className="mb-5 text-2xl">Kelola Pesanan</h2>
          <OrderStatusForm
            code={order.code}
            status={order.status}
            trackingNumber={order.trackingNumber ?? ''}
          />
        </aside>
      </div>
    </div>
  )
}
