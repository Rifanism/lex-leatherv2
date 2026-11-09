import Link from 'next/link'
import type { Product } from '@/lib/db/schema'
import { categoryLabel, formatRupiah } from '@/lib/format'
import { ProductImage } from '@/components/shop/product-image'

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${formatRupiah(product.price)}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-card">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {soldOut && (
          <span className="absolute left-3 top-3 bg-background/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            Habis
          </span>
        )}
        {!soldOut && product.stock <= 5 && (
          <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-primary-foreground">
            Sisa {product.stock}
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-background/90 py-3 text-center text-[0.7rem] uppercase tracking-[0.28em] text-primary transition-transform duration-500 group-hover:translate-y-0">
          Lihat Detail
        </span>
      </div>
      <div className="mt-4 space-y-1 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-serif text-xl leading-tight transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="text-sm text-primary">{formatRupiah(product.price)}</p>
      </div>
    </Link>
  )
}
