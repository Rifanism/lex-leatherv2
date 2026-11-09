import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Droplets,
  Gem,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Panduan Perawatan & Garansi 1 Tahun',
  description:
    'Panduan merawat tas dan dompet kulit asli full-grain Lex Leather, proses penuaan patina alami, dan ketentuan klaim garansi 1 tahun.',
}

const CARE_STEPS = [
  {
    icon: Droplets,
    title: 'Terkena Hujan atau Air',
    text: 'Jika tas terkena air hujan, segera seka perlahan dengan kain microfiber bersih dan kering. Jangan digosok kasar. Biarkan mengering alami pada suhu ruangan dengan sirkulasi udara baik.',
  },
  {
    icon: Sun,
    title: 'Hindari Panas Berlebih',
    text: 'Jangan pernah mengeringkan kulit asli menggunakan hair dryer, oven, atau menjemurnya langsung di bawah terik matahari yang menyengat, karena dapat membuat pori-pori kulit kaku dan pecah-pecah.',
  },
  {
    icon: Sparkles,
    title: 'Nutrisi Kulit Berkala',
    text: 'Oleskan leather balm atau mink oil netral setiap 3–6 bulan sekali untuk menjaga kelenturan dan mencegah kekeringan, terutama setelah sering dipakai di ruangan ber-AC.',
  },
  {
    icon: Wind,
    title: 'Penyimpanan & Sirkulasi',
    text: 'Saat tidak digunakan dalam jangka waktu lama, simpan tas di dalam dust bag katun bernapas yang kami sediakan. Hindari membungkusnya dalam kantong plastik rapat agar tidak memicu kelembapan berlebih.',
  },
]

const WARRANTY_COVERAGE = [
  'Jahitan pelana (saddle stitch) yang terurai atau terputus.',
  'Hardware logam: ritsleting YKK macet, kancing jepret magnetik lepas.',
  'Gesper strap atau pengait ring D yang patah karena beban wajar.',
  'Lem pinggiran kulit (edge paint) yang mengelupas abnormal.',
]

const WARRANTY_EXCLUSIONS = [
  'Kerusakan akibat terkena tumpahan cairan kimia keras (alkohol, cat kuku, cairan parfum pekat).',
  'Goresan fisik disengaja atau cakaran hewan peliharaan.',
  'Sobekan kulit akibat membawa beban melampaui kapasitas wajar tas.',
  'Perubahan warna alami (patina) karena penyerapan minyak tangan — ini adalah tanda keaslian kulit, bukan cacat.',
]

