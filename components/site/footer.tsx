import Link from 'next/link'
import { Logo } from '@/components/site/logo'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="space-y-4 md:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Tas dan dompet kulit asli yang dirancang untuk keseharian mahasiswa:
            kuat untuk tugas, anggun untuk presentasi dan sidang.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="eyebrow font-sans">Belanja</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" href="/produk">Semua Koleksi</Link></li>
            <li><Link className="hover:text-primary" href="/produk?kategori=tas">Tas</Link></li>
            <li><Link className="hover:text-primary" href="/produk?kategori=dompet">Dompet</Link></li>
            <li><Link className="hover:text-primary" href="/produk?kategori=aksesoris">Aksesoris</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="eyebrow font-sans">Akun</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" href="/akun">Profil &amp; Alamat</Link></li>
            <li><Link className="hover:text-primary" href="/pesanan">Pesanan Saya</Link></li>
            <li><Link className="hover:text-primary" href="/keranjang">Keranjang</Link></li>
          </ul>
        </div>
      </div>
      <div className="gold-rule" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
        <p>&copy; 2026 Lex Leather Atelier. Seluruh hak cipta dilindungi.</p>
        <p>Pembayaran aman: Transfer Bank, E-Wallet, QRIS</p>
      </div>
    </footer>
  )
}
