import type { Metadata } from 'next'
import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'
import { getAllProducts } from '@/lib/queries'
import { categoryLabel, formatRupiah } from '@/lib/format'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ProductImage } from '@/components/shop/product-image'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

export const metadata: Metadata = { title: 'Produk' }

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">Katalog</p>
          <h1 className="text-4xl md:text-5xl">Produk</h1>
        </div>
        <Link
          href="/admin/produk/baru"
          className={cn(buttonVariants(), 'h-12 rounded-none px-6 text-xs uppercase tracking-[0.25em]')}
        >
          <Plus className="mr-2 size-4" /> Tambah Produk
        </Link>
      </header>

      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="relative size-14 overflow-hidden border border-border">
                    <ProductImage src={p.image} alt={p.name} sizes="56px" />
                  </div>
                </TableCell>
                <TableCell className="font-serif text-lg">{p.name}</TableCell>
                <TableCell>{categoryLabel(p.category)}</TableCell>
                <TableCell className="text-right">{formatRupiah(p.price)}</TableCell>
                <TableCell className={cn('text-right', p.stock <= 5 && 'text-amber-400')}>{p.stock}</TableCell>
                <TableCell>
                  <span className={cn('text-xs uppercase tracking-[0.15em]', p.isActive ? 'text-emerald-400' : 'text-muted-foreground')}>
                    {p.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/produk/${p.id}`} aria-label={`Ubah ${p.name}`} className="text-muted-foreground hover:text-primary">
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
