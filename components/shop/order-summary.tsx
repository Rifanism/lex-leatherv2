import { FREE_SHIPPING_THRESHOLD, formatRupiah, shippingFor } from '@/lib/format'

export function OrderSummary({
  subtotal,
  children,
}: {
  subtotal: number
  children?: React.ReactNode
}) {
  const shipping = shippingFor(subtotal)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <aside className="h-fit space-y-5 border border-border bg-card/60 p-6 lg:sticky lg:top-28">
      <h2 className="text-2xl">Ringkasan Pesanan</h2>
      <div className="gold-rule" />
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatRupiah(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Ongkos kirim</dt>
          <dd>{shipping === 0 ? 'Gratis' : formatRupiah(shipping)}</dd>
        </div>
      </dl>
      {remaining > 0 && subtotal > 0 && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Belanja {formatRupiah(remaining)} lagi untuk gratis ongkir.
        </p>
      )}
      <div className="flex items-baseline justify-between border-t border-border pt-5">
        <span className="text-xs uppercase tracking-[0.25em]">Total</span>
        <span className="font-serif text-3xl text-primary">
          {formatRupiah(subtotal + shipping)}
        </span>
      </div>
      {children}
    </aside>
  )
}
