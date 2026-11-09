'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Address } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createOrder } from '@/app/actions/orders'
import {
  AddressFields,
  emptyAddress,
  type AddressValues,
} from '@/components/shop/address-fields'

export function CheckoutForm({
  addresses,
  defaultName,
  defaultPhone,
}: {
  addresses: Address[]
  defaultName: string
  defaultPhone: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const initial = addresses.find((a) => a.isDefault) ?? addresses[0]
  const [selected, setSelected] = useState<number | 'new'>(initial?.id ?? 'new')
  const [note, setNote] = useState('')
  const [address, setAddress] = useState<AddressValues>({
    ...emptyAddress,
    recipientName: defaultName,
    phone: defaultPhone,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createOrder(
        selected === 'new'
          ? { newAddress: address, note }
          : { addressId: selected, note },
      )
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      router.push(`/pesanan/${result.code}?bayar=1`)
    })
  }

  return (
    <form id="checkout-form" onSubmit={submit} className="space-y-10">
      <section className="space-y-5">
        <h2 className="text-3xl">Alamat Pengiriman</h2>
        <div role="radiogroup" aria-label="Pilih alamat" className="grid gap-3">
          {addresses.map((a) => (
            <label
              key={a.id}
              className={cn(
                'flex cursor-pointer gap-4 border p-4 transition-colors',
                selected === a.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
              )}
            >
              <input
                type="radio"
                name="address"
                className="mt-1 accent-[var(--primary)]"
                checked={selected === a.id}
                onChange={() => setSelected(a.id)}
              />
              <span className="space-y-1 text-sm">
                <span className="flex items-center gap-3">
                  <span className="font-serif text-lg">{a.label}</span>
                  {a.isDefault && (
                    <span className="border border-primary px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-primary">
                      Utama
                    </span>
                  )}
                </span>
                <span className="block">{a.recipientName} &middot; {a.phone}</span>
                <span className="block text-muted-foreground">
                  {a.street}, {a.city}, {a.province} {a.postalCode}
                </span>
              </span>
            </label>
          ))}
          <label
            className={cn(
              'flex cursor-pointer gap-4 border p-4 transition-colors',
              selected === 'new' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
            )}
          >
            <input
              type="radio"
              name="address"
              className="mt-1 accent-[var(--primary)]"
              checked={selected === 'new'}
              onChange={() => setSelected('new')}
            />
            <span className="font-serif text-lg">Gunakan alamat baru</span>
          </label>
        </div>

        {selected === 'new' && (
          <div className="border border-border p-5">
            <AddressFields values={address} onChange={setAddress} idPrefix="checkout" />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <Label htmlFor="note" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Catatan untuk penjual (opsional)
        </Label>
        <Textarea
          id="note"
          value={note}
          maxLength={300}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-24 rounded-none"
          placeholder="Contoh: tolong bungkus sebagai kado"
        />
      </section>

      <p className="text-sm text-muted-foreground">
        Pembayaran dilakukan di langkah berikutnya: Transfer Bank (Virtual Account), E-Wallet (GoPay, ShopeePay, DANA), atau QRIS.
      </p>

      <Button type="submit" disabled={pending} className="h-14 w-full rounded-none text-xs uppercase tracking-[0.28em] lg:hidden">
        {pending ? 'Memproses...' : 'Buat Pesanan & Bayar'}
      </Button>
    </form>
  )
}
