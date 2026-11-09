import type { Metadata } from 'next'
import { getCustomers } from '@/lib/queries'
import { formatDate, formatRupiah } from '@/lib/format'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata: Metadata = { title: 'Pelanggan' }

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Komunitas</p>
        <h1 className="text-4xl md:text-5xl">Pelanggan</h1>
      </header>

      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead className="text-right">Pesanan</TableHead>
              <TableHead className="text-right">Total Belanja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Belum ada pelanggan terdaftar.
                </TableCell>
              </TableRow>
            )}
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-serif text-lg">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone || '-'}</TableCell>
                <TableCell>{formatDate(c.createdAt)}</TableCell>
                <TableCell className="text-right">{c.orderCount}</TableCell>
                <TableCell className="text-right text-primary">{formatRupiah(c.totalSpent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
