import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ExternalLink, Landmark, MessageCircle } from 'lucide-react'
import { requireUser } from '@/lib/session'
import { getOrderByCode } from '@/lib/queries'
import { formatDateTime, formatRupiah, paymentLabel } from '@/lib/format'
import { PayButton } from '@/components/shop/pay-button'
import { ConfirmReceived } from '@/components/shop/confirm-received'
import { ProductImage } from '@/components/shop/product-image'
import { StatusBadge } from '@/components/shop/status-badge'
import { CopyButton } from '@/components/shop/copy-button'

export const metadata: Metadata = { title: 'Detail Pesanan' }

type Props = {
  params: Promise<{ code: string }>
  searchParams: Promise<{ bayar?: string }>
}

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const user = await requireUser()
  const { code } = await params
  const { bayar } = await searchParams
  const data = await getOrderByCode(code)
  if (!data || data.order.userId !== user.id) notFound()
  const { order, items } = data

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <Link
        href="/pesanan"
        className="mb-8 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" /> Semua Pesanan
      </Link>

      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">Pesanan</p>
          <h1 className="font-serif text-4xl md:text-5xl">{order.code}</h1>
          <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <ul className="border-t border-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 border-b border-border py-5">
                <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden border border-border">
                  <ProductImage src={item.image ?? ''} alt={item.name} sizes="80px" />
                </div>
                <div className="flex flex-1 justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatRupiah(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-primary">{formatRupiah(item.price * item.quantity)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 border border-border p-5">
              <p className="eyebrow">Dikirim ke</p>
              <p className="font-serif text-xl">{order.recipientName}</p>
              <p className="text-sm text-muted-foreground">{order.phone}</p>
              <p className="text-sm leading-relaxed">{order.address}</p>
            </div>
            <div className="space-y-3 border border-border p-5">
              <p className="eyebrow">Pembayaran &amp; Pengiriman</p>
              <p className="text-sm">
                Metode: <span className="text-primary">{paymentLabel(order.paymentType)}</span>
              </p>
              <p className="text-sm">Dibayar: {formatDateTime(order.paidAt)}</p>
              <div className="text-sm">
                <span className="text-muted-foreground">No. resi: </span>
                {order.trackingNumber ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono font-medium text-foreground">{order.trackingNumber}</span>
                    <CopyButton text={order.trackingNumber} label="Salin" />
                    <a
                      href={`https://cekresi.com/?noresi=${encodeURIComponent(order.trackingNumber)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 border border-border px-2 py-1 text-[0.68rem] uppercase tracking-wider text-primary transition-colors hover:border-primary"
                    >
                      <span>Lacak Paket</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                ) : (
                  <span>-</span>
                )}
              </div>
              {order.note && <p className="text-sm text-muted-foreground">Catatan: {order.note}</p>}
            </div>
          </div>

          {order.status === 'pending' && (
            <div className="space-y-5 border border-primary/40 bg-card/60 p-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
                  <Landmark className="size-4" />
                  <span>Instruksi Transfer Bank (Simulasi)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Silakan transfer tepat sesuai nominal tagihan ke rekening atelier kami:
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col justify-between border border-border bg-background/50 p-4">
                  <div className="space-y-1">
                    <p className="text-[0.68rem] uppercase tracking-widest text-muted-foreground">Bank BCA</p>
                    <p className="font-mono text-base font-semibold tracking-wider text-foreground">8830-1234-5678</p>
                    <p className="text-xs text-muted-foreground">a.n. PT Lex Leather Atelier</p>
                  </div>
                  <div className="mt-3">
                    <CopyButton text="883012345678" label="Salin BCA" />
                  </div>
                </div>

                <div className="flex flex-col justify-between border border-border bg-background/50 p-4">
                  <div className="space-y-1">
                    <p className="text-[0.68rem] uppercase tracking-widest text-muted-foreground">Bank Mandiri</p>
                    <p className="font-mono text-base font-semibold tracking-wider text-foreground">137-00-1234567-8</p>
                    <p className="text-xs text-muted-foreground">a.n. PT Lex Leather Atelier</p>
                  </div>
                  <div className="mt-3">
                    <CopyButton text="1370012345678" label="Salin Mandiri" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="text-xs text-muted-foreground">
                  Total Tagihan: <span className="font-serif text-base text-primary">{formatRupiah(order.total)}</span>
                </div>
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Lex Leather Atelier, saya ingin konfirmasi pembayaran untuk pesanan ${order.code} sebesar ${formatRupiah(order.total)} atas nama ${order.recipientName}. [Simulasi Bukti Transfer]`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-4 py-2 text-xs uppercase tracking-wider text-primary transition-colors hover:border-primary hover:bg-primary/20"
                >
                  <MessageCircle className="size-3.5" />
                  <span>Konfirmasi via WhatsApp (Simulasi)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-5 border border-border bg-card/60 p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatRupiah(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ongkos kirim</dt>
              <dd>{order.shippingCost === 0 ? 'Gratis' : formatRupiah(order.shippingCost)}</dd>
            </div>
          </dl>
          <div className="flex items-baseline justify-between border-t border-border pt-5">
            <span className="text-xs uppercase tracking-[0.25em]">Total</span>
            <span className="font-serif text-3xl text-primary">{formatRupiah(order.total)}</span>
          </div>
          {order.status === 'pending' && <PayButton code={order.code} total={order.total} autoStart={bayar === '1'} />}
          {order.status === 'shipped' && <ConfirmReceived code={order.code} />}
        </aside>
      </div>
    </div>
  )
}
