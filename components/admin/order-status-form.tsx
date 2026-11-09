'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ORDER_STATUSES } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateOrderStatus } from '@/app/actions/admin'

export function OrderStatusForm({
  code,
  status: initialStatus,
  trackingNumber: initialTracking,
}: {
  code: string
  status: string
  trackingNumber: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState(initialStatus)
  const [tracking, setTracking] = useState(initialTracking)

  function submit() {
    startTransition(async () => {
      const result = await updateOrderStatus(code, { status, trackingNumber: tracking })
      if (!result.ok) toast.error(result.error)
      else toast.success('Status pesanan diperbarui')
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="order-status" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={(value) => value && setStatus(value)}>
          <SelectTrigger id="order-status" className="h-12 w-full rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tracking" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nomor Resi</Label>
        <Input id="tracking" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="JNE / J&T / SiCepat..." className="h-12 rounded-none" />
      </div>
      <Button onClick={submit} disabled={pending} className="h-12 w-full rounded-none text-xs uppercase tracking-[0.25em]">
        {pending ? 'Menyimpan...' : 'Perbarui Pesanan'}
      </Button>
    </div>
  )
}
