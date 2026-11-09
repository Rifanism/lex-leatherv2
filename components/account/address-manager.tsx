'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Address } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { addAddress, deleteAddress, setDefaultAddress } from '@/app/actions/account'
import {
  AddressFields,
  emptyAddress,
  type AddressValues,
} from '@/components/shop/address-fields'

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [adding, setAdding] = useState(addresses.length === 0)
  const [values, setValues] = useState<AddressValues>(emptyAddress)

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action()
      if (!result.ok) toast.error(result.error ?? 'Terjadi kesalahan')
      else toast.success(success)
      router.refresh()
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await addAddress(values)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success('Alamat ditambahkan')
      setValues(emptyAddress)
      setAdding(false)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <li key={a.id} className="flex flex-col justify-between gap-4 border border-border p-5">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-primary" />
                <span className="font-serif text-xl">{a.label}</span>
                {a.isDefault && (
                  <span className="border border-primary px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-primary">
                    Utama
                  </span>
                )}
              </div>
              <p>{a.recipientName} &middot; {a.phone}</p>
              <p className="text-muted-foreground">
                {a.street}, {a.city}, {a.province} {a.postalCode}
              </p>
            </div>
            <div className="flex items-center justify-between">
              {!a.isDefault ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => setDefaultAddress(a.id), 'Alamat utama diubah')}
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
                >
                  Jadikan utama
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                disabled={pending}
                aria-label={`Hapus alamat ${a.label}`}
                onClick={() => run(() => deleteAddress(a.id), 'Alamat dihapus')}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {adding ? (
        <form onSubmit={submit} className="space-y-5 border border-border p-5">
          <h3 className="text-2xl">Alamat Baru</h3>
          <AddressFields values={values} onChange={setValues} idPrefix="account" />
          <div className="flex gap-3">
            <Button type="submit" disabled={pending} className="h-12 rounded-none px-8 text-xs uppercase tracking-[0.25em]">
              {pending ? 'Menyimpan...' : 'Simpan Alamat'}
            </Button>
            {addresses.length > 0 && (
              <Button type="button" variant="ghost" onClick={() => setAdding(false)} className="h-12 rounded-none text-xs uppercase tracking-[0.25em]">
                Batal
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button
          variant="outline"
          onClick={() => setAdding(true)}
          className="h-12 rounded-none border-primary px-8 text-xs uppercase tracking-[0.25em] text-primary"
        >
          <Plus className="mr-2 size-4" /> Tambah Alamat
        </Button>
      )}
    </div>
  )
}
