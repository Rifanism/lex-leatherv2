import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/session'
import { getAddresses, getCartItems } from '@/lib/queries'
import { formatRupiah } from '@/lib/format'
import { CheckoutForm } from '@/components/shop/checkout-form'
import { OrderSummary } from '@/components/shop/order-summary'
import { ProductImage } from '@/components/shop/product-image'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const user = await requireUser()
  const [items, addresses] = await Promise.all([
    getCartItems(user.id),
    getAddresses(user.id),
  ])
  if (items.length === 0) redirect('/keranjang')

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="mb-10 space-y-3">
        <p className="eyebrow">Langkah Terakhir</p>
        <h1 className="text-5xl">Checkout</h1>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <CheckoutForm
          addresses={addresses}
          defaultName={user.name}
          defaultPhone={user.phone ?? ''}
        />
        <OrderSummary subtotal={subtotal}>
          <ul className="space-y-3 border-t border-border pt-5">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <div className="relative size-14 shrink-0 overflow-hidden border border-border">
                  <ProductImage src={i.image} alt={i.name} sizes="56px" />
                </div>
                <span className="flex-1 leading-tight">
                  {i.name}
                  <span className="block text-xs text-muted-foreground">x{i.quantity}</span>
                </span>
                <span>{formatRupiah(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <button
            type="submit"
            form="checkout-form"
            className="hidden h-13 w-full bg-primary text-xs uppercase tracking-[0.28em] text-primary-foreground transition-opacity hover:opacity-90 lg:block"
          >
            Buat Pesanan &amp; Bayar
          </button>
        </OrderSummary>
      </div>
    </div>
  )
}
