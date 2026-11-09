'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Landmark, QrCode, ShieldCheck, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cancelOrder, simulatePayment } from '@/app/actions/orders'
import { formatRupiah } from '@/lib/format'

type Method = {
  value: string
  label: string
  kind: 'va' | 'ewallet' | 'qris'
  prefix?: string
}

const groups: { group: string; icon: typeof Landmark; items: Method[] }[] = [
  {
    group: 'Transfer Bank',
    icon: Landmark,
    items: [
      { value: 'bca_va', label: 'BCA Virtual Account', kind: 'va', prefix: '39201' },
      { value: 'bni_va', label: 'BNI Virtual Account', kind: 'va', prefix: '8810' },
      { value: 'bri_va', label: 'BRI Virtual Account', kind: 'va', prefix: '26215' },
      { value: 'mandiri_va', label: 'Mandiri Virtual Account', kind: 'va', prefix: '88608' },
    ],
  },
  {
    group: 'E-Wallet',
    icon: Wallet,
    items: [
      { value: 'gopay', label: 'GoPay', kind: 'ewallet' },
      { value: 'shopeepay', label: 'ShopeePay', kind: 'ewallet' },
      { value: 'dana', label: 'DANA', kind: 'ewallet' },
      { value: 'ovo', label: 'OVO', kind: 'ewallet' },
    ],
  },
  {
    group: 'QRIS',
    icon: QrCode,
    items: [{ value: 'qris', label: 'QRIS (semua aplikasi)', kind: 'qris' }],
  },
]

function hashCode(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function fakeVaNumber(code: string, prefix: string) {
  const digits = String(hashCode(`${code}${prefix}`)).padStart(10, '0')
  return `${prefix}${digits}`.replace(/(.{4})/g, '$1 ').trim()
}

function FakeQr({ seed }: { seed: string }) {
  const size = 25
  const cells = useMemo(() => {
    let state = hashCode(seed) || 1
    const next = () => {
      state ^= state << 13
      state ^= state >>> 17
      state ^= state << 5
      return (state >>> 0) / 4294967296
    }
    const inFinder = (x: number, y: number) =>
      (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)
    const out: { x: number; y: number }[] = []
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!inFinder(x, y) && next() > 0.52) out.push({ x, y })
      }
    }
    return out
  }, [seed])

  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`} transform={`translate(${ox} ${oy})`}>
      <rect width="7" height="7" fill="#111" />
      <rect x="1" y="1" width="5" height="5" fill="#fff" />
      <rect x="2" y="2" width="3" height="3" fill="#111" />
    </g>
  )

  return (
    <svg
      viewBox={`-1 -1 ${size + 2} ${size + 2}`}
      className="mx-auto size-48 bg-white"
      role="img"
      aria-label="Kode QRIS simulasi"
      shapeRendering="crispEdges"
    >
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="1" height="1" fill="#111" />
      ))}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
    </svg>
  )
}

export function PayButton({
  code,
  total,
  autoStart,
}: {
  code: string
  total: number
  autoStart?: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState<Method | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (autoStart && !started.current) {
      started.current = true
      setOpen(true)
    }
  }, [autoStart])

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setMethod(null)
  }

  function confirmPayment() {
    if (!method) return
    startTransition(async () => {
      const result = await simulatePayment(code, method.value)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      setOpen(false)
      setMethod(null)
      toast.success('Pembayaran berhasil (simulasi)')
      router.replace(`/pesanan/${code}`)
      router.refresh()
    })
  }

  function cancel() {
    startTransition(async () => {
      const result = await cancelOrder(code)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success('Pesanan dibatalkan')
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={() => setOpen(true)}
        disabled={pending}
        className="h-14 w-full rounded-none text-xs uppercase tracking-[0.28em]"
      >
        Bayar Sekarang
      </Button>
      <Button
        variant="ghost"
        onClick={cancel}
        disabled={pending}
        className="w-full rounded-none text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive"
      >
        Batalkan Pesanan
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-md">
          {!method ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-3xl">Pilih Metode Pembayaran</DialogTitle>
                <DialogDescription>
                  Payment gateway simulasi untuk keperluan tugas. Tidak ada uang sungguhan yang diproses.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {groups.map((g) => (
                  <div key={g.group} className="space-y-2">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
                      <g.icon className="size-4" /> {g.group}
                    </p>
                    <div className="grid gap-2">
                      {g.items.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setMethod(m)}
                          className="border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-3xl">{method.label}</DialogTitle>
                <DialogDescription>
                  Total pembayaran{' '}
                  <span className="text-primary">{formatRupiah(total)}</span> untuk pesanan {code}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {method.kind === 'va' && (
                  <div className="space-y-2 border border-border p-5 text-center">
                    <p className="eyebrow">Nomor Virtual Account</p>
                    <p className="font-mono text-2xl tracking-wider text-primary">
                      {fakeVaNumber(code, method.prefix ?? '')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Salin nomor ini di aplikasi mobile banking Anda (simulasi).
                    </p>
                  </div>
                )}
                {method.kind === 'ewallet' && (
                  <div className="space-y-2 border border-border p-5 text-center">
                    <p className="eyebrow">Konfirmasi di aplikasi {method.label}</p>
                    <p className="text-sm text-muted-foreground">
                      Permintaan pembayaran akan dikirim ke aplikasi {method.label} Anda (simulasi).
                    </p>
                  </div>
                )}
                {method.kind === 'qris' && (
                  <div className="space-y-3 border border-border p-5 text-center">
                    <FakeQr seed={code} />
                    <p className="text-xs text-muted-foreground">
                      Pindai dengan aplikasi bank atau e-wallet apa pun (simulasi).
                    </p>
                  </div>
                )}

                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p>Tekan tombol di bawah untuk mensimulasikan pembayaran berhasil.</p>
                </div>

                <Button
                  onClick={confirmPayment}
                  disabled={pending}
                  className="h-12 w-full rounded-none text-xs uppercase tracking-[0.25em]"
                >
                  {pending ? 'Memproses...' : 'Simulasikan Pembayaran Berhasil'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setMethod(null)}
                  disabled={pending}
                  className="w-full rounded-none text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                  <ArrowLeft className="size-4" /> Ganti Metode
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
