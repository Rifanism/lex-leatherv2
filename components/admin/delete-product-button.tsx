'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProduct } from '@/app/actions/admin'

export function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={`Hapus ${name}`}
      onClick={() => {
        if (!window.confirm(`Hapus "${name}"? Produk yang pernah dipesan hanya akan dinonaktifkan.`)) return
        startTransition(async () => {
          const result = await deleteProduct(id)
          if (!result.ok) toast.error(result.error)
          else toast.success('Produk dihapus')
          router.refresh()
        })
      }}
      className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  )
}
