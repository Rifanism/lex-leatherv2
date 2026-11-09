import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllOrders } from '@/lib/queries'
import { ORDER_STATUSES, formatDateTime, formatRupiah, paymentLabel } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/shop/status-badge'

export const metadata: Metadata = { title: 'Pesanan' }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status = 'all' } = await searchParams
  const rows = await getAllOrders(status)

  const filters = [{ value: 'all', label: 'Semua' }, ...ORDER_STATUSES]

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Transaksi</p>
        <h1 className="text-4xl md:text-5xl">Pesanan</h1>
      </header>

      <nav aria-label="Filter status" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/admin/pesanan' : `/admin/pesanan?status=${f.value}`}
            className={cn(
              'border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors',
              status === f.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Tidak ada pesanan.
                </TableCell>
              </TableRow>
            )}
            {rows.map(({ order, customerName, customerEmail }) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/admin/pesanan/${order.code}`} className="font-medium text-primary hover:underline">
                    {order.code}
                  </Link>
                </TableCell>
                <TableCell>
                  <p>{customerName}</p>
                  <p className="text-xs text-muted-foreground">{customerEmail}</p>
                </TableCell>
                <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                <TableCell>{paymentLabel(order.paymentType)}</TableCell>
                <TableCell className="text-right">{formatRupiah(order.total)}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
