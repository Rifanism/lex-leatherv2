'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/app/actions/cart'

export function AddToCart({
  productId,
  stock,
}: {
  productId: number
  stock: number
}) {
  const [quantity, setQuantity] = useState(1)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (stock <= 0) {
    return (
      <Button disabled className="h-14 w-full rounded-none text-xs uppercase tracking-[0.28em]">
        Stok Habis
      </Button>
    )
  }

  function handleAdd(buyNow: boolean) {
    startTransition(async () => {
      const result = await addToCart(productId, quantity)
      if (!result.ok) {
        if (result.needsLogin) {
          toast.info(result.error)
          router.push('/masuk?next=/produk')
          return
        }
        toast.error(result.error)
        return
      }
      if (buyNow) {
        router.push('/keranjang')
      } else {
        toast.success('Ditambahkan ke keranjang')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Jumlah
        </span>
        <div className="flex items-center border border-input">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            className="flex size-11 items-center justify-center transition-colors hover:text-primary disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            className="flex size-11 items-center justify-center transition-colors hover:text-primary disabled:opacity-40"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">Stok: {stock}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          onClick={() => handleAdd(false)}
          disabled={pending}
          variant="outline"
          className="h-14 rounded-none border-primary bg-transparent text-xs uppercase tracking-[0.28em] text-primary hover:bg-primary/10"
        >
          <ShoppingBag className="size-4" />
          Tambah ke Keranjang
        </Button>
        <Button
          onClick={() => handleAdd(true)}
          disabled={pending}
          className="h-14 rounded-none text-xs uppercase tracking-[0.28em]"
        >
          Beli Sekarang
        </Button>
      </div>
    </div>
  )
}
