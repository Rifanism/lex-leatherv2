import { db } from './index.ts'
import { products } from './schema.ts'
import { eq } from 'drizzle-orm'

export const sampleProducts = [
  {
    slug: 'ransel-kulit-heritage-oxford',
    name: 'Ransel Kulit Heritage Oxford',
    description:
      'Tas ransel kulit sapi asli jenis crazy horse dengan kompartemen laptop berlapis busa 15 inch, saku organizer dokumen, dan saku botol tersembunyi. Tahan banting untuk mobilitas tinggi di kampus.',
    category: 'tas',
    price: 1_450_000,
    stock: 12,
    image: '/images/ransel-heritage.png',
    material: 'Full-Grain Crazy Horse Leather',
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'library-tote-minerva',
    name: 'Library Tote Minerva',
    description:
      'Tote bag kulit berkapasitas lega yang dirancang untuk membawa laptop, map tugas tebal, dan buku referensi perpustakaan dengan tali bahu ergonomis yang nyaman digunakan seharian.',
    category: 'tas',
    price: 1_150_000,
    stock: 15,
    image: '/images/library-tote.png',
    material: 'Pull-Up Cowhide Leather',
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'cambridge-messenger-bag',
    name: 'Cambridge Messenger Bag',
    description:
      'Tas selempang postman klasik dengan buckle kuningan antik. Sangat ideal untuk presentasi seminar dan kuliah sehari-hari dengan siluet ramping namun berkapasitas laptop 14 inch.',
    category: 'tas',
    price: 1_350_000,
    stock: 8,
    image: '/images/messenger-bag.png',
    material: 'Vegetable Tanned Leather',
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'laptop-sleeve-ravenna-14',
    name: 'Laptop Sleeve Ravenna 14 Inch',
    description:
      'Sleeve laptop berbahan kulit asli dengan lining microfiber lembut antiresidu dan magnetic closure. Melindungi laptop dari benturan sekaligus tampil elegan saat dibawa ke ruang sidang.',
    category: 'aksesoris',
    price: 480_000,
    stock: 25,
    image: '/images/laptop-sleeve.png',
    material: 'Smooth Napa Leather',
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'document-folio-sidang-a4',
    name: 'Document Folio Sidang A4',
    description:
      'Folder dokumen profesional ukuran A4 dengan slot pulpen, saku sertifikat, dan clipboard interior. Teman sempurna untuk sidang skripsi, wawancara kerja, dan magang industri.',
    category: 'aksesoris',
    price: 550_000,
    stock: 18,
    image: '/images/document-folio.png',
    material: 'Full-Grain Waxed Leather',
    isFeatured: false,
    isActive: true,
  },
  {
    slug: 'classic-bifold-wallet-siena',
    name: 'Classic Bifold Wallet Siena',
    description:
      'Dompet lipat dua klasik dengan 8 slot kartu, 2 kompartemen uang tunai, dan teknologi RFID blocking. Menua dengan patina yang semakin berkilau seiring pemakaian.',
    category: 'dompet',
    price: 390_000,
    stock: 30,
    image: '/images/bifold-wallet.png',
    material: 'Pull-Up Cowhide Leather',
    isFeatured: true,
    isActive: true,
  },
  {
    slug: 'continental-long-wallet-venezia',
    name: 'Continental Long Wallet Venezia',
    description:
      'Dompet panjang beresleting YKK antik yang mampu memuat smartphone tipis, paspor, kartu identitas mahasiswa, dan uang kertas tanpa perlu terlipat.',
    category: 'dompet',
    price: 520_000,
    stock: 14,
    image: '/images/long-wallet.png',
    material: 'Milled Cowhide Leather',
    isFeatured: false,
    isActive: true,
  },
  {
    slug: 'minimalist-card-holder-modena',
    name: 'Minimalist Card Holder Modena',
    description:
      'Tempat kartu saku ringkas dengan 5 slot kartu cepat ambil. Pas di saku kemeja atau saku depan celana jeans untuk transaksi cepat nontunai di kantin kampus.',
    category: 'dompet',
    price: 220_000,
    stock: 40,
    image: '/images/card-holder.png',
    material: 'Vegetable Tanned Leather',
    isFeatured: false,
    isActive: true,
  },
]

export async function seed() {
  console.log('🌱 Memulai proses seeding produk...')

  for (const item of sampleProducts) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, item.slug))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(products).values(item)
      console.log(`  ✓ Menambahkan: ${item.name}`)
    } else {
      console.log(`  - Sudah ada: ${item.name}`)
    }
  }

  console.log('✅ Seeding selesai dengan sukses!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Gagal melakukan seeding:', err)
  process.exit(1)
})