export default function PerawatanPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      {/* Header */}
      <div className="mb-14 space-y-4 text-center">
        <p className="eyebrow">Lex Leather Atelier</p>
        <h1 className="text-4xl text-balance md:text-6xl">
          Panduan Perawatan &amp; Garansi
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          Kulit sapi asli (*full-grain*) adalah material organik yang hidup. Dengan perawatan yang tepat, tas dan dompet Anda akan menua secara anggun dan bertahan selama bertahun-tahun masa perkuliahan hingga dunia kerja.
        </p>
        <div className="gold-rule mx-auto mt-6 w-32" />
      </div>

      {/* Philosophy of Patina */}
      <section className="mb-20 border border-border bg-card/50 p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <span className="eyebrow">Pesona Kulit Asli</span>
            <h2 className="text-3xl md:text-4xl">
              Keindahan <em className="gold-text">Patina</em> Alami
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Berbeda dengan kulit imitasi / sintetis yang mengelupas seiring waktu, kulit sapi full-grain menyerap jejak perjalanan Anda. Gesekan pakaian, paparan sinar matahari, dan minyak alami tangan akan menciptakan kilau gelap yang kaya dan unik (*patina*).
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Goresan kecil halus pada awal pemakaian adalah hal wajar; goresan tersebut akan memudar dan berbaur menjadi karakter unik tas Anda.
            </p>
          </div>
          <div className="space-y-4 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div className="flex items-start gap-3">
              <Gem className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-serif text-lg text-foreground">100% Full-Grain Vegetable Tanned</p>
                <p className="text-xs text-muted-foreground">Lapisan terkuat dari kulit sapi dengan serat terpadat.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-serif text-lg text-foreground">Jahitan Kuat Berstandar Atelier</p>
                <p className="text-xs text-muted-foreground">Benang nilon bonded tahan aus di titik-titik tumpuan beban.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-serif text-lg text-foreground">Dibuat untuk Penggunaan Harian</p>
                <p className="text-xs text-muted-foreground">Dirancang tahan terhadap ritme kuliah, sidang, dan magang.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Care Rules */}
      <section className="mb-20 space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <p className="eyebrow">Instruksi Praktis</p>
          <h2 className="text-3xl md:text-4xl">4 Langkah Merawat Kulit</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {CARE_STEPS.map((step) => (
            <div
              key={step.title}
              className="space-y-4 border border-border bg-card/40 p-6 transition-colors hover:border-primary/50"
            >
              <step.icon className="size-6 text-primary" strokeWidth={1.4} />
              <h3 className="font-serif text-2xl text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Warranty Section */}
      <section id="garansi" className="mb-20 space-y-10 scroll-mt-24">
        <div className="space-y-2 text-center md:text-left">
          <p className="eyebrow">Perlindungan Pembelian</p>
          <h2 className="text-3xl md:text-4xl">Garansi 1 Tahun Atelier</h2>
          <p className="text-sm text-muted-foreground">
            Kami menjamin setiap produk Lex Leather bebas dari cacat pengerjaan dan kerusakan material struktural selama 12 bulan sejak tanggal pembelian.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Covered */}
          <div className="space-y-4 border border-primary/40 bg-card/60 p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              <h3 className="font-serif text-xl text-foreground">Yang Dijamin Garansi</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {WARRANTY_COVERAGE.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Excluded */}
          <div className="space-y-4 border border-border bg-card/40 p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-muted-foreground" />
              <h3 className="font-serif text-xl text-foreground">Bukan Cakupan Garansi</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {WARRANTY_EXCLUSIONS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Claim Procedure */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-serif text-2xl text-foreground">Alur Klaim Garansi &amp; Retur</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Proses klaim dibuat sederhana tanpa prosedur yang berbelit-belit:
          </p>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            <li className="space-y-2 border-t border-border pt-4">
              <span className="font-serif text-2xl text-primary">01</span>
              <p className="font-serif text-lg">Foto Bagian Rusak</p>
              <p className="text-xs text-muted-foreground">
                Ambil foto jelas bagian yang bermasalah beserta nomor pesanan Anda (AUR-XXXX).
              </p>
            </li>
            <li className="space-y-2 border-t border-border pt-4">
              <span className="font-serif text-2xl text-primary">02</span>
              <p className="font-serif text-lg">Hubungi Concierge</p>
              <p className="text-xs text-muted-foreground">
                Kirimkan foto ke WhatsApp Concierge kami untuk evaluasi teknis tim pengrajin.
              </p>
            </li>
            <li className="space-y-2 border-t border-border pt-4">
              <span className="font-serif text-2xl text-primary">03</span>
              <p className="font-serif text-lg">Perbaikan / Penggantian</p>
              <p className="text-xs text-muted-foreground">
                Kirimkan produk ke workshop kami untuk perbaikan gratis atau penukaran unit baru (retur 7 hari).
              </p>
            </li>
          </ol>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="size-4 text-primary" />
              <span>Jaminan retur 7 hari jika barang yang diterima cacat produksi saat unboxing.</span>
            </div>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Lex%20Leather%20Atelier,%20saya%20ingin%20konsultasi%20klaim%20garansi%20pesanan..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="size-4" />
              <span>Hubungi CS via WhatsApp (Simulasi)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Return to Shop CTA */}
      <div className="text-center">
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 border-b border-primary pb-1 text-xs uppercase tracking-[0.28em] text-primary transition-opacity hover:opacity-75"
        >
          Lihat Semua Koleksi Produk Kulit &rarr;
        </Link>
      </div>
    </div>
  )
}
