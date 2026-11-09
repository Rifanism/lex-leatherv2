import type { Metadata } from 'next'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Tambah Produk' }

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Katalog</p>
        <h1 className="text-4xl md:text-5xl">Tambah Produk</h1>
      </header>
      <ProductForm />
    </div>
  )
}
