import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/queries'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Ubah Produk' }

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) notFound()
  const product = await getProductById(numericId)
  if (!product) notFound()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Katalog</p>
        <h1 className="text-4xl md:text-5xl">Ubah Produk</h1>
      </header>
      <ProductForm product={product} />
    </div>
  )
}
