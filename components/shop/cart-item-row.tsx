'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatRupiah } from '@/lib/format'
import { removeCartItem, updateCartQuantity } from '@/app/actions/cart'
import { ProductImage } from '@/components/shop/product-image'

type Item = {
  id: number
  quantity: number
  name: string
  slug: string
  price: number
  stock: number
  image: string
}

export function CartItemRow({ item }: { item: Item }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function change(quantity: number) {
    startTransition(async () => {
      const result = await updateCartQuantity(item.id, quantity)
      if (!result.ok) toast.error(result.error)
      router.refresh()
    })
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(item.id)
      toast.success('Produk dihapus dari keranjang')
      router.refresh()
    })
  }

  return (
    <li className="flex gap-4 border-b border-border py-6 sm:gap-6" aria-busy={pending}>
      <Link
        href={`/produk/${item.slug}`}
        className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden border border-border sm:w-32"
      >
        <ProductImage src={item.image} alt={item.name} sizes="128px" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex justify-between gap-4">
          <div>
            <Link href={`/produk/${item.slug}`} className="font-serif text-xl hover:text-primary sm:text-2xl">
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{formatRupiah(item.price)}</p>
          </div>
          <p className="font-serif text-lg text-primary sm:text-xl">
            {formatRupiah(item.price * item.quantity)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-input">
            <button
              type="button"
              aria-label="Kurangi jumlah"
              disabled={pending || item.quantity <= 1}
              onClick={() => change(item.quantity - 1)}
              className="flex size-9 items-center justify-center hover:text-primary disabled:opacity-40"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-9 text-center text-sm tabular-nums">{item.quantity}</span>
            <button
              type="button"
              aria-label="Tambah jumlah"
              disabled={pending || item.quantity >= item.stock}
              onClick={() => change(item.quantity + 1)}
              className="flex size-9 items-center justify-center hover:text-primary disabled:opacity-40"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Hapus</span>
            <span className="sr-only sm:hidden">Hapus {item.name}</span>
          </button>
        </div>
      </div>
    </li>
  )
}
