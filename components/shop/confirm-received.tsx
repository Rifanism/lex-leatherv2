'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { confirmReceived } from '@/app/actions/orders'

export function ConfirmReceived({ code }: { code: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      disabled={pending}
      className="h-12 w-full rounded-none text-xs uppercase tracking-[0.25em]"
      onClick={() =>
        startTransition(async () => {
          const result = await confirmReceived(code)
          if (!result.ok) toast.error(result.error)
          else toast.success('Terima kasih! Pesanan selesai.')
          router.refresh()
        })
      }
    >
      Pesanan Sudah Diterima
    </Button>
  )
}
