import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Gem, MessageCircle, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '@/lib/queries'
import { categoryLabel, formatRupiah } from '@/lib/format'
import { AddToCart } from '@/components/shop/add-to-cart'
import { ProductCard } from '@/components/shop/product-card'
import { ProductImage } from '@/components/shop/product-image'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produk tidak ditemukan' }
  return { title: product.name, description: product.description.slice(0, 160) }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isActive) notFound()

  const related = await getRelatedProducts(product.category, product.id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/produk" className="hover:text-primary">Koleksi</Link>
        <ChevronRight className="size-3" />
        <Link href={`/produk?kategori=${product.category}`} className="hover:text-primary">
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-card">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-col justify-center space-y-8 lg:py-8">
          <div className="space-y-4">
            <p className="eyebrow">{categoryLabel(product.category)}</p>
            <h1 className="text-4xl text-balance md:text-6xl">{product.name}</h1>
            <p className="font-serif text-3xl text-primary">{formatRupiah(product.price)}</p>
          </div>

          <div className="gold-rule" />

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          {product.material && (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">Material</dt>
                <dd className="mt-1">{product.material}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">Ketersediaan</dt>
                <dd className="mt-1">{product.stock > 0 ? `${product.stock} unit` : 'Habis'}</dd>
              </div>
            </dl>
          )}

          <div className="space-y-3">
            <AddToCart productId={product.id} stock={product.stock} />
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Lex Leather Atelier, saya ingin bertanya tentang produk "${product.name}" (${formatRupiah(product.price)})...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 border border-border text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <MessageCircle className="size-4 text-primary" />
              <span>Tanya Produk via WhatsApp</span>
            </a>
          </div>

          <ul className="grid gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center gap-3">
              <Gem className="size-4 text-primary" />
              <Link href="/perawatan" className="transition-colors hover:text-primary">
                Kulit asli full-grain
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-primary" />
              <Link href="/perawatan#garansi" className="transition-colors hover:text-primary">
                Garansi 1 tahun
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Truck className="size-4 text-primary" />
              <span>Dikirim dengan asuransi</span>
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="size-4 text-primary" />
              <Link href="/perawatan#garansi" className="transition-colors hover:text-primary">
                Retur 7 hari
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <div className="mb-10 space-y-3 text-center">
            <p className="eyebrow">Anda Mungkin Suka</p>
            <h2 className="text-4xl">Koleksi Serupa</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
