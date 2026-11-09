import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { getProducts } from '@/lib/queries'
import { CATEGORIES } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/shop/product-card'

export const metadata: Metadata = {
  title: 'Koleksi',
  description: 'Jelajahi tas, dompet, dan aksesoris kulit asli Lex Leather.',
}

type SearchParams = Promise<{ kategori?: string; q?: string; urut?: string }>

const sorts = [
  { value: '', label: 'Terbaru' },
  { value: 'termurah', label: 'Harga Terendah' },
  { value: 'termahal', label: 'Harga Tertinggi' },
]

function buildHref(params: { kategori?: string; q?: string; urut?: string }) {
  const search = new URLSearchParams()
  if (params.kategori) search.set('kategori', params.kategori)
  if (params.q) search.set('q', params.q)
  if (params.urut) search.set('urut', params.urut)
  const qs = search.toString()
  return qs ? `/produk?${qs}` : '/produk'
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { kategori, q, urut } = await searchParams
  const products = await getProducts({ category: kategori, q, sort: urut })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="mb-12 space-y-3 text-center">
        <p className="eyebrow">Lex Leather Atelier</p>
        <h1 className="text-5xl md:text-6xl">
          {kategori ? CATEGORIES.find((c) => c.value === kategori)?.label ?? 'Koleksi' : 'Semua Koleksi'}
        </h1>
        <div className="gold-rule mx-auto mt-4 w-40" />
      </div>

      <div className="mb-10 flex flex-col gap-6 border-y border-border py-5 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Kategori" className="flex flex-wrap gap-2">
          {[{ value: '', label: 'Semua' }, ...CATEGORIES].map((c) => {
            const active = (kategori ?? '') === c.value
            return (
              <Link
                key={c.value}
                href={buildHref({ kategori: c.value || undefined, q, urut })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'border px-5 py-2 text-xs uppercase tracking-[0.22em] transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
                )}
              >
                {c.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <form action="/produk" className="relative">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            {urut && <input type="hidden" name="urut" value={urut} />}
            <label htmlFor="search" className="sr-only">Cari produk</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="search"
              name="q"
              defaultValue={q}
              placeholder="Cari produk..."
              className="h-10 w-full border border-input bg-transparent pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:w-64"
            />
          </form>
          <div className="flex items-center gap-3 text-xs">
            <span className="uppercase tracking-[0.2em] text-muted-foreground">Urutkan</span>
            {sorts.map((s) => (
              <Link
                key={s.value}
                href={buildHref({ kategori, q, urut: s.value || undefined })}
                className={cn(
                  'transition-colors hover:text-primary',
                  (urut ?? '') === s.value ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl">Produk tidak ditemukan</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Coba kata kunci atau kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
