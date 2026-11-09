import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Gem, Laptop, ShieldCheck, Truck } from 'lucide-react'
import { getProducts } from '@/lib/queries'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/shop/product-card'

const marquee = [
  'Kulit Sapi Asli',
  'Jahitan Tangan',
  'Muat Laptop 14 Inci',
  'Garansi 1 Tahun',
  'Bayar dengan QRIS',
  'Dirancang untuk Mahasiswa',
]

const features = [
  {
    icon: Laptop,
    title: 'Siap untuk Kampus',
    text: 'Kompartemen laptop berlapis, saku dokumen, dan ruang untuk buku tebal tanpa kehilangan siluet yang rapi.',
  },
  {
    icon: Gem,
    title: 'Kulit yang Menua Indah',
    text: 'Full-grain leather dengan finishing minyak alami. Semakin sering dipakai, semakin dalam patinanya.',
  },
  {
    icon: ShieldCheck,
    title: 'Garansi Satu Tahun',
    text: 'Jahitan dan hardware kami garansi penuh. Perbaikan pertama gratis untuk setiap pelanggan.',
  },
  {
    icon: Truck,
    title: 'Pengiriman Aman',
    text: 'Dikemas dalam dust bag dan kotak premium, dikirim ke seluruh Indonesia dengan asuransi.',
  },
]

export default async function HomePage() {
  const featured = await getProducts({ featured: true, limit: 4 })
  const latest = featured.length > 0 ? featured : await getProducts({ limit: 4 })

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100vh-7rem)] items-end overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Tas ransel kulit Lex Leather di atas meja kerja mahasiswa"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
          <div className="max-w-2xl space-y-6">
            <p className="eyebrow animate-rise">Koleksi Mahasiswa 2026</p>
            <h1 className="animate-rise text-5xl leading-[1.02] text-balance [animation-delay:120ms] md:text-7xl">
              Kulit asli untuk <em className="gold-text pr-1">perjalanan</em> akademikmu
            </h1>
            <p className="max-w-lg animate-rise text-base leading-relaxed text-foreground/80 [animation-delay:240ms] md:text-lg">
              Tas dan dompet yang dibuat untuk tugas, presentasi, hingga hari
              sidang. Tahan bertahun-tahun, tampil elegan setiap hari.
            </p>
            <div className="flex animate-rise flex-wrap gap-3 pt-2 [animation-delay:360ms]">
              <Link
                href="/produk"
                className={cn(
                  buttonVariants(),
                  'h-13 rounded-none px-8 text-xs uppercase tracking-[0.28em]',
                )}
              >
                Jelajahi Koleksi
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/produk?kategori=dompet"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-13 rounded-none border-foreground/30 bg-background/30 px-8 text-xs uppercase tracking-[0.28em] backdrop-blur',
                )}
              >
                Lihat Dompet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Keunggulan" className="overflow-hidden border-y border-border bg-card/50 py-5">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-12 font-serif text-xl italic text-foreground/80"
            >
              {item}
              <span aria-hidden className="text-primary">&#9670;</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-24 md:px-8">
        <div className="mb-12 space-y-3 text-center">
          <p className="eyebrow">Pilihan Kurator</p>
          <h2 className="text-4xl md:text-5xl">Koleksi Unggulan</h2>
          <div className="gold-rule mx-auto mt-4 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {latest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 border-b border-primary pb-1 text-xs uppercase tracking-[0.28em] text-primary transition-opacity hover:opacity-70"
          >
            Lihat Semua Produk <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-28 grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-8">
        {[
          { href: '/produk?kategori=tas', label: 'Tas', img: '/images/messenger-bag.png', alt: 'Tas messenger kulit' },
          { href: '/produk?kategori=dompet', label: 'Dompet', img: '/images/bifold-wallet.png', alt: 'Dompet bifold kulit' },
          { href: '/produk?kategori=aksesoris', label: 'Aksesoris', img: '/images/card-holder.png', alt: 'Card holder kulit' },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative aspect-[4/5] overflow-hidden border border-border md:aspect-[3/4]"
          >
            <Image
              src={c.img}
              alt={c.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <h3 className="text-4xl">{c.label}</h3>
              <span className="flex size-11 items-center justify-center border border-primary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="grain mx-auto mt-28 max-w-7xl border-y border-border px-4 py-20 md:px-8">
        <div className="mb-14 max-w-2xl space-y-3">
          <p className="eyebrow">Filosofi Kami</p>
          <h2 className="text-4xl text-balance md:text-5xl">
            Dibuat untuk <em className="gold-text">tugas</em>, presentasi, dan sidang
          </h2>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="space-y-4 bg-background p-8">
              <f.icon className="size-7 text-primary" strokeWidth={1.2} />
              <h3 className="text-2xl">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
