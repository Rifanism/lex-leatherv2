import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { requireUser } from '@/lib/session'
import { getCartItems } from '@/lib/queries'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CartItemRow } from '@/components/shop/cart-item-row'
import { OrderSummary } from '@/components/shop/order-summary'

export const metadata: Metadata = { title: 'Keranjang' }

export default async function CartPage() {
  const user = await requireUser()
  const items = await getCartItems(user.id)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="mb-10 space-y-3">
        <p className="eyebrow">Belanja</p>
        <h1 className="text-5xl">Keranjang</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-5 border border-dashed border-border py-24 text-center">
          <ShoppingBag className="size-10 text-primary" strokeWidth={1} />
          <p className="font-serif text-3xl">Keranjang Anda masih kosong</p>
          <Link
            href="/produk"
            className={cn(buttonVariants(), 'h-12 rounded-none px-8 text-xs uppercase tracking-[0.28em]')}
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="border-t border-border">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </ul>
          <OrderSummary subtotal={subtotal}>
            <Link
              href="/checkout"
              className={cn(buttonVariants(), 'h-13 w-full rounded-none text-xs uppercase tracking-[0.28em]')}
            >
              Lanjut ke Checkout
            </Link>
          </OrderSummary>
        </div>
      )}
    </div>
  )
}
